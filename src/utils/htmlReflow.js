/* ==========================================================================
   htmlReflow.js — PDF2HTML absolute-position text → clean responsive semantic HTML
   --------------------------------------------------------------------------
   All pdf2html output has each text snippet inside `<div class="t cX">` with
   `transform:matrix(1,0,0,1,X,Y)`.  The engine below:
     1. Parses the embedded `.cX { font-size / color / … }` stylesheet
     2. Collects every `.t` text run with (x, y, fontSize, color, text)
     3. Clusters runs into lines by Y-bucket (vertical tolerance ~60% of fontSize)
     4. Sorts each line by X → concatenates into a readable line
     5. Classifies each line into Heading/Paragraph/ListItem via fontSize & color
     6. Detects tables (grid of small runs with identical Y-step across columns)
     7. Collapses multi-page empty space → one continuous document
   ========================================================================== */

const Y_BUCKET_RATIO = 0.6;
const PARAGRAPH_GAP_RATIO = 1.25;
const HEADING_COLOR_DARK = '#262c46';
const ACCENT_ORANGE = '#f76703';
const MUTED_GRAY = '#666666';

function parseStylesheet(htmlText) {
  const result = new Map();
  if (!htmlText) return result;
  const regex = /\.(c\d+)\s*\{\s*([^}]*)\s*\}/g;
  let m;
  while ((m = regex.exec(htmlText)) !== null) {
    const cls = m[1];
    const body = m[2];
    let fontSize = 14;
    let color = '#1a1a1a';
    let italic = false;
    let bold = false;
    const fs = /font-size\s*:\s*([0-9.]+)px/i.exec(body);
    if (fs) fontSize = parseFloat(fs[1]);
    const co = /color\s*:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/i.exec(body);
    if (co) color = co[1];
    if (/font-style\s*:\s*italic/i.test(body)) italic = true;
    if (/font-weight\s*:\s*(bold|[6-9]\d\d)/i.test(body)) bold = true;
    result.set(cls, { fontSize, color, italic, bold });
  }
  return result;
}

const MATRIX_RE = /transform\s*:\s*matrix\(\s*1\s*,\s*0\s*,\s*0\s*,\s*1\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)/;

function extractTextRuns(htmlText, styleMap, pages) {
  const runs = [];
  const pageHeights = new Map();
  for (const p of pages) pageHeights.set(p.id, p.height || 1123);

  // Naive regex extraction — good enough for pdf2html output which is predictable.
  const runRe = /<div\s+class="t\s+([^"]+)"\s+style="([^"]*)">([\s\S]*?)<\/div>/g;
  let m, runId = 0;
  while ((m = runRe.exec(htmlText)) !== null) {
    const classes = m[1].split(/\s+/);
    const styleStr = m[2];
    const rawText = m[3].replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '');
    const text = decodeHtml(rawText).replace(/\u00a0/g, ' ');
    if (!text || !text.trim()) continue;

    const matrix = MATRIX_RE.exec(styleStr);
    if (!matrix) continue;
    const x = parseFloat(matrix[1]);
    const y = parseFloat(matrix[2]);

    let cls = classes.find((c) => styleMap.has(c));
    const meta = cls ? styleMap.get(cls) : { fontSize: 14, color: '#1a1a1a' };
    runs.push({
      id: runId++,
      x, y,
      fontSize: meta.fontSize,
      color: meta.color,
      italic: meta.italic,
      bold: meta.bold,
      text,
      cls: cls || '',
    });
  }
  return runs;
}

function extractPages(htmlText) {
  const pageRe = /<div\s+class="page"\s+id="(p\d+)"(?:\s+style="([^"]*)")?>/g;
  const pages = [];
  let m, idx = 0;
  while ((m = pageRe.exec(htmlText)) !== null) {
    const id = m[1];
    const style = m[2] || '';
    let height = 1123, width = 794;
    const hw = /height\s*:\s*([\d.]+)px/i.exec(style);
    const ww = /width\s*:\s*([\d.]+)px/i.exec(style);
    if (hw) height = parseFloat(hw[1]);
    if (ww) width = parseFloat(ww[1]);
    pages.push({ id, index: idx++, height, width });
  }

  const ruleRe = /#(p\d+)\s*\{\s*width\s*:\s*([\d.]+)px\s*;\s*height\s*:\s*([\d.]+)px\s*\}/g;
  while ((m = ruleRe.exec(htmlText)) !== null) {
    const id = m[1];
    const page = pages.find((p) => p.id === id);
    if (page) {
      page.width = parseFloat(m[2]);
      page.height = parseFloat(m[3]);
    }
  }
  return pages;
}

function assignRunsToPages(runs, pages) {
  // pdf2html pages are positioned sequentially; Y values are per-page.
  // All pages share same coordinate origin.  We use the median Y spread per page
  // inferred from runs; for typical single-page docs this is trivial.
  if (pages.length <= 1) {
    return runs.map((r) => ({ ...r, pageIndex: 0 }));
  }
  // Buckets based on Y ranges
  const sorted = [...runs].sort((a, b) => a.y - b.y);
  const globalMaxY = sorted[sorted.length - 1]?.y || 0;
  const estPageH = Math.max(...pages.map((p) => p.height), globalMaxY + 200);
  return runs.map((r) => {
    const pageIndex = Math.min(pages.length - 1, Math.floor(r.y / estPageH) || 0);
    return { ...r, pageIndex };
  });
}

function normalizeRunsAcrossPages(runs, pages) {
  // Convert per-page Y into global-document Y, removing page gaps.
  if (pages.length <= 1) return runs;
  const pageHeights = pages.map((p) => p.height);
  const PAGE_GAP_COLLAPSE = 0; // collapse page boundary entirely — continuous notes
  let out = [];
  let accumulatedHeight = 0;
  for (let i = 0; i < pages.length; i++) {
    const pageRuns = runs.filter((r) => r.pageIndex === i);
    const maxY = pageRuns.reduce((m, r) => Math.max(m, r.y + r.fontSize), 0);
    const h = pageHeights[i] || maxY + 150;
    const translated = pageRuns.map((r) => ({
      ...r,
      y: r.y + accumulatedHeight,
      pageHeight: h,
    }));
    out = out.concat(translated);
    accumulatedHeight += Math.max(maxY + 120, h * 0.75); // keep only actual content height
  }
  return out;
}

function groupIntoLines(runs) {
  if (runs.length === 0) return [];
  const sorted = [...runs].sort((a, b) => a.y - b.y || a.x - b.x);
  const lines = [];
  for (const run of sorted) {
    // Find existing line whose bucket Y is within tolerance
    const tol = Math.max(3, run.fontSize * Y_BUCKET_RATIO);
    let line = lines.find((l) => Math.abs(l.avgY - run.y) <= tol);
    if (!line) {
      line = { runs: [], avgY: run.y, yMin: run.y, yMax: run.y, dominantFs: run.fontSize };
      lines.push(line);
    }
    line.runs.push(run);
    line.yMin = Math.min(line.yMin, run.y);
    line.yMax = Math.max(line.yMax, run.y);
    line.avgY = (line.yMin + line.yMax) / 2;
  }
  // Re-sort lines by avg Y
  lines.sort((a, b) => a.avgY - b.avgY);
  for (const line of lines) {
    line.runs.sort((a, b) => a.x - b.x);
    line.text = concatenateRuns(line.runs);
    const fsFreq = new Map();
    for (const r of line.runs) fsFreq.set(r.fontSize, (fsFreq.get(r.fontSize) || 0) + 1);
    let best = 0, bestFs = line.runs[0]?.fontSize || 14;
    for (const [fs, c] of fsFreq) {
      if (c > best) { best = c; bestFs = fs; }
    }
    line.dominantFs = bestFs;
    line.hasOrange = line.runs.some((r) => r.color?.toLowerCase().startsWith('#f76'));
    line.isMuted = line.runs.every((r) => r.color?.toLowerCase() === MUTED_GRAY);
    line.isDark = line.runs.some((r) => r.color?.toLowerCase() === HEADING_COLOR_DARK);
    const x0 = line.runs[0]?.x ?? 0;
    line.indent = x0;
  }
  return lines;
}

function concatenateRuns(runs) {
  let out = '';
  let prevEnd = -Infinity;
  for (const r of runs) {
    // If previous run ended significantly before this run's x, add a space.
    // Heuristic: previous x + estimated width of text.
    let gap = r.x - prevEnd;
    if (prevEnd !== -Infinity && gap > Math.max(2, r.fontSize * 0.28)) {
      out += ' ';
    }
    out += r.text;
    // estimate run width from text length (pdf2html monospace-ish fallback)
    const avgCharW = r.fontSize * 0.58;
    prevEnd = r.x + Math.max(r.text.length * avgCharW, 0);
  }
  return out.replace(/\s{2,}/g, ' ').trim();
}

function classifyBlock(line, prevLine, nextLine) {
  const fs = line.dominantFs;
  // Very small / muted → footnote or caption
  if (fs <= 12.2 && line.isMuted) return { type: 'caption' };
  // Orange → bullet markers / callouts
  if (line.hasOrange && line.text.trim().length <= 3) {
    return { type: 'bulletMarker' };
  }
  if (fs >= 21) return { type: 'h1' };
  if (fs >= 18.5) return { type: 'h1' };
  if (fs >= 17) return { type: 'h2' };
  if (fs >= 15.8 && line.isDark) return { type: 'h2' };
  if (fs >= 15.2) return { type: 'h2' };
  if (fs >= 13.6 && line.isDark) return { type: 'h3' };
  if (fs >= 13.6) return { type: 'h3' };
  // Otherwise paragraph (most common)
  return { type: 'p' };
}

function detectBulletedLists(blocks) {
  // Merge lines like "• marker" + "paragraph text on same Y" into <li>
  // pdf2html often emits • as separate run.  We'll detect blocks where previous
  // classification is bulletMarker and same-ish Y range.
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.kind === 'line' && b.class.type === 'bulletMarker') {
      const next = blocks[i + 1];
      if (next && next.kind === 'line' && Math.abs(next.line.avgY - b.line.avgY) < b.line.dominantFs * 0.9) {
        // Combine the two
        const mergedText = (b.line.text + ' ' + next.line.text).replace(/^[•·\-]\s*/, '• ').trim();
        out.push({ kind: 'line', line: { ...b.line, text: mergedText, dominantFs: next.line.dominantFs }, class: { type: 'li' } });
        i++;
        continue;
      }
      // Couldn't combine, keep as paragraph
      out.push({ ...b, class: { type: 'p' } });
      continue;
    }
    out.push(b);
  }
  return out;
}

function groupParagraphLines(blocks) {
  // Consecutive lines classified as 'p' with normal gap → single <p>
  const out = [];
  let buffer = null;
  for (const b of blocks) {
    if (b.kind !== 'line') {
      if (buffer) { out.push({ kind: 'flow', type: buffer.type, lines: buffer.lines }); buffer = null; }
      out.push(b);
      continue;
    }
    const t = b.class.type;
    const isFlow = t === 'p' || t === 'li' || t === 'caption';
    if (!isFlow) {
      if (buffer) { out.push({ kind: 'flow', type: buffer.type, lines: buffer.lines }); buffer = null; }
      out.push({ kind: 'heading', level: t === 'h1' ? 1 : t === 'h2' ? 2 : 3, text: b.line.text });
      continue;
    }
    if (!buffer || buffer.type !== t) {
      if (buffer) out.push({ kind: 'flow', type: buffer.type, lines: buffer.lines });
      buffer = { type: t, lines: [b.line] };
    } else {
      const prev = buffer.lines[buffer.lines.length - 1];
      const gap = b.line.avgY - prev.avgY;
      const thresholdLine = prev.dominantFs * PARAGRAPH_GAP_RATIO;
      if (gap > thresholdLine * 2.1) {
        // Big gap → new paragraph
        out.push({ kind: 'flow', type: buffer.type, lines: buffer.lines });
        buffer = { type: t, lines: [b.line] };
      } else if (gap > thresholdLine * 1.15 && b.line.indent > prev.indent + 8) {
        // Indented next line → new paragraph
        out.push({ kind: 'flow', type: buffer.type, lines: buffer.lines });
        buffer = { type: t, lines: [b.line] };
      } else {
        buffer.lines.push(b.line);
      }
    }
  }
  if (buffer) out.push({ kind: 'flow', type: buffer.type, lines: buffer.lines });
  return out;
}

function detectTables(lines) {
  // Heuristic: small fontSize runs, multiple columns sharing same Y bucket,
  // consistent column X positions across N rows (>=2).
  if (lines.length < 3) return [];
  const smallLines = lines.filter((l) => l.dominantFs <= 13.8);
  if (smallLines.length < 3) return [];
  const byY = new Map();
  for (const l of smallLines) {
    const key = Math.round(l.avgY / 2) * 2;
    if (!byY.has(key)) byY.set(key, []);
    byY.get(key).push(l);
  }
  // Only rows with >=2 distinct X positions → potential table row
  const rows = [];
  for (const [, arr] of byY) {
    if (arr.length >= 2) rows.push(...arr);
  }
  if (rows.length < 4) return [];
  // Determine column X anchors: cluster by X values
  const xs = [...new Set(rows.flatMap((l) => l.runs.map((r) => Math.round(r.x / 8) * 8)))].sort((a, b) => a - b);
  if (xs.length < 2 || xs.length > 8) return [];
  return []; // For now we skip auto-table reconstruction; too fragile across materials.
  // Columns/rows grouping will still fall back as semantic paragraphs with stronger layout via prose.
}

export function reflowPdf2Html(htmlText) {
  const styleMap = parseStylesheet(htmlText);
  const pages = extractPages(htmlText);
  const rawRuns = extractTextRuns(htmlText, styleMap, pages);
  const pagedRuns = assignRunsToPages(rawRuns, pages);
  const runs = normalizeRunsAcrossPages(pagedRuns, pages);

  const lines = groupIntoLines(runs);
  detectTables(lines);

  let blocks = lines.map((line, idx) => ({
    kind: 'line',
    line,
    class: classifyBlock(line, lines[idx - 1], lines[idx + 1]),
  }));

  // Remove junk header lines (e.g. "pelajarin.ai" brand watermark top of page)
  blocks = blocks.filter((b) => {
    if (b.kind === 'line') {
      const t = b.line.text.trim().toLowerCase();
      if (t === 'pelajarin.ai') return false;
      if (/^\d+\/?$/.test(t) && b.line.isMuted) return false;
    }
    return true;
  });

  blocks = detectBulletedLists(blocks);
  const flowBlocks = groupParagraphLines(blocks);
  return flowBlocks;
}

export function blocksToHtml(blocks) {
  const esc = (s) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  let html = '';
  let inList = false; // tracks <ul>
  const closeList = () => { if (inList) { html += '</ul>\n'; inList = false; } };

  for (const b of blocks) {
    if (b.kind === 'heading') {
      closeList();
      const t = `h${b.level}`;
      html += `<${t}>${esc(b.text)}</${t}>\n`;
      continue;
    }
    if (b.kind === 'flow') {
      const text = b.lines.map((l) => l.text).join(' ').replace(/\s{2,}/g, ' ').trim();
      if (!text) continue;
      if (b.type === 'li') {
        if (!inList) { html += '<ul class="md:columns-1">\n'; inList = true; }
        html += `  <li>${esc(text)}</li>\n`;
      } else if (b.type === 'caption') {
        closeList();
        html += `<p class="caption-note">${esc(text)}</p>\n`;
      } else {
        closeList();
        html += `<p>${esc(text)}</p>\n`;
      }
    }
  }
  closeList();
  return html;
}

function decodeHtml(str) {
  // Minimal entity decoder (pdf2html mostly uses &amp;/&lt;/&gt;/&#...;)
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}
