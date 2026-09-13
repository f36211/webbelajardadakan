#!/usr/bin/env python3
"""
universal_converter.py — Universal Semantic & Responsive HTML Converter
Converts PDF2HTML fixed-layout files into flowing, semantic, responsive HTML notes.
"""

import os
import re
import json
import html
from pathlib import Path
from bs4 import BeautifulSoup

ROOT_DIR = Path("/home/axz01/webbelajardadakan/src/assets/materials")
OUTPUT_DIR = ROOT_DIR / "converted"

UNIVERSAL_CSS = """
/* Universal Semantic Materials Stylesheet */
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --color-bg: #ffffff;
  --color-surface: #f9f9f8;
  --color-surface-hover: #f3f3f2;
  --color-text: #2f343b;
  --color-text-muted: #6b7280;
  --color-heading: #111827;
  --color-border: #e5e7eb;
  --color-primary: #0075de;
  --color-primary-light: #eff6ff;
  --color-accent-orange: #f76703;
  --color-callout-bg: #fffbf7;
  --color-callout-border: #f76703;
  --color-table-header: #f8fafc;
  --color-table-alt: #fcfcfc;
  --line-height: 1.75;
}

[data-reading-theme="dark"] {
  --color-bg: #16171d;
  --color-surface: #1e2028;
  --color-surface-hover: #262933;
  --color-text: #d1d5db;
  --color-text-muted: #9ca3af;
  --color-heading: #f9fafb;
  --color-border: #2e303a;
  --color-primary: #62aef0;
  --color-primary-light: #1e293b;
  --color-callout-bg: #231c16;
  --color-callout-border: #dd5b00;
  --color-table-header: #1f232e;
  --color-table-alt: #181920;
}

[data-reading-theme="sepia"] {
  --color-bg: #f4ecd8;
  --color-surface: #ede0c8;
  --color-surface-hover: #e5d6bc;
  --color-text: #5b4636;
  --color-text-muted: #7a5c3a;
  --color-heading: #3d2b1f;
  --color-border: #d4c4a8;
  --color-primary: #7a5c3a;
  --color-primary-light: #ede0c8;
  --color-callout-bg: #ebdcc0;
  --color-callout-border: #a85d00;
  --color-table-header: #ede0c8;
  --color-table-alt: #f4ecd8;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html {
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: var(--line-height);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.material {
  max-width: 820px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 6rem;
}

.material-header {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.material-brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 1.25rem;
  padding: 4px 10px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.material-brand-badge img {
  width: 18px;
  height: 18px;
  border-radius: 4px;
}

.material-title, h1 {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 800;
  color: var(--color-heading);
  letter-spacing: -0.025em;
  line-height: 1.25;
  margin-bottom: 1rem;
}

h2 {
  font-size: clamp(1.35rem, 2.8vw, 1.7rem);
  font-weight: 700;
  color: var(--color-heading);
  letter-spacing: -0.018em;
  line-height: 1.35;
  margin-top: 2.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

h3 {
  font-size: clamp(1.15rem, 2.2vw, 1.35rem);
  font-weight: 700;
  color: var(--color-heading);
  letter-spacing: -0.01em;
  line-height: 1.4;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

h4 {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

p {
  font-size: 1.025rem;
  margin-bottom: 1.15rem;
  color: var(--color-text);
  line-height: 1.75;
}

ul, ol {
  margin: 0.75rem 0 1.25rem 1.6rem;
  padding: 0;
}

li {
  margin-bottom: 0.5rem;
  line-height: 1.7;
}

li > ul, li > ol {
  margin-top: 0.35rem;
  margin-bottom: 0.35rem;
}

strong {
  font-weight: 600;
  color: var(--color-heading);
}

em {
  font-style: italic;
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
  margin: 1.75rem 0;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.95rem;
}

th {
  background: var(--color-table-header);
  font-weight: 600;
  color: var(--color-heading);
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-border);
  vertical-align: top;
  color: var(--color-text);
  line-height: 1.55;
}

tr:last-child td {
  border-bottom: none;
}

tr:nth-child(even) td {
  background: var(--color-table-alt);
}

.callout {
  margin: 1.75rem 0;
  padding: 1.15rem 1.35rem;
  background: var(--color-callout-bg);
  border-left: 4px solid var(--color-callout-border);
  border-radius: 0 8px 8px 0;
  color: var(--color-text);
  line-height: 1.65;
}

.callout-title {
  font-weight: 700;
  color: var(--color-accent-orange);
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
}

.frac {
  display: inline-flex;
  flex-direction: column;
  vertical-align: middle;
  text-align: center;
  padding: 0 3px;
  font-size: 0.9em;
  line-height: 1.1;
}

.frac .num {
  border-bottom: 1px solid currentColor;
  padding-bottom: 1px;
}

.frac .denom {
  padding-top: 1px;
}

sub, sup {
  font-size: 0.78em;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub { bottom: -0.25em; }
sup { top: -0.5em; }

@media (max-width: 640px) {
  .material {
    padding: 1.5rem 1rem 4rem;
  }
  th, td {
    padding: 8px 10px;
    font-size: 0.9rem;
  }
}
"""

def extract_class_meta(soup):
    styles = soup.find_all("style")
    all_css = "\n".join(s.get_text() for s in styles)

    class_meta = {}
    for cls, body in re.findall(r"\.(c\d+)\s*\{([^}]+)\}", all_css):
        fs_m = re.search(r"font-size\s*:\s*([\d.]+)px", body)
        fw_m = re.search(r"font-weight\s*:\s*([^;]+)", body)
        co_m = re.search(r"color\s*:\s*([^;]+)", body)
        ff_m = re.search(r"font-family\s*:\s*([^;]+)", body)
        st_m = re.search(r"font-style\s*:\s*([^;]+)", body)

        fs = float(fs_m.group(1)) if fs_m else 14.67
        fw = fw_m.group(1).strip() if fw_m else ""
        co = co_m.group(1).strip() if co_m else "#1a1a1a"
        ff = ff_m.group(1).strip().replace('"', '') if ff_m else ""
        st = st_m.group(1).strip() if st_m else ""

        # Robust bold and italic detection
        is_bold = ("bold" in body) or ("f0" in ff)
        is_italic = ("italic" in body) or ("f2" in ff)

        class_meta[cls] = {
            "fontSize": fs,
            "color": co,
            "bold": is_bold,
            "italic": is_italic,
            "fontFamily": ff
        }
    return class_meta

def detect_tables_in_page(page):
    vec = page.find("svg", class_="vec")
    h_lines = []
    v_lines = []
    if vec:
        for p in vec.find_all("path"):
            d = p.get("d", "")
            for m in re.finditer(r"M\s*([\d.]+)\s+([\d.]+)\s*H\s*([\d.]+)", d):
                x1, y, x2 = float(m.group(1)), float(m.group(2)), float(m.group(3))
                if abs(x2 - x1) > 15 and 50 < y < 1050:
                    h_lines.append((round(y, 1), min(x1, x2), max(x1, x2)))
            for m in re.finditer(r"M\s*([\d.]+)\s+([\d.]+)\s*V\s*([\d.]+)", d):
                x, y1, y2 = float(m.group(1)), float(m.group(2)), float(m.group(3))
                if abs(y2 - y1) > 15 and 50 < x < 750:
                    v_lines.append((round(x, 1), min(y1, y2), max(y1, y2)))

    unique_ys = sorted(list(set(h[0] for h in h_lines)))
    clustered_ys = []
    for y in unique_ys:
        if not clustered_ys or abs(clustered_ys[-1] - y) > 3:
            clustered_ys.append(y)

    unique_xs = sorted(list(set(v[0] for v in v_lines)))
    clustered_xs = []
    for x in unique_xs:
        if not clustered_xs or abs(clustered_xs[-1] - x) > 3:
            clustered_xs.append(x)

    tables = []
    if len(clustered_ys) >= 3 and len(clustered_xs) >= 2:
        min_vy = min(v[1] for v in v_lines)
        max_vy = max(v[2] for v in v_lines)
        grid_ys = [y for y in clustered_ys if min_vy - 5 <= y <= max_vy + 5]
        min_hx = min(h[1] for h in h_lines)
        max_hx = max(h[2] for h in h_lines)
        grid_xs = [x for x in clustered_xs if min_hx - 5 <= x <= max_hx + 5]
        if len(grid_ys) >= 3 and len(grid_xs) >= 2:
            tables.append({
                "type": "svg_grid",
                "y_range": (min(grid_ys), max(grid_ys)),
                "x_range": (min(grid_xs), max(grid_xs)),
                "row_boundaries": grid_ys,
                "col_boundaries": grid_xs
            })
    return tables

def detect_fraction_bars_in_page(page):
    vecs = page.find_all("svg", class_="vec")
    frac_bars = []
    for v in vecs:
        for p in v.find_all("path"):
            d = p.get("d", "")
            for m in re.finditer(r"M\s*([\d.]+)\s+([\d.]+)\s*H\s*([\d.]+)", d):
                x1, y, x2 = float(m.group(1)), float(m.group(2)), float(m.group(3))
                w = abs(x2 - x1)
                if 3.5 <= w <= 80 and 50 < y < 1050:
                    frac_bars.append({
                        "y": y,
                        "x1": min(x1, x2),
                        "x2": max(x1, x2),
                        "w": w
                    })
    dedup = []
    for b in frac_bars:
        if not any(abs(db["y"] - b["y"]) < 1.5 and abs(db["x1"] - b["x1"]) < 1.5 for db in dedup):
            dedup.append(b)
    return dedup

def detect_sqrt_paths_in_page(page):
    vecs = page.find_all("svg", class_="vec")
    sqrt_symbols = []
    for v in vecs:
        for p in v.find_all("path"):
            d = p.get("d", "")
            if "C" in d:
                nums = [float(x) for x in re.findall(r"[\d.]+", d)]
                if len(nums) >= 2 and 50 < nums[1] < 1050:
                    sqrt_symbols.append({"x": nums[0], "y": nums[1]})
    return sqrt_symbols

def detect_callout_boxes_in_page(page):
    vec = page.find("svg", class_="vec")
    callouts = []
    if vec:
        for p in vec.find_all("path"):
            fill = p.get("fill")
            d = p.get("d", "")
            if fill == "#f76703":
                vs = [float(x) for x in re.findall(r"V\s*([\d.]+)", d)]
                if len(vs) >= 2:
                    callouts.append((min(vs), max(vs)))
    return callouts

def format_cell_runs(cell_runs, sqrt_symbols):
    if not cell_runs:
        return "&nbsp;"

    # Detect fraction in cell (two vertically stacked numbers with dy in 7..16px)
    x_groups = {}
    for r in cell_runs:
        found_gx = None
        for gx in x_groups:
            if abs(gx - r["x"]) < 6:
                found_gx = gx; break
        if found_gx is None:
            found_gx = r["x"]
            x_groups[found_gx] = []
        x_groups[found_gx].append(r)

    frac_map = {}
    consumed_runs = set()
    for gx, gruns in x_groups.items():
        if len(gruns) == 2:
            gruns.sort(key=lambda it: it["y"])
            dy = gruns[1]["y"] - gruns[0]["y"]
            if 7.0 <= dy <= 16.0 and (gruns[0]["text"].isdigit() or len(gruns[0]["text"]) <= 3) and gruns[1]["text"].isdigit():
                num = gruns[0]["text"]
                den = gruns[1]["text"]
                frac_map[gx] = f'<span class="frac"><span class="num">{num}</span><span class="denom">{den}</span></span>'
                consumed_runs.add(id(gruns[0]))
                consumed_runs.add(id(gruns[1]))

    items = []
    for gx, frac_html in frac_map.items():
        items.append((gx, frac_html))

    for r in cell_runs:
        if id(r) not in consumed_runs:
            txt = r["text"]
            if txt == '∘': txt = '°'

            # Sqrt check: check if sqrt symbol exists just before this run (x in [r.x - 16, r.x])
            has_sqrt = any(abs(sq["y"] - r["y"]) < 12 and (r["x"] - 18 <= sq["x"] <= r["x"] + 2) for sq in sqrt_symbols)
            if has_sqrt:
                txt = f"&radic;{txt}"

            if r.get("bold"): txt = f"<strong>{txt}</strong>"
            if r.get("italic"): txt = f"<em>{txt}</em>"
            items.append((r["x"], txt))

    items.sort(key=lambda it: it[0])

    res = ""
    for x, txt in items:
        if res and not res.endswith(" ") and not txt.startswith(" ") and txt != '°':
            res += " "
        res += txt
    return res.strip() or "&nbsp;"

def process_page_elements(page, p_idx, class_meta):
    tables = detect_tables_in_page(page)
    frac_bars = detect_fraction_bars_in_page(page)
    callouts = detect_callout_boxes_in_page(page)
    sqrt_symbols = detect_sqrt_paths_in_page(page)

    runs = []
    for t in page.find_all("div", class_="t"):
        style = t.get("style", "")
        m = re.search(r"matrix\(1,\s*0,\s*0,\s*1,\s*([\d.]+),\s*([\d.]+)\)", style)
        if not m: continue
        x, y = float(m.group(1)), float(m.group(2))

        txt = t.get_text().strip()
        if y > 1050 and (txt.isdigit() or len(txt) <= 2):
            continue
        if p_idx == 0 and y < 100 and "pelajarin" in txt.lower():
            continue

        cls_list = t.get("class", [])
        m_cls = [c for c in cls_list if c in class_meta]
        c_info = class_meta[m_cls[0]] if m_cls else {"fontSize": 14.67, "color": "#1a1a1a", "bold": False, "italic": False}

        raw_text = t.get_text().replace('\u00a0', ' ')
        if not raw_text.strip() and not raw_text:
            continue

        runs.append({
            "x": x,
            "y": y,
            "text": raw_text,
            "fontSize": c_info["fontSize"],
            "color": c_info["color"],
            "bold": c_info["bold"],
            "italic": c_info["italic"],
            "cls": m_cls[0] if m_cls else ""
        })

    # Separate runs inside tables
    processed_runs = []
    table_blocks = []
    for t_info in tables:
        y_min, y_max = t_info["y_range"]
        x_min, x_max = t_info["x_range"]
        rows = len(t_info["row_boundaries"]) - 1
        cols = len(t_info["col_boundaries"]) - 1
        grid = [[[] for _ in range(cols)] for _ in range(rows)]
        row_b = t_info["row_boundaries"]
        col_b = t_info["col_boundaries"]

        for r in runs:
            rx, ry = r["x"], r["y"]
            if y_min - 4 <= ry <= y_max + 4 and x_min - 4 <= rx <= x_max + 4:
                r_idx = -1
                for ri in range(rows):
                    if row_b[ri] - 4 <= ry <= row_b[ri+1] + 4:
                        r_idx = ri; break
                c_idx = -1
                for ci in range(cols):
                    if col_b[ci] - 4 <= rx <= col_b[ci+1] + 4:
                        c_idx = ci; break
                if r_idx >= 0 and c_idx >= 0:
                    grid[r_idx][c_idx].append(r)
                    processed_runs.append(r)

        t_html = ['<div class="table-wrap"><table>']
        for ri in range(rows):
            is_head = (ri == 0)
            tag = "th" if is_head else "td"
            t_html.append("  <tr>" if not is_head else "  <thead>\n  <tr>")
            for ci in range(cols):
                c_runs = sorted(grid[ri][ci], key=lambda it: it["x"])
                formatted_cell = format_cell_runs(c_runs, sqrt_symbols)
                t_html.append(f"    <{tag}>{formatted_cell}</{tag}>")
            t_html.append("  </tr>" if not is_head else "  </tr>\n  </thead>\n  <tbody>")
        t_html.append("  </tbody>\n</table></div>")
        table_blocks.append({
            "type": "table",
            "y": y_min,
            "html": "\n".join(t_html)
        })

    free_runs = [r for r in runs if r not in processed_runs]

    # Process fractions among free runs
    fraction_entities = []
    for b in frac_bars:
        by, bx1, bx2 = b["y"], b["x1"], b["x2"]
        nums = [r for r in free_runs if by - 16 <= r["y"] <= by - 0.5 and bx1 - 4 <= r["x"] <= bx2 + 4]
        dens = [r for r in free_runs if by + 0.5 <= r["y"] <= by + 16 and bx1 - 4 <= r["x"] <= bx2 + 4]

        if nums and dens:
            num_txt = "".join(r["text"].strip() for r in sorted(nums, key=lambda it: it["x"]))
            den_txt = "".join(r["text"].strip() for r in sorted(dens, key=lambda it: it["x"]))
            if num_txt and den_txt:
                frac_html = f'<span class="frac"><span class="num">{num_txt}</span><span class="denom">{den_txt}</span></span>'
                fraction_entities.append({
                    "bar": b,
                    "nums": nums,
                    "dens": dens,
                    "html": frac_html,
                    "x": min(nums[0]["x"], dens[0]["x"]),
                    "y": by
                })
                for nr in nums: processed_runs.append(nr)
                for dr in dens: processed_runs.append(dr)

    free_runs = [r for r in runs if r not in processed_runs]

    # Line clustering with two-pass adaptive baseline
    free_runs.sort(key=lambda r: (r["y"], r["x"]))
    lines = []
    for r in free_runs:
        in_callout = any(cy[0] - 2 <= r["y"] <= cy[1] + 2 for cy in callouts)
        r["in_callout"] = in_callout

        matched_line = None
        for l in lines:
            dom_y = l["baseline_y"]
            dy = abs(r["y"] - dom_y)
            if dy <= 4.0:
                matched_line = l; break
            elif dy <= 8.5 and (r["fontSize"] < l["dominant_fs"] or r["fontSize"] <= 13.0):
                matched_line = l; break

        if not matched_line:
            matched_line = {
                "runs": [],
                "baseline_y": r["y"],
                "dominant_fs": r["fontSize"],
                "in_callout": in_callout
            }
            lines.append(matched_line)

        matched_line["runs"].append(r)
        if r["fontSize"] > matched_line["dominant_fs"]:
            matched_line["dominant_fs"] = r["fontSize"]
            matched_line["baseline_y"] = r["y"]

    # Insert fractions into the closest line by Y
    for fe in fraction_entities:
        fy = fe["y"]
        matched_line = None
        for l in lines:
            if abs(l["baseline_y"] - fy) <= 10.0:
                matched_line = l; break
        if not matched_line:
            matched_line = {
                "runs": [],
                "baseline_y": fy,
                "dominant_fs": 14.67,
                "in_callout": any(cy[0] - 2 <= fy <= cy[1] + 2 for cy in callouts)
            }
            lines.append(matched_line)
        matched_line["runs"].append({
            "x": fe["x"],
            "y": fe["y"],
            "text": fe["html"],
            "fontSize": 14.67,
            "bold": False,
            "italic": False,
            "is_raw_html": True
        })

    # Format lines
    lines.sort(key=lambda l: l["baseline_y"])
    line_blocks = []
    for l in lines:
        l["runs"].sort(key=lambda r: r["x"])
        formatted_parts = []
        raw_parts = []
        prev_end = -1
        dom_fs = l["dominant_fs"]
        base_y = l["baseline_y"]

        for i, r in enumerate(l["runs"]):
            if r.get("is_raw_html"):
                formatted_parts.append(r["text"])
                raw_parts.append(" ")
                prev_end = r["x"] + 20
                continue

            txt = r["text"]
            if txt == '∘': txt = '°'

            # Sqrt check: check if sqrt symbol exists just before this run
            has_sqrt = any(abs(sq["y"] - r["y"]) < 10 and (r["x"] - 18 <= sq["x"] <= r["x"] + 2) for sq in sqrt_symbols)
            if has_sqrt:
                txt = f"&radic;{txt}"

            dy = r["y"] - base_y
            fs_ratio = r["fontSize"] / dom_fs if dom_fs > 0 else 1.0

            part = txt
            if dy > 2.5 and fs_ratio < 0.95:
                part = f"<sub>{txt}</sub>"
            elif dy < -2.0 and fs_ratio < 0.95:
                part = f"<sup>{txt}</sup>"
            else:
                if r["bold"]: part = f"<strong>{part}</strong>"
                if r["italic"]: part = f"<em>{part}</em>"

            if prev_end > 0:
                gap = r["x"] - prev_end
                if gap > max(1.5, r["fontSize"] * 0.22) and not txt.startswith(" ") and (not formatted_parts or not formatted_parts[-1].endswith(" ")) and txt != '°':
                    formatted_parts.append(" ")
                    raw_parts.append(" ")

            formatted_parts.append(part)
            raw_parts.append(txt)
            char_w = r["fontSize"] * 0.52
            prev_end = r["x"] + max(len(txt) * char_w, 0)

        full_formatted = "".join(formatted_parts).strip()
        full_raw = "".join(raw_parts).strip()

        line_blocks.append({
            "type": "line",
            "y": base_y,
            "x": l["runs"][0]["x"],
            "html": full_formatted,
            "raw": full_raw,
            "dominant_fs": dom_fs,
            "bold": all(r.get("bold", False) for r in l["runs"]),
            "in_callout": l["in_callout"]
        })

    all_blocks = line_blocks + table_blocks
    all_blocks.sort(key=lambda b: b["y"])
    return all_blocks

def convert_document(filepath):
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        html_text = f.read()

    soup = BeautifulSoup(html_text, "html.parser")
    class_meta = extract_class_meta(soup)
    pages = soup.find_all("div", class_="page")

    if not pages:
        return {
            "status": "skipped",
            "reason": "Not a fixed-layout document with .page elements"
        }

    p0_img = pages[0].find("img")
    logo_src = p0_img.get("src", "") if p0_img else None

    all_doc_blocks = []
    for p_idx, page in enumerate(pages):
        blocks = process_page_elements(page, p_idx, class_meta)
        for b in blocks:
            b["page"] = p_idx
            all_doc_blocks.append(b)

    # Pre-pass: merge wrapped heading lines that share font size
    merged_blocks = []
    i = 0
    while i < len(all_doc_blocks):
        curr = all_doc_blocks[i]
        if curr["type"] == "line" and curr["dominant_fs"] >= 16.0 and curr["bold"]:
            # check if next is also heading line on same page
            if (i + 1 < len(all_doc_blocks) and
                all_doc_blocks[i+1]["type"] == "line" and
                abs(all_doc_blocks[i+1]["dominant_fs"] - curr["dominant_fs"]) < 1.0 and
                all_doc_blocks[i+1]["bold"] and
                all_doc_blocks[i+1]["page"] == curr["page"] and
                abs(all_doc_blocks[i+1]["y"] - curr["y"]) <= 36.0):
                next_b = all_doc_blocks[i+1]
                curr["html"] += " " + next_b["html"]
                curr["raw"] += " " + next_b["raw"]
                i += 1 # skip next_b
        merged_blocks.append(curr)
        i += 1

    # Semanticize document flow
    semantic_elements = []
    current_callout = None
    current_list = None # {"type": "ul"|"ol", "items": []}
    current_p = []

    def flush_p():
        nonlocal current_p
        if current_p:
            text = " ".join(current_p).strip()
            text = re.sub(r'\s+([.,;:!?])', r'\1', text)
            text = re.sub(r'(\w+)-\s+(\w+)', r'\1-\2', text)
            if text:
                if current_callout is not None:
                    current_callout["content"].append(f"<p>{text}</p>")
                else:
                    semantic_elements.append(f"<p>{text}</p>")
            current_p = []

    def flush_list():
        nonlocal current_list
        if current_list:
            tag = current_list["type"]
            items_html = []
            for it in current_list["items"]:
                it_clean = re.sub(r'\s+([.,;:!?])', r'\1', it)
                it_clean = re.sub(r'(\w+)-\s+(\w+)', r'\1-\2', it_clean)
                items_html.append(f"  <li>{it_clean}</li>")
            list_html = f"<{tag}>\n" + "\n".join(items_html) + f"\n</{tag}>"
            if current_callout is not None:
                current_callout["content"].append(list_html)
            else:
                semantic_elements.append(list_html)
            current_list = None

    def flush_callout():
        nonlocal current_callout
        if current_callout:
            c_html = '<div class="callout">\n' + "\n".join(current_callout["content"]) + '\n</div>'
            semantic_elements.append(c_html)
            current_callout = None

    def flush_all():
        flush_p()
        flush_list()
        flush_callout()

    doc_title = None

    for i, b in enumerate(merged_blocks):
        if b["type"] == "table":
            flush_p()
            flush_list()
            if current_callout:
                current_callout["content"].append(b["html"])
            else:
                semantic_elements.append(b["html"])
            continue

        raw = b["raw"]
        html_str = b["html"]
        fs = b["dominant_fs"]
        is_callout = b["in_callout"]
        is_bold = b["bold"]

        # Callout transition
        if is_callout and current_callout is None:
            flush_p()
            flush_list()
            current_callout = {"content": []}
        elif not is_callout and current_callout is not None:
            flush_p()
            flush_list()
            flush_callout()

        # Check if Heading 1 (Document title)
        if fs >= 20.0 and b["page"] == 0 and doc_title is None:
            flush_p()
            flush_list()
            doc_title = raw
            h_tag = "h1"
            if current_callout:
                current_callout["content"].append(f"<{h_tag}>{html_str}</{h_tag}>")
            else:
                semantic_elements.append(f"<{h_tag}>{html_str}</{h_tag}>")
            continue

        # Major Chapter Header: fs >= 20px (on later pages)
        if fs >= 20.0:
            flush_p()
            flush_list()
            if current_callout:
                current_callout["content"].append(f"<h2>{html_str}</h2>")
            else:
                semantic_elements.append(f"<h2>{html_str}</h2>")
            continue

        # Section Header: fs >= 17.5px (e.g. 18.67px)
        if fs >= 17.5:
            flush_p()
            flush_list()
            # If document has H2 chapters, section is H3, otherwise H2
            h_tag = "h3"
            if current_callout:
                current_callout["content"].append(f"<{h_tag}>{html_str}</{h_tag}>")
            else:
                semantic_elements.append(f"<{h_tag}>{html_str}</{h_tag}>")
            continue

        # Subsection Header: fs >= 15.5px (e.g. 16px) and bold
        if fs >= 15.5 and is_bold:
            flush_p()
            flush_list()
            h_tag = "h4"
            if current_callout:
                current_callout["content"].append(f"<{h_tag}>{html_str}</{h_tag}>")
            else:
                semantic_elements.append(f"<{h_tag}>{html_str}</{h_tag}>")
            continue

        # Check if List Item
        bullet_match = re.match(r'^(?:[•●○\-\–]|\d+[\.\)]|[a-zA-Z][\.\)])\s+', raw)
        if bullet_match:
            flush_p()
            is_num = bool(re.match(r'^\d+[\.\)]\s+', raw))
            list_type = "ol" if is_num else "ul"
            if current_list and current_list["type"] != list_type:
                flush_list()
            if not current_list:
                current_list = {"type": list_type, "items": []}

            item_html = re.sub(r'^(?:<strong>|<em>)?(?:[•●○\-\–]|\d+[\.\)]|[a-zA-Z][\.\)])\s*(?:</strong>|</em>)?\s*', '', html_str)
            current_list["items"].append(item_html)
            continue

        # List continuation line
        if current_list and (b["x"] > 92.0 or (i > 0 and merged_blocks[i-1]["type"] == "line" and merged_blocks[i-1].get("page") == b.get("page") and abs(b["y"] - merged_blocks[i-1]["y"]) <= 28.0)):
            if current_list["items"]:
                current_list["items"][-1] += " " + html_str
                continue

        if current_list:
            flush_list()

        # Regular text paragraph
        if current_p and i > 0 and merged_blocks[i-1]["type"] == "line":
            prev_b = merged_blocks[i-1]
            dy = b["y"] - prev_b["y"]
            same_page = (prev_b.get("page") == b.get("page"))

            prev_raw = prev_b["raw"].strip()
            ends_term = prev_raw.endswith(('.', '!', '?', ':'))
            starts_lower = raw and raw[0].islower()

            if (same_page and dy <= 32.0) or (not same_page and (not ends_term or starts_lower)):
                current_p.append(html_str)
                continue
            else:
                flush_p()

        current_p.append(html_str)

    flush_all()

    title_text = doc_title or filepath.stem.replace('_', ' ')

    header_badge = ""
    if logo_src:
        header_badge = f"""
      <div class="material-brand-badge">
        <img src="{logo_src}" alt="Icon">
        <span>TrifectaStudy</span>
      </div>"""

    full_html = f"""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title_text)}</title>
  <style>
{UNIVERSAL_CSS}
  </style>
</head>
<body>
  <main class="material">
    <header class="material-header">{header_badge}
    </header>
    {"\n    ".join(semantic_elements)}
  </main>
</body>
</html>
"""

    return {
        "status": "success",
        "title": title_text,
        "html_content": full_html,
        "headings_count": full_html.count("<h1") + full_html.count("<h2") + full_html.count("<h3") + full_html.count("<h4"),
        "paragraphs_count": full_html.count("<p>"),
        "lists_count": full_html.count("<ul>") + full_html.count("<ol>"),
        "tables_count": full_html.count("<table"),
        "callouts_count": full_html.count('class="callout"'),
        "fractions_count": full_html.count('class="frac"'),
        "sub_count": full_html.count("<sub"),
        "sup_count": full_html.count("<sup")
    }

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    html_files = sorted(ROOT_DIR.rglob("*.html"))
    html_files = [f for f in html_files if "converted" not in f.parts]

    report = []
    print(f"Starting conversion for {len(html_files)} files...")

    for fpath in html_files:
        rel_path = fpath.relative_to(ROOT_DIR)
        out_subpath = OUTPUT_DIR / rel_path
        out_subpath.parent.mkdir(parents=True, exist_ok=True)
        out_flatpath = OUTPUT_DIR / fpath.name

        print(f"\nProcessing: {rel_path}...")
        res = convert_document(fpath)

        if res["status"] == "success":
            with open(out_subpath, "w", encoding="utf-8") as out_f:
                out_f.write(res["html_content"])
            with open(out_flatpath, "w", encoding="utf-8") as out_f:
                out_f.write(res["html_content"])

            orig_soup = BeautifulSoup(open(fpath, errors="ignore"), "html.parser")
            orig_text = orig_soup.get_text()
            orig_words = set(re.findall(r'\b\w{4,}\b', orig_text.lower()))

            new_soup = BeautifulSoup(res["html_content"], "html.parser")
            new_text = new_soup.get_text()
            new_words = set(re.findall(r'\b\w{4,}\b', new_text.lower()))

            preserved = len(orig_words.intersection(new_words))
            retention_rate = (preserved / len(orig_words) * 100) if orig_words else 100.0

            file_report = {
                "source": str(rel_path),
                "output_subpath": str(out_subpath.relative_to(ROOT_DIR)),
                "output_flatpath": str(out_flatpath.relative_to(ROOT_DIR)),
                "title": res["title"],
                "status": "success",
                "headings": res["headings_count"],
                "paragraphs": res["paragraphs_count"],
                "lists": res["lists_count"],
                "tables": res["tables_count"],
                "callouts": res["callouts_count"],
                "fractions": res["fractions_count"],
                "subscripts": res["sub_count"],
                "superscripts": res["sup_count"],
                "source_words_count": len(orig_words),
                "retention_rate_pct": round(retention_rate, 2),
                "has_formulas": (res["fractions_count"] > 0 or res["sub_count"] > 0 or res["sup_count"] > 0),
                "warnings": []
            }
            if retention_rate < 90.0:
                file_report["warnings"].append(f"Low word retention rate: {retention_rate:.1f}%")
            report.append(file_report)
            print(f"  ✓ SUCCESS: {res['headings_count']} headings, {res['paragraphs_count']} paragraphs, {res['tables_count']} tables, {res['lists_count']} lists, {res['fractions_count']} fractions. Retention: {retention_rate:.1f}%")
        else:
            report.append({
                "source": str(rel_path),
                "status": "failed",
                "reason": res.get("reason", "Unknown")
            })
            print(f"  ✗ FAILED: {res.get('reason')}")

    # Write report at project root and inside converted/
    root_report = Path("/home/axz01/webbelajardadakan/conversion-report.json")
    with open(root_report, "w", encoding="utf-8") as rf:
        json.dump(report, rf, indent=2)
    with open(OUTPUT_DIR / "conversion-report.json", "w", encoding="utf-8") as rf:
        json.dump(report, rf, indent=2)

    print(f"\nAll conversions complete! Report saved to {root_report}")

if __name__ == "__main__":
    main()
