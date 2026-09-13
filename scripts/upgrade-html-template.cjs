const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const files = [
  path.resolve(ROOT, 'src/assets/materials/ipa/Matematika/Trigonometri_Dasar___Matematika_SMA_Kelas_10.html'),
  path.resolve(ROOT, 'src/assets/materials/ipa/kimia/Penyetaraan_Reaksi___Hukum_Hukum_Dasar_Kimia.html'),
  path.resolve(ROOT, 'src/assets/materials/ipa/biologi/Kisi_Kisi_PSTS_Biologi_Kelas_X_Semester_Ganjil.html'),
  path.resolve(ROOT, 'src/assets/materials/ips/sosiologi/Kajian_Sosiologi__Pengertian__Sejarah__dan_Fungsi_Ilmu_Sosiologi.html'),
  path.resolve(ROOT, 'src/assets/materials/basic/bahasa-inggris/Lingkup_Materi_PSTS__Teks_Deskriptif.html'),
  path.resolve(ROOT, 'src/assets/materials/basic/pai/Agama_Islam__Fastabiqul_Khairat__Munakahat__Zina__dan_Dakwah.html'),
];

const MARKER_META = '<!-- trifecta:meta -->';
const MARKER_CSS  = '<!-- trifecta:css-overrides -->';
const MARKER_FONT = '/* trifecta-font-display */';
const MARKER_PAD  = 'data-trifecta-footpad';

const META_INJECTION = `
${MARKER_META}
<meta name="theme-color" content="#0075de">
<meta name="color-scheme" content="light">
<meta http-equiv="Content-Language" content="id">
<meta name="format-detection" content="telephone=no">`;

const CSS_OVERRIDES = `
${MARKER_CSS}
<style>
/* ===== Trifecta Study — tipografi & readability overrides ===== */
html, body {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern" 1;
  font-kerning: normal;
}
html { scroll-behavior: smooth; }
body {
  background:
    radial-gradient(1200px 600px at 50% -10%, rgba(42,157,153,0.10), transparent 60%),
    radial-gradient(900px 500px at 100% 10%, rgba(0,117,222,0.10), transparent 60%),
    linear-gradient(180deg, #f2f1f0 0%, #ebeae9 100%);
  min-height: 100vh;
  max-width: 100%;
  overflow-x: hidden;
}
::-webkit-scrollbar { width: 12px; height: 12px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(97, 93, 89, 0.30);
  border-radius: 8px;
  border: 3px solid transparent;
  background-clip: padding-box;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 117, 222, 0.55);
  border: 3px solid transparent;
  background-clip: padding-box;
}
::selection { background: rgba(0,117,222,0.25); color: #000; }

/* Page card polish */
.page {
  margin: 18px auto !important;
  background-image:
    linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(253,253,253,1) 100%);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.8) inset,
    0 0 0 1px rgba(0,0,0,0.05),
    0 2px 6px rgba(0,0,0,0.08),
    0 12px 32px -8px rgba(0,0,0,0.22) !important;
  border-radius: 6px !important;
}

/* ===== Mobile / responsive page scaling =====
   Halaman PDF asli berukuran fixed ~794px dengan elemen posisi absolut.
   Agar tidak terpotong di layar sempit: skala halaman dengan CSS zoom
   (zoom mempengaruhi layout box, berbeda dengan transform:scale). */
@media (max-width: 840px) {
  .page {
    /* skala proporsional agar lebar halaman muat di viewport + padding */
    zoom: min(1, calc((100vw - 32px) / 794));
  }
}
@media (max-width: 480px) {
  .page {
    margin: 10px auto !important;
    border-radius: 4px !important;
    zoom: min(1, calc((100vw - 20px) / 794));
  }
}

/* Text runs — subpixel smoothing without moving them */
.t {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
.im { -webkit-user-drag: none; }

/* Sidebar polish (toc & thumbs) */
.toc, .thumbs {
  background: rgba(255, 255, 255, 0.96) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 0 24px rgba(0,0,0,0.12) !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif !important;
}
.toc { width: 260px !important; }
.thumbs { width: 180px !important; }
.toc summary, .thumbs summary {
  padding: 10px 12px !important;
  font-weight: 700 !important;
  border-bottom: 1px solid #ececec !important;
  font-size: 11px !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
  color: #615d59 !important;
}
.toc a, .toc span { padding: 3px 8px !important; border-radius: 4px !important; }
.toc a { color: #0075de !important; transition: background 0.15s ease; }
.toc a:hover { background: rgba(0,117,222,0.08) !important; text-decoration: none !important; }
.thumbs img {
  width: 148px !important;
  border: 1px solid #e6e6e6 !important;
  border-radius: 4px !important;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease !important;
}
.thumbs a:hover img {
  border-color: #0075de !important;
  box-shadow: 0 0 0 3px rgba(0,117,222,0.15) !important;
  transform: translateY(-1px) !important;
}

/* Sidebar — sembunyikan di layar sempit (mobile) */
@media (max-width: 900px) {
  .toc, .thumbs { display: none !important; }
}

/* Print */
@media print {
  html, body { background: #fff !important; }
  .toc, .thumbs { display: none !important; }
  .page {
    margin: 0 auto !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    break-after: page;
    break-inside: avoid;
    zoom: 1 !important;
  }
  .page:last-child { break-after: auto; }
  ::-webkit-scrollbar { display: none !important; }
}
</style>`;

function injectOnce(src, hook, injection) {
  if (!hook || src.includes(injection.split('\n')[1])) {
    // Already injected
    return { src, applied: false };
  }
  if (!src.includes(hook)) {
    console.warn(`    [!] Hook tidak ditemukan: ${JSON.stringify(hook).slice(0,60)}`);
    return { src, applied: false };
  }
  const idx = src.indexOf(hook);
  return {
    src: src.slice(0, idx) + injection + src.slice(idx),
    applied: true,
  };
}

let totalChanges = 0;
for (const file of files) {
  let src = fs.readFileSync(file, 'utf8');
  const before = src;

  // 1) META — inject before <title>
  const metaRes = injectOnce(src, '<title>', META_INJECTION);
  src = metaRes.src;

  // 2) CSS overrides — inject before </head>
  const cssRes = injectOnce(src, '</head>', CSS_OVERRIDES);
  src = cssRes.src;

  // 3) font-display: swap on @font-face
  let fontPatches = 0;
  if (!src.includes(MARKER_FONT)) {
    src = src.replace(/@font-face\s*\{/g, () => {
      fontPatches++;
      return `@font-face{${MARKER_FONT}font-display:swap;`;
    });
  }

  // 4) Footpad before </body>
  let padApplied = false;
  if (!src.includes(MARKER_PAD)) {
    const padHtml = `  <div ${MARKER_PAD} style="height:48px;width:100%;flex-shrink:0"></div>\n`;
    const padRes = injectOnce(src, '</body>', padHtml);
    src = padRes.src;
    padApplied = padRes.applied;
  }

  fs.writeFileSync(file, src, 'utf8');
  const appliedCount =
    (metaRes.applied ? 1 : 0) +
    (cssRes.applied ? 1 : 0) +
    (fontPatches ? 1 : 0) +
    (padApplied ? 1 : 0);
  totalChanges += appliedCount;
  console.log(
    `[✓] ${path.basename(file)} — ` +
    [
      metaRes.applied && 'meta',
      cssRes.applied && 'css-overrides',
      fontPatches && `font-display(${fontPatches})`,
      padApplied && 'footpad',
    ].filter(Boolean).join(', ') || 'tanpa perubahan'
  );
}
console.log(`\nSelesai.`);
