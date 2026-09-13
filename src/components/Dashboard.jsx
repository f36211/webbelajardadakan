import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, FlaskConical, Landmark, GraduationCap, ExternalLink } from 'lucide-react';
import MaterialCard from './MaterialCard';
import Hero7 from './Hero7';
import Dock from './Dock';
import GoogleDriveIcon from './GoogleDriveIcon';
import { categories as catMeta, GDRIVE_FOLDER_URL, ALL_SUBJECTS, getSubjectGdriveUrl, SUBJECT_GDRIVE_LIST } from '../data/materials';

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
  onOpenChat,
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, flexWrap: 'wrap', position: 'relative' }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                onClick={() => { setActiveCategory(cat.id); setActiveSubject('all'); }}
                className="relative inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold cursor-pointer select-none"
                style={{
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? 'none' : `1px solid ${T.hairline}`,
                  background: 'transparent',
                  color: isSelected ? T.onDark : T.stone,
                  letterSpacing: '0.01em',
                  zIndex: 1,
                }}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryIndicator"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'var(--radius-full)',
                      background: cat.color,
                      zIndex: -1,
                      boxShadow: `0 2px 10px ${hexToRgba(cat.color, 0.3)}`,
                    }}
                  />
                )}
                {Icon && <Icon size={12} />}
                <span>{cat.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Baris Tombol Mata Pelajaran + Tombol Google Drive per Mapel */}
        {(() => {
          const currentCategoryMeta = catMeta.find((c) => c.id === activeCategory);
          const relevantSubjects = currentCategoryMeta
            ? currentCategoryMeta.subjects
            : ALL_SUBJECTS.map((s) => s.name);

          return (
            <div
              style={{
                marginBottom: 20,
                padding: '12px 14px',
                background: T.canvas,
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${T.hairline}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: T.stone }}>
                    Mata Pelajaran {activeCategory !== 'all' ? `· ${activeCategory.toUpperCase()}` : ''}
                  </span>
                  <span style={{ fontSize: 11, color: T.ash }}>
                    ({relevantSubjects.length} mapel)
                  </span>
                </div>

                <a
                  href={activeSubject !== 'all' ? getSubjectGdriveUrl(activeSubject) : GDRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border border-blue-200 bg-blue-50/70 text-[#0075de] hover:bg-blue-100 transition-colors"
                  title={activeSubject !== 'all' ? `Buka Folder Google Drive ${activeSubject}` : 'Buka Folder Google Drive Semua Mapel'}
                >
                  <GoogleDriveIcon size={13} />
                  <span>{activeSubject !== 'all' ? `Buka Drive ${activeSubject}` : 'Buka Google Drive Semua Mapel'}</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={() => setActiveSubject('all')}
                  className="px-3 py-1 text-xs font-semibold cursor-pointer transition-colors"
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    border: activeSubject === 'all' ? 'none' : `1px solid ${T.hairline}`,
                    background: activeSubject === 'all' ? T.inkSecondary : T.surface,
                    color: activeSubject === 'all' ? T.onDark : T.stone,
                  }}
                >
                  Semua Mapel
                </motion.button>

                {relevantSubjects.map((subName) => {
                  const isSelected = activeSubject === subName;
                  return (
                    <motion.div
                      key={subName}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${isSelected ? T.primary : T.hairline}`,
                        background: isSelected ? 'rgba(0,117,222,0.06)' : T.canvas,
                        overflow: 'hidden',
                        boxShadow: isSelected ? '0 1px 4px rgba(0,117,222,0.15)' : 'none',
                      }}
                    >
                      <button
                        onClick={() => setActiveSubject(isSelected ? 'all' : subName)}
                        className="px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: isSelected ? T.primary : T.inkSecondary,
                          fontWeight: isSelected ? 700 : 500,
                        }}
                      >
                        {subName}
                      </button>

                      <a
                        href={getSubjectGdriveUrl(subName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 flex items-center gap-1 text-[10px] font-semibold border-l transition-colors"
                        style={{
                          borderColor: isSelected ? 'rgba(0,117,222,0.2)' : T.hairline,
                          background: isSelected ? 'rgba(0,117,222,0.1)' : T.surface,
                          color: isSelected ? T.primary : T.stone,
                          textDecoration: 'none',
                        }}
                        title={`Buka Folder Google Drive ${subName}`}
                      >
                        <GoogleDriveIcon size={11} />
                        <span>Drive</span>
                        <ExternalLink size={9} style={{ opacity: 0.6 }} />
                      </a>
                    </motion.div>
                  );
                })}
              </div>

              {/* Dedicated Google Drive per Mapel grid within subject bar */}
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 12,
                  borderTop: `1px dashed ${T.hairline}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <GoogleDriveIcon size={14} />
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.stone }}>
                      Folder Google Drive per Mata Pelajaran
                    </span>
                  </div>
                  <span style={{ fontSize: 10.5, color: T.ash }}>
                    Folder Drive khusus materi PSTS
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 6 }}>
                  {SUBJECT_GDRIVE_LIST.map((item) => (
                    <a
                      key={item.subject}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 10px',
                        borderRadius: 6,
                        background: T.surface,
                        border: `1px solid ${T.hairline}`,
                        color: T.ink,
                        fontSize: 11.5,
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0075de';
                        e.currentTarget.style.color = '#0075de';
                        e.currentTarget.style.background = T.canvas;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = T.hairline;
                        e.currentTarget.style.color = T.ink;
                        e.currentTarget.style.background = T.surface;
                      }}
                      title={`Buka Folder Google Drive ${item.name}`}
                    >
                      <GoogleDriveIcon size={12} />
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.short}
                      </span>
                      <ExternalLink size={9} style={{ opacity: 0.5, flexShrink: 0 }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

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
            layout
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-4 materi-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))' }}
          >
            <AnimatePresence mode="popLayout">
              {materials.map((material, index) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  index={index}
                  onClick={() => onOpenMaterial(material)}
                />
              ))}
            </AnimatePresence>
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
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                        {cat.subjects.map((s) => (
                          <a
                            key={s}
                            href={getSubjectGdriveUrl(s)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: 'var(--radius-sm)',
                              background: T.surface,
                              color: T.stone,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              textDecoration: 'none',
                              border: `1px solid ${T.hairline}`,
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = cat.color;
                              e.currentTarget.style.borderColor = cat.color;
                              e.currentTarget.style.background = T.canvas;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = T.stone;
                              e.currentTarget.style.borderColor = T.hairline;
                              e.currentTarget.style.background = T.surface;
                            }}
                            title={`Buka Google Drive ${s}`}
                          >
                            <GoogleDriveIcon size={11} />
                            <span>{s}</span>
                            <ExternalLink size={9} style={{ opacity: 0.6 }} />
                          </a>
                        ))}
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
        onOpenChat={onOpenChat}
      />
    </div>
  );
}
