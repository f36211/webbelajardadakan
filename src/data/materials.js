const htmlModules = import.meta.glob('/src/assets/materials/**/*.html', {
  eager: true,
  query: '?url',
  import: 'default',
});

const SUBJECT_ALIASES = {
  'bahasa-indonesia': 'Bahasa Indonesia',
  'bahasa-inggris': 'Bahasa Inggris',
  'bahasa-arab': 'Bahasa Arab',
  'b-arab': 'Bahasa Arab',
  barab: 'Bahasa Arab',
  sejarah: 'Sejarah',
  'pendidikan-agama-islam': 'Pendidikan Agama Islam',
  pai: 'Pendidikan Agama Islam',
  kimia: 'Kimia',
  matematika: 'Matematika',
  mtk: 'Matematika',
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
  Sejarah: 'Mempelajari peristiwa penting, kronologi, dan dinamika peradaban masa lalu.',
  'Bahasa Indonesia': 'Kaidah bahasa, karya sastra, dan kemampuan komunikasi tertulis.',
  'Bahasa Inggris': 'Tenses dasar, grammar, vocabulary, dan percakapan sehari-hari.',
  'Bahasa Arab': 'Kosakata dasar, kaidah nahwu shorof, dan pemahaman teks bahasa Arab.',
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
  Sejarah: 'Dasar',
  'Bahasa Indonesia': 'Dasar',
  'Bahasa Inggris': 'Dasar',
  'Bahasa Arab': 'Menengah',
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
    subjects: ['Sosiologi', 'Geografi', 'Ekonomi', 'Sejarah'],
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Mata Pelajaran Dasar',
    color: '#dd5b00',
    subjects: ['Bahasa Inggris', 'Bahasa Indonesia', 'Bahasa Arab', 'Pendidikan Agama Islam'],
  },
];

export const GDRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1Zh8JCUWUlQcC402os2fY-Y9WKlT02wjs';

export const SUBJECT_GDRIVE_URLS = {
  Sejarah:
    'https://drive.google.com/drive/folders/1BPTbktn2iuQM7Nv_XXeTXfjUSUS9rsks?usp=drive_link',
  Matematika:
    'https://drive.google.com/drive/folders/1ZRRaw5g0wAQ9VLDW-vHNwoGCvG-ADk9Y?usp=drive_link',
  Ekonomi:
    'https://drive.google.com/drive/folders/1jADgwD4afeHWCaLGccaKrXNhRBfLYrYu?usp=drive_link',
  'Bahasa Arab':
    'https://drive.google.com/drive/folders/1T1BdGTGl39UtKD45SWa9qon7sGcZKTw1?usp=drive_link',
  Kimia:
    'https://drive.google.com/drive/folders/1Fgn99Fk233bilMl2uue70mSc1DCIhWwZ?usp=drive_link',
  'Pendidikan Agama Islam':
    'https://drive.google.com/drive/folders/1iZFm1CYAKNWpo4SAHTcCUB55-8-Jy0H9?usp=drive_link',
};

export const SUBJECT_GDRIVE_LIST = [
  {
    name: 'Kimia',
    short: 'Kimia',
    subject: 'Kimia',
    category: 'ipa',
    color: '#2a9d99',
    url: 'https://drive.google.com/drive/folders/1Fgn99Fk233bilMl2uue70mSc1DCIhWwZ?usp=drive_link',
    isCustom: true,
  },
  {
    name: 'Matematika (Mtk)',
    short: 'Mtk',
    subject: 'Matematika',
    category: 'ipa',
    color: '#2a9d99',
    url: 'https://drive.google.com/drive/folders/1ZRRaw5g0wAQ9VLDW-vHNwoGCvG-ADk9Y?usp=drive_link',
    isCustom: true,
  },
  {
    name: 'Ekonomi',
    short: 'Ekonomi',
    subject: 'Ekonomi',
    category: 'ips',
    color: '#0075de',
    url: 'https://drive.google.com/drive/folders/1jADgwD4afeHWCaLGccaKrXNhRBfLYrYu?usp=drive_link',
    isCustom: true,
  },
  {
    name: 'Sejarah',
    short: 'Sejarah',
    subject: 'Sejarah',
    category: 'ips',
    color: '#0075de',
    url: 'https://drive.google.com/drive/folders/1BPTbktn2iuQM7Nv_XXeTXfjUSUS9rsks?usp=drive_link',
    isCustom: true,
  },
  {
    name: 'Bahasa Arab (B. Arab)',
    short: 'B. Arab',
    subject: 'Bahasa Arab',
    category: 'basic',
    color: '#dd5b00',
    url: 'https://drive.google.com/drive/folders/1T1BdGTGl39UtKD45SWa9qon7sGcZKTw1?usp=drive_link',
    isCustom: true,
  },
  {
    name: 'Pendidikan Agama Islam (PAI)',
    short: 'PAI',
    subject: 'Pendidikan Agama Islam',
    category: 'basic',
    color: '#dd5b00',
    url: 'https://drive.google.com/drive/folders/1iZFm1CYAKNWpo4SAHTcCUB55-8-Jy0H9?usp=drive_link',
    isCustom: true,
  },
  {
    name: 'Biologi',
    short: 'Biologi',
    subject: 'Biologi',
    category: 'ipa',
    color: '#2a9d99',
    url: GDRIVE_FOLDER_URL,
    isCustom: false,
  },
  {
    name: 'Fisika',
    short: 'Fisika',
    subject: 'Fisika',
    category: 'ipa',
    color: '#2a9d99',
    url: GDRIVE_FOLDER_URL,
    isCustom: false,
  },
  {
    name: 'Sosiologi',
    short: 'Sosiologi',
    subject: 'Sosiologi',
    category: 'ips',
    color: '#0075de',
    url: GDRIVE_FOLDER_URL,
    isCustom: false,
  },
  {
    name: 'Geografi',
    short: 'Geografi',
    subject: 'Geografi',
    category: 'ips',
    color: '#0075de',
    url: GDRIVE_FOLDER_URL,
    isCustom: false,
  },
  {
    name: 'Bahasa Indonesia',
    short: 'B. Indonesia',
    subject: 'Bahasa Indonesia',
    category: 'basic',
    color: '#dd5b00',
    url: GDRIVE_FOLDER_URL,
    isCustom: false,
  },
  {
    name: 'Bahasa Inggris',
    short: 'B. Inggris',
    subject: 'Bahasa Inggris',
    category: 'basic',
    color: '#dd5b00',
    url: GDRIVE_FOLDER_URL,
    isCustom: false,
  },
];

export const getSubjectGdriveUrl = (subject) => {
  if (!subject) return GDRIVE_FOLDER_URL;
  const s = String(subject).toLowerCase().replace(/[-_]/g, ' ').trim();
  if (s === 'mtk' || s === 'matematika' || s.includes('trigonometri')) {
    return SUBJECT_GDRIVE_URLS.Matematika;
  }
  if (s === 'kimia' || s.includes('reaksi')) {
    return SUBJECT_GDRIVE_URLS.Kimia;
  }
  if (s === 'ekonomi') {
    return SUBJECT_GDRIVE_URLS.Ekonomi;
  }
  if (s === 'sejarah') {
    return SUBJECT_GDRIVE_URLS.Sejarah;
  }
  if (s.includes('arab')) {
    return SUBJECT_GDRIVE_URLS['Bahasa Arab'];
  }
  if (s.includes('pai') || s.includes('agama') || s.includes('islam') || s.includes('khairat')) {
    return SUBJECT_GDRIVE_URLS['Pendidikan Agama Islam'];
  }
  return SUBJECT_GDRIVE_URLS[subject] || GDRIVE_FOLDER_URL;
};

export const ALL_SUBJECTS = [
  { name: 'Kimia', category: 'ipa', color: '#2a9d99' },
  { name: 'Matematika', category: 'ipa', color: '#2a9d99' },
  { name: 'Biologi', category: 'ipa', color: '#2a9d99' },
  { name: 'Fisika', category: 'ipa', color: '#2a9d99' },
  { name: 'Sosiologi', category: 'ips', color: '#0075de' },
  { name: 'Geografi', category: 'ips', color: '#0075de' },
  { name: 'Ekonomi', category: 'ips', color: '#0075de' },
  { name: 'Sejarah', category: 'ips', color: '#0075de' },
  { name: 'Bahasa Indonesia', category: 'basic', color: '#dd5b00' },
  { name: 'Bahasa Inggris', category: 'basic', color: '#dd5b00' },
  { name: 'Bahasa Arab', category: 'basic', color: '#dd5b00' },
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
        : ['Sosiologi', 'Geografi', 'Ekonomi', 'Sejarah'].includes(subject)
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
  const gdriveUrl = getSubjectGdriveUrl(parsed.subject);

  return {
    id: hashId,
    title,
    subject: parsed.subject,
    category: parsed.category,
    html: resolvedUrl,
    source: 'HTML Materi',
    sourceUrl: gdriveUrl,
    gdriveUrl: gdriveUrl,
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
