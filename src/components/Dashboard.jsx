import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, BookOpen, FlaskConical, Landmark, GraduationCap } from 'lucide-react';
import MaterialCard from './MaterialCard';
import Hero7 from './Hero7';
import Dock from './Dock';
import { categories as catMeta } from '../data/materials';

const T = {
  primary: '#0075de',
  primaryActive: '#005bab',
  ink: '#000000',
  inkSecondary: '#31302e',
  stone: '#615d59',
  ash: '#a39e98',
  hairline: '#e6e6e6',
  surface: '#f6f5f4',
  canvas: '#ffffff',
  onDark: '#ffffff',
  stickerTeal: '#2a9d99',
  stickerOrange: '#dd5b00',
  stickerSky: '#62aef0',
  stickerPurple: '#d6b6f6',
};

const hexToRgba = (hex, alpha = 1) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6), 16);
  return `rgba(${r >> 16},${(r >> 8) & 255},${r & 255},${alpha})`;
};

const categories = [
  { id: 'all', name: 'Semua', color: T.inkSecondary, icon: BookOpen },
  { id: 'ipa', name: 'IPA', color: T.stickerTeal, icon: FlaskConical },
  { id: 'ips', name: 'IPS', color: T.primary, icon: Landmark },
  { id: 'basic', name: 'Basic', color: T.stickerOrange, icon: GraduationCap },
];

export default function Dashboard({
  materials,
  allMaterials,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  activeSubject,
  setActiveSubject,
  onOpenMaterial,
}) {
  const [activeNavItem, setActiveNavItem] = useState('home');

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.08 },
    },
  };

  return (
    <div className="min-h-screen" style={{ background: T.surface }}>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-32" style={{ paddingBottom: 120 }}>
        {!searchQuery && activeCategory === 'all' && (
          <Hero7
            heading="Catatan Belajar"
            headingAccent="PSTS SMAITUQB"
            description={`Akses ${allMaterials.length} materi pelajaran IPA, IPS, dan Lainnya lengkap dengan rumus Matematika, tabel data, dan penjelasan mendalam. Semua dalam satu platform.`}
            ctaText="Jelajahi Koleksi"
            ctaUrl="#materials"
            totalMaterials={allMaterials.length}
          />
        )}

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: T.ink,
              letterSpacing: '-0.015em',
            }}
          >
            Koleksi Materi
          </h2>
          <span style={{ fontSize: 12, color: T.ash }}>
            {materials.length} materi
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setActiveSubject('all'); }}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold cursor-pointer transition-all duration-150"
                style={{
                  borderRadius: 'var(--radius-full)',
                  border: activeCategory === cat.id ? 'none' : `1px solid ${T.hairline}`,
                  background: activeCategory === cat.id ? cat.color : 'transparent',
                  color: activeCategory === cat.id ? T.onDark : T.stone,
                  letterSpacing: '0.01em',
                }}
              >
                {Icon && <Icon size={12} />}
                {cat.name}
              </button>
            );
          })}
        </div>

        {searchQuery && (
          <div className="mb-4" style={{ padding: '8px 14px', background: T.canvas, borderRadius: 10, border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', width: '100%', boxSizing: 'border-box' }}>
            <Search size={14} style={{ color: T.ash }} />
            <span style={{ fontSize: 13, color: T.stone }}>
              Hasil untuk "<strong style={{ color: T.ink }}>{searchQuery}</strong>" — {materials.length} materi
            </span>
            <button
              onClick={() => setSearchQuery('')}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
            >
              <X size={13} style={{ color: T.ash }} />
            </button>
          </div>
        )}

        {materials.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-4 materi-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))' }}
          >
            {materials.map((material, index) => (
              <MaterialCard
                key={material.id}
                material={material}
                index={index}
                onClick={() => onOpenMaterial(material)}
              />
            ))}
          </motion.div>
        ) : allMaterials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20"
          >
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <div
                  className="w-16 h-16 mx-auto mb-5 flex items-center justify-center"
                  style={{
                    background: 'rgba(0,117,222,0.06)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid rgba(0,117,222,0.12)',
                  }}
                >
                  <BookOpen className="w-7 h-7" style={{ color: T.primary }} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: T.ink, marginBottom: 8, letterSpacing: '-0.015em' }}>
                  Koleksi Materi Belajar
                </h3>
                <p style={{ fontSize: 14, color: T.stone, maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
                  Pilih kategori di bawah ini untuk menjelajahi mata pelajaran, atau gunakan tombol{' '}
                  <strong style={{ color: T.primary }}>Materi</strong> di Dock untuk pencarian cepat.
                </p>
              </div>

              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                {catMeta.map((cat, i) => {
                  const CatIcon = [FlaskConical, Landmark, GraduationCap][i] || BookOpen;
                  return (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * i }}
                      onClick={() => { setActiveCategory(cat.id); setActiveNavItem(cat.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="text-left cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        padding: '20px 18px',
                        borderRadius: 'var(--radius-lg)',
                        background: T.canvas,
                        border: `1px solid ${T.hairline}`,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.06)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.hairline; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div
                        className="inline-flex items-center justify-center mb-3"
                        style={{
                          width: 38, height: 38,
                          borderRadius: 10,
                          background: hexToRgba(cat.color, 0.08),
                          color: cat.color,
                        }}
                      >
                        <CatIcon size={18} />
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em', marginBottom: 4 }}>
                        {cat.name}
                      </div>
                      <div style={{ fontSize: 12, color: T.stone, lineHeight: 1.5, marginBottom: 12 }}>
                        {cat.description}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {cat.subjects.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              background: T.surface,
                              color: T.stone,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                        {cat.subjects.length > 3 && (
                          <span style={{ fontSize: 10, color: T.ash, fontWeight: 500 }}>+{cat.subjects.length - 3}</span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div
                className="mt-10 flex items-center gap-3"
                style={{
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(42,157,153,0.05)',
                  border: '1px solid rgba(42,157,153,0.12)',
                }}
              >
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(42,157,153,0.10)',
                    color: '#2a9d99',
                    flexShrink: 0,
                  }}
                >
                  <Search size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 2 }}>
                    Cari materi dengan Dock
                  </div>
                  <div style={{ fontSize: 11, color: T.stone, lineHeight: 1.5 }}>
                    Ketuk tombol <strong style={{ color: T.primary }}>Materi</strong> di navigasi bawah untuk pencarian instan & berpindah kategori dengan cepat.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div
              className="w-14 h-14 mx-auto mb-4 flex items-center justify-center"
              style={{ background: T.surface, borderRadius: 'var(--radius-lg)', border: `1px solid ${T.hairline}` }}
            >
              <Search className="w-6 h-6" style={{ color: T.ash }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: T.ink, marginBottom: 6 }}>Tidak ada hasil</h3>
            <p style={{ fontSize: 14, color: T.stone }}>Coba kata kunci lain atau ubah filter kategori</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); setActiveSubject('all'); }}
              className="mt-5 px-4 py-2 text-sm font-medium cursor-pointer transition-colors"
              style={{
                background: 'rgba(0,117,222,0.06)',
                color: T.primary,
                borderRadius: 'var(--radius-md)',
                border: `1px solid rgba(0,117,222,0.12)`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,117,222,0.10)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,117,222,0.06)'; }}
            >
              Reset semua filter
            </button>
          </motion.div>
        )}
      </main>

    

      <Dock
        activeItem={activeNavItem}
        onNavigate={(id) => {
          setActiveNavItem(id);
          if (id === 'home') {
            setActiveCategory('all');
            setActiveSubject('all');
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onSelectMaterial={(material) => onOpenMaterial(material)}
        materials={allMaterials}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={(cat) => { setActiveCategory(cat); setActiveSubject('all'); setActiveNavItem('materi'); }}
        catMeta={catMeta}
      />
    </div>
  );
}
