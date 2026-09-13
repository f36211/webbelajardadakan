const htmlModules = import.meta.glob('/src/assets/materials/**/*.html', {
  eager: true,
  query: '?url',
  import: 'default',
});

const SUBJECT_ALIASES = {
  'bahasa-indonesia': 'Bahasa Indonesia',
  'bahasa-inggris': 'Bahasa Inggris',
  'pendidikan-agama-islam': 'Pendidikan Agama Islam',
  pai: 'Pendidikan Agama Islam',
  kimia: 'Kimia',
  matematika: 'Matematika',
  biologi: 'Biologi',
  fisika: 'Fisika',
  sosiologi: 'Sosiologi',
  geografi: 'Geografi',
  ekonomi: 'Ekonomi',
  ipa: 'IPA',
  ips: 'IPS',
  basic: 'Basic',
};

const EXCERPT_PER_SUBJECT = {
  Kimia: 'Pahami konsep reaksi kimia, hukum dasar, dan perhitungan stoikiometri.',
  Matematika: 'Pelajari rumus, persamaan fungsi, dan penerapan grafik dengan contoh soal.',
  Biologi: 'Kedalaman konsep sel, jaringan, dan sistem organ makhluk hidup.',
  Fisika: 'Mengerti hukum gerak, gaya, energi, dan fenomena fisika sehari-hari.',
  Sosiologi: 'Menganalisis struktur dan permasalahan sosial di masyarakat.',
  Geografi: 'Memahami dinamika bumi, peta, dan persebaran sumber daya.',
  Ekonomi: 'Menguasai mekanisme pasar, harga keseimbangan, dan kebijakan ekonomi.',
  'Bahasa Indonesia': 'Kaidah bahasa, karya sastra, dan kemampuan komunikasi tertulis.',
  'Bahasa Inggris': 'Tenses dasar, grammar, vocabulary, dan percakapan sehari-hari.',
  'Pendidikan Agama Islam': 'Rukun iman & islam, akhlak, fiqh ibadah, dan Al-Qur\'an Hadits.',
};

const DIFFICULTY_PER_SUBJECT = {
  Matematika: 'Menengah',
  Fisika: 'Menengah',
  Kimia: 'Menengah',
  Ekonomi: 'Dasar',
  Geografi: 'Dasar',
  Biologi: 'Dasar',
  Sosiologi: 'Dasar',
  'Bahasa Indonesia': 'Dasar',
  'Bahasa Inggris': 'Dasar',
  'Pendidikan Agama Islam': 'Dasar',
};

const CATEGORY_COLORS = {
  ipa: '#2a9d99',
  ips: '#0075de',
  basic: '#dd5b00',
};

export const categories = [
  {
    id: 'ipa',
    name: 'IPA',
    description: 'Ilmu Pengetahuan Alam',
    color: '#2a9d99',
    subjects: ['Kimia', 'Matematika', 'Biologi', 'Fisika'],
  },
  {
    id: 'ips',
    name: 'IPS',
    description: 'Ilmu Pengetahuan Sosial',
    color: '#0075de',
    subjects: ['Sosiologi', 'Geografi', 'Ekonomi'],
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Mata Pelajaran Dasar',
    color: '#dd5b00',
    subjects: ['Bahasa Inggris', 'Bahasa Indonesia', 'Pendidikan Agama Islam'],
  },
];

export const GDRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1Zh8JCUWUlQcC402os2fY-Y9WKlT02wjs';

export const ALL_SUBJECTS = [
  { name: 'Kimia', category: 'ipa', color: '#2a9d99' },
  { name: 'Matematika', category: 'ipa', color: '#2a9d99' },
  { name: 'Biologi', category: 'ipa', color: '#2a9d99' },
  { name: 'Fisika', category: 'ipa', color: '#2a9d99' },
  { name: 'Sosiologi', category: 'ips', color: '#0075de' },
  { name: 'Geografi', category: 'ips', color: '#0075de' },
  { name: 'Ekonomi', category: 'ips', color: '#0075de' },
  { name: 'Bahasa Indonesia', category: 'basic', color: '#dd5b00' },
  { name: 'Bahasa Inggris', category: 'basic', color: '#dd5b00' },
  { name: 'Pendidikan Agama Islam', category: 'basic', color: '#dd5b00' },
];

const humanizeWord = (w) => {
  if (!w) return '';
  if (SUBJECT_ALIASES[w.toLowerCase()]) return SUBJECT_ALIASES[w.toLowerCase()];
  return w.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, (c) => c.toUpperCase());
};

const cleanTitle = (raw) => {
  let t = raw
    .replace(/\.(pdf|html)$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+\d+$/, '')
    .trim();
  t = t.replace(/\b\w/g, (c) => c.toUpperCase());
  return t;
};

const simpleHash = (s) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 8);
};

const parseDocPath = (rawPath) => {
  // rawPath looks like: /src/assets/materials/ipa/kimia/Penyetaraan_Reaksi.html
  // parts: ['src', 'assets', 'materials', 'ipa', 'kimia', 'filename.html']
  const parts = rawPath.split('/').filter(Boolean);
  const categoryId =
    parts[3] && ['ipa', 'ips', 'basic'].includes(parts[3].toLowerCase())
      ? parts[3].toLowerCase()
      : null;
  const subjectRaw = categoryId && parts[4] ? parts[4] : null;
  const subject = humanizeWord(subjectRaw || '');
  const fileName = parts[parts.length - 1] || '';
  return {
    path: '/' + parts.slice(3).join('/'), // /ipa/kimia/filename.html
    category:
      categoryId ||
      (['Matematika', 'Fisika', 'Kimia', 'Biologi'].includes(subject)
        ? 'ipa'
        : ['Sosiologi', 'Geografi', 'Ekonomi'].includes(subject)
        ? 'ips'
        : 'basic'),
    subject: subject || 'Umum',
    fileName,
  };
};

const buildMaterial = (rawPath, resolvedUrl) => {
  const parsed = parseDocPath(rawPath);
  const title = cleanTitle(parsed.fileName) || `Materi ${parsed.subject}`;
  const hashId = `mat-${simpleHash(parsed.path)}`;
  const excerpt = EXCERPT_PER_SUBJECT[parsed.subject] || `${title} — ${parsed.subject}.`;
  const color = CATEGORY_COLORS[parsed.category] || '#615d59';

  return {
    id: hashId,
    title,
    subject: parsed.subject,
    category: parsed.category,
    html: resolvedUrl,
    source: 'HTML Materi',
    sourceUrl: GDRIVE_FOLDER_URL,
    gdriveUrl: GDRIVE_FOLDER_URL,
    color,
    sticker: color,
    pages: null,
    updatedAt: new Date().toISOString(),
    wordCount: 0,
    excerpt,
    difficulty: DIFFICULTY_PER_SUBJECT[parsed.subject] || 'Dasar',
    content: null,
  };
};

const scanMaterials = () => {
  const entries = Object.entries(htmlModules || {})
    .filter(([rawPath]) => !rawPath.includes('/converted/'))
    .map(([rawPath, resolvedUrl]) => {
      // If a converted semantic version exists, prioritize it for the reader
      const convertedPath = rawPath.replace('/src/assets/materials/', '/src/assets/materials/converted/');
      const resolvedTarget = htmlModules[convertedPath] || resolvedUrl;
      const url =
        typeof resolvedTarget === 'string'
          ? resolvedTarget
          : rawPath.startsWith('/')
          ? rawPath
          : `/${rawPath}`;
      return buildMaterial(rawPath, url);
    });
  entries.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    if (a.subject !== b.subject) return a.subject.localeCompare(b.subject);
    return a.title.localeCompare(b.title);
  });
  return entries;
};

export const materials = scanMaterials();
