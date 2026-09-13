import { motion } from 'framer-motion';
import { ArrowRight, FileText, Settings2, PanelLeftOpen, ExternalLink } from 'lucide-react';
import GoogleDriveIcon from './GoogleDriveIcon';
import { GDRIVE_FOLDER_URL } from '../data/materials';

// Notion design tokens
const T = {
  primary: '#0075de',
  primaryActive: '#005bab',
  ink: 'var(--app-text, #000000)',
  inkSecondary: 'var(--app-text-secondary, #31302e)',
  stone: 'var(--app-text-muted, #615d59)',
  ash: 'var(--app-text-ash, #a39e98)',
  hairline: 'var(--app-hairline, #e6e6e6)',
  surface: 'var(--app-surface, #f6f5f4)',
  canvas: 'var(--app-canvas, #ffffff)',
  onDark: '#ffffff',
  stickerTeal: '#2a9d99',
  stickerOrange: '#dd5b00',
  stickerSky: '#62aef0',
};


// A miniature Smart Reader preview for the right column
function ReaderPreview() {
  return (
    <motion.div
      whileHover={{ y: -5, rotateZ: -0.3 }}
      transition={{ type: 'spring', stiffness: 340, damping: 22 }}
      className="double-bezel-outer"
      style={{
        flex: 1,
        maxWidth: 420,
        alignSelf: 'center',
        boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div
        className="double-bezel-inner"
        style={{
          overflow: 'hidden',
          background: T.canvas,
        }}
      >
      {/* Reader toolbar mockup */}
      <div
        style={{
          padding: '10px 14px',
          borderBottom: `1px solid ${T.hairline}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: T.surface,
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          {['#e6e6e6', '#e6e6e6', '#e6e6e6'].map((c, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            height: 22,
            borderRadius: 6,
            background: T.surface,
            border: `1px solid ${T.hairline}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px',
            gap: 4,
          }}
        >
          <FileText size={10} style={{ color: T.ash }} />
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: T.hairline }} />
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          <div style={{ width: 24, height: 22, borderRadius: 5, border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PanelLeftOpen size={10} style={{ color: T.ash }} />
          </div>
          <div style={{ width: 24, height: 22, borderRadius: 5, border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings2 size={10} style={{ color: T.ash }} />
          </div>
        </div>
      </div>

      {/* Reader body — two columns */}
      <div style={{ display: 'flex', height: 240 }}>
        {/* TOC sidebar mockup */}
        <div
          style={{
            width: 140,
            borderRight: `1px solid ${T.hairline}`,
            padding: '12px 10px',
            background: T.surface,
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 700, color: T.ash, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
            Daftar Isi
          </div>
          {[
            { level: 1, text: 'Stoikiometri', active: true },
            { level: 2, text: 'Hukum kekekalan massa' },
            { level: 2, text: 'Konsep mol' },
            { level: 2, text: 'Rumus empiris & molekul' },
            { level: 1, text: 'Reaksi Kimia' },
            { level: 2, text: 'Jenis reaksi' },
            { level: 2, text: 'Penyetaraan' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                paddingLeft: item.level === 1 ? 0 : 8,
                paddingTop: 3,
                paddingBottom: 3,
                paddingRight: 4,
                borderRadius: 4,
                background: item.active ? 'rgba(0,117,222,0.08)' : 'transparent',
              }}
            >
              <div
                style={{
                  fontSize: item.level === 1 ? 10 : 9,
                  fontWeight: item.active ? 700 : item.level === 1 ? 600 : 400,
                  color: item.active ? T.primary : T.stone,
                  lineHeight: 1.3,
                }}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* Content area mockup */}
        <div style={{ flex: 1, padding: '12px 14px', overflow: 'hidden' }}>
          {/* Progress bar */}
          <div style={{ height: 2, background: T.hairline, borderRadius: 1, marginBottom: 10 }}>
            <div style={{ width: '32%', height: '100%', background: T.primary, borderRadius: 1 }} />
          </div>

          {/* Content lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>
              Stoikiometri
            </div>
            <div style={{ height: 5, borderRadius: 2, background: T.hairline, width: '85%' }} />
            <div style={{ height: 4, borderRadius: 2, background: T.hairline, width: '100%', opacity: 0.7 }} />
            <div style={{ height: 4, borderRadius: 2, background: T.hairline, width: '92%', opacity: 0.7 }} />

            <div style={{ fontSize: 10, fontWeight: 600, color: T.ink, marginTop: 4 }}>
              Hukum Kekekalan Massa
            </div>
            <div style={{ height: 4, borderRadius: 2, background: T.hairline, width: '100%', opacity: 0.7 }} />
            <div style={{ height: 4, borderRadius: 2, background: T.hairline, width: '78%', opacity: 0.7 }} />

            {/* Math mockup */}
            <div
              style={{
                marginTop: 2,
                padding: '6px 10px',
                background: T.surface,
                borderRadius: 6,
                border: `1px solid ${T.hairline}`,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 13, fontFamily: 'serif', color: T.ink, fontStyle: 'italic' }}>
                n = m / M
              </span>
              <span style={{ fontSize: 9, color: T.ash }}>← Mol</span>
            </div>

            <div style={{ height: 4, borderRadius: 2, background: '#e6e6e6', width: '88%' }} />
            <div style={{ height: 4, borderRadius: 2, background: '#e6e6e6', width: '95%' }} />

            {/* Table mockup */}
            <div style={{ marginTop: 2, borderRadius: 6, border: `1px solid ${T.hairline}`, overflow: 'hidden' }}>
              <div style={{ padding: '4px 8px', background: T.surface, borderBottom: `1px solid ${T.hairline}`, fontSize: 8, fontWeight: 700, color: T.stone, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Tabel Unsur
              </div>
              {['H', 'He', 'Li', 'Be'].map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    padding: '3px 8px',
                    borderBottom: i < 3 ? `1px solid ${T.hairline}` : 'none',
                    background: i % 2 === 1 ? 'rgba(0,0,0,0.015)' : 'transparent',
                  }}
                >
                  <div style={{ width: 14, height: 10, borderRadius: 2, background: T.primary, opacity: 0.6, marginRight: 4 }} />
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#e6e6e6' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reading theme pills */}
      <div
        style={{
          padding: '8px 14px',
          borderTop: `1px solid ${T.hairline}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: T.surface,
        }}
      >
        <div style={{ display: 'flex', gap: 3 }}>
          {['#ffffff', '#16171d', '#f4ecd8'].map((c, i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: c,
                border: `1px solid ${T.hairline}`,
                boxShadow: i === 0 ? `inset 0 0 0 1.5px rgba(0,0,0,0.1)` : 'none',
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 9, color: T.ash }}>
          12px — 28px
        </div>
      </div>
    </div>
  </motion.div>
  );
}

export default function Hero7({
  heading = 'Perpustakaan Digital untuk',
  headingAccent = 'Semua Jenjang Belajar',
  description = 'Akses materi pelajaran IPA, IPS, dan Basic lengkap dengan rumus Matematika, tabel data, dan penjelasan mendalam. Semua dalam satu platform.',
  ctaText = 'Jelajahi Koleksi',
  ctaUrl = '#materials',
  totalMaterials = 9,
}) {
  return (
    <div className="hero-wrapper" style={{ padding: '48px 0 32px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 40,
          alignItems: 'center',
          padding: '0 24px',
        }}
        className="hero-inner"
      >
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ minWidth: 0, maxWidth: 600 }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(0,117,222,0.08)',
              marginBottom: 18,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: T.primary,
                boxShadow: `0 0 0 3px rgba(0,117,222,0.15)`,
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: T.primary,
                letterSpacing: '0.01em',
              }}
            >
              TrifectaStudy
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(28px, 4.5vw, 48px)',
              fontWeight: 800,
              color: T.ink,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginBottom: 16,
            }}
          >
            {heading}
            <br />
            <span style={{ color: T.primary }}>{headingAccent}</span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 16,
              color: T.inkSecondary,
              lineHeight: 1.6,
              marginBottom: 28,
              maxWidth: 460,
            }}
          >
            {description}
          </p>

          {/* CTA + compact stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <motion.a
              href={ctaUrl}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('materials')?.scrollIntoView({ behavior: 'smooth' });
              }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              className="group"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px 10px 22px',
                borderRadius: 'var(--radius-full)',
                background: T.primary,
                color: T.onDark,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0,117,222,0.28)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <span>{ctaText}</span>
              <span className="btn-nested-icon w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                <ArrowRight size={14} strokeWidth={2.5} />
              </span>
            </motion.a>

            <motion.a
              href={GDRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                background: T.canvas,
                color: T.ink,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                border: `1px solid ${T.hairline}`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <GoogleDriveIcon size={16} />
              <span>Google Drive Materi</span>
              <ExternalLink size={13} style={{ color: T.stone }} />
            </motion.a>

            {/* Compact inline stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.stone }}>
                <span style={{ fontWeight: 700, color: T.ink }}>{totalMaterials}</span> materi
              </span>
              <span style={{ color: T.stone, opacity: 0.4 }}>·</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.stone }}>
                <span style={{ fontWeight: 700, color: T.ink }}>3</span> kategori
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right: Smart Reader Preview */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: 420,
          }}
          className="hero-preview"
        >
          <ReaderPreview />
        </motion.div>
      </div>
      <style>{`
        @media (max-width: 960px) {
          .hero-inner {
            grid-template-columns: 1fr !important;
          }
          .hero-preview {
            width: 100% !important;
            max-width: 560px !important;
            margin: 0 auto;
          }
        }

        @media (max-width: 640px) {
          .hero-wrapper { padding: 32px 0 20px !important; }
          .hero-inner {
            padding: 0 16px !important;
            gap: 28px !important;
          }
        }

        @media (max-width: 420px) {
          .hero-wrapper { padding: 24px 0 16px !important; }
          .hero-inner { padding: 0 14px !important; gap: 20px !important; }
          .hero-preview { max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
