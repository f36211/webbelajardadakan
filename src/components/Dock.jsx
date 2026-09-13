import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BookOpen, ChevronDown, Search, Clock,
  Settings, FlaskConical, Landmark, GraduationCap, X,
  Moon, Sun, Type, ZoomIn, ZoomOut, ExternalLink, Sparkles,
} from 'lucide-react';
import GoogleDriveIcon from './GoogleDriveIcon';
import { GDRIVE_FOLDER_URL, SUBJECT_GDRIVE_LIST } from '../data/materials';

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

const CATEGORY_COLORS = {
  ipa: T.stickerTeal,
  ips: T.primary,
  basic: T.stickerOrange,
};

const hexToRgba = (hex, alpha = 1) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6), 16);
  return `rgba(${r >> 16},${(r >> 8) & 255},${r & 255},${alpha})`;
};

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

function DockButton({ icon: Icon, label, onClick, active, wide, accent, alwaysWide }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={[
        'dock-btn',
        wide ? 'is-wide' : '',
        alwaysWide ? 'always-wide' : '',
        active ? 'is-active' : '',
      ].join(' ')}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: wide ? 6 : 0,
        padding: wide ? '0 14px' : '0 10px',
        height: 40,
        minWidth: wide ? 'auto' : 40,
        justifyContent: 'center',
        borderRadius: 12,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 13,
        fontWeight: 600,
        color: active ? (accent || T.primary) : T.stone,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--dock-hover-bg, rgba(0,0,0,0.04))'; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      {active && (
        <motion.div
          layoutId="activeDockBubble"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 12,
            background: accent ? hexToRgba(accent, 0.12) : 'rgba(0,117,222,0.12)',
            border: `1px solid ${accent ? hexToRgba(accent, 0.25) : 'rgba(0,117,222,0.25)'}`,
            zIndex: 0,
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
        />
      )}
      <Icon size={18} style={{ flexShrink: 0, position: 'relative', zIndex: 1 }} />
      <span className="dock-btn-label" style={{ fontSize: 13, lineHeight: 1, position: 'relative', zIndex: 1 }}>{label}</span>
      {wide && label === 'Materi' && (
        <ChevronDown className="dock-btn-chevron" size={14} style={{ transition: 'transform 0.2s', position: 'relative', zIndex: 1 }} />
      )}
    </motion.button>
  );
}

function PanelShell({ children, onClose, title, subtitle, accent, initialPanel }) {
  const [panel, setPanel] = useState(initialPanel || 'content');
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="panel-shell"
      style={{
        position: 'fixed',
        bottom: 84,
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        zIndex: 200,
        width: 'calc(100% - 24px)',
        maxWidth: 640,
        maxHeight: '72vh',
        background: T.canvas,
        borderRadius: 16,
        border: `1px solid ${T.hairline}`,
        boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{
        padding: '14px 18px 12px',
        borderBottom: `1px solid ${T.hairline}`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
      }}>
        <div
          style={{
            width: 34, height: 34,
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: accent ? hexToRgba(accent, 0.10) : 'rgba(0,0,0,0.04)',
            color: accent || T.inkSecondary,
            flexShrink: 0,
          }}
        >
          {title === 'Materi' && <BookOpen size={16} />}
          {title === 'Kategori' && <GraduationCap size={16} />}
          {title === 'Riwayat' && <Clock size={16} />}
          {title === 'Pengaturan' && <Settings size={16} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: T.ash, marginTop: 2 }}>{subtitle}</div>}
        </div>
        <button
          onClick={onClose}
          style={{
            width: 30, height: 30, borderRadius: 8,
            border: `1px solid ${T.hairline}`,
            background: T.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            color: T.stone,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--dock-hover-bg, rgba(0,0,0,0.06))'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = T.surface; }}
        >
          <X size={14} />
        </button>
      </div>
      {children && children({ panel, setPanel })}
    </motion.div>
  );
}

function EmptyState({ icon: Icon, color, title, description, hint }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 64, height: 64,
          borderRadius: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: hexToRgba(color, 0.08),
          color,
          marginBottom: 16,
        }}
      >
        <Icon size={26} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 6, letterSpacing: '-0.01em' }}>
        {title}
      </div>
      <div style={{ fontSize: 12, color: T.stone, maxWidth: 340, lineHeight: 1.6, marginBottom: 12 }}>
        {description}
      </div>
      {hint && (
        <div
          style={{
            fontSize: 11, color: T.ash,
            padding: '6px 12px', borderRadius: 'var(--radius-full)',
            background: T.surface,
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

export default function Dock({
  activeItem,
  onNavigate,
  onSelectMaterial,
  materials,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  catMeta = [],
  onOpenChat,
  theme,
  onThemeChange,
  fontFamily = 'sans',
  onFontFamilyChange,
  lineHeight = '1.7',
  onLineHeightChange,
  focusMode = false,
  onFocusModeChange,
}) {
  const [activePanel, setActivePanel] = useState(null);
  const [localSearch, setLocalSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [fontSize, setFontSize] = useState(17);
  const currentTheme = theme || localStorage.getItem('app_theme') || 'light';

  const panelRef = useRef(null);

  useEffect(() => {
    if (!activePanel) return;
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        const dock = document.querySelector('[data-dock="true"]');
        if (dock && dock.contains(e.target)) return;
        setActivePanel(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [activePanel]);

  useEffect(() => {
    document.documentElement.style.setProperty('--reading-font-size', `${fontSize}px`);
  }, [fontSize]);

  const togglePanel = (id) => setActivePanel((cur) => (cur === id ? null : id));

  const tabs = [
    { id: 'all', name: 'Semua', color: T.inkSecondary },
    { id: 'ipa', name: 'IPA', color: T.stickerTeal },
    { id: 'ips', name: 'IPS', color: T.primary },
    { id: 'basic', name: 'Basic', color: T.stickerOrange },
  ];

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      !localSearch ||
      m.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      m.subject.toLowerCase().includes(localSearch.toLowerCase());
    const matchesCategory = activeTab === 'all' || m.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <AnimatePresence>
        {activePanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePanel(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 150 }}
          />
        )}
      </AnimatePresence>

      <div ref={panelRef}>
        <AnimatePresence>
          {activePanel === 'materi' && (
            <PanelShell
              title="Materi"
              subtitle={`${filteredMaterials.length} tersedia`}
              accent={T.primary}
              onClose={() => setActivePanel(null)}
            >
              {() => (
                <>
                  <div style={{ padding: '12px 16px 10px', borderBottom: `1px solid ${T.hairline}`, flexShrink: 0 }}>
                    <div
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 12px',
                        background: T.surface,
                        borderRadius: 10,
                        border: `1px solid ${T.hairline}`,
                      }}
                    >
                      <Search size={15} style={{ color: T.ash, flexShrink: 0 }} />
                      <input
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="Cari materi..."
                        style={{
                          flex: 1, border: 'none', outline: 'none',
                          fontSize: 14, color: T.ink,
                          background: 'transparent', fontFamily: 'inherit',
                          minWidth: 0,
                        }}
                      />
                      {localSearch && (
                        <button
                          onClick={() => setLocalSearch('')}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', flexShrink: 0 }}
                        >
                          <span style={{ fontSize: 11, color: T.ash, fontWeight: 600 }}>Clear</span>
                        </button>
                      )}
                    </div>
                    <div className="panel-tabs" style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'nowrap', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className="panel-tab-pill"
                          style={{
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            border: activeTab === tab.id ? 'none' : `1px solid ${T.hairline}`,
                            background: activeTab === tab.id ? tab.color : 'transparent',
                            color: activeTab === tab.id ? T.onDark : T.stone,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                        >
                          {tab.name}
                        </button>
                      ))}
                      <a
                        href={GDRIVE_FOLDER_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="panel-tab-pill"
                        style={{
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          border: `1px solid rgba(0,117,222,0.25)`,
                          background: 'rgba(0,117,222,0.06)',
                          color: '#0075de',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                          flexShrink: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          textDecoration: 'none',
                        }}
                        title="Buka Folder Google Drive Semua Materi"
                      >
                        <GoogleDriveIcon size={12} />
                        <span>Folder Drive</span>
                        <ExternalLink size={9} />
                      </a>
                    </div>
                  </div>

                  <div style={{ overflowY: 'auto', flex: 1, padding: '8px 8px' }}>
                    {filteredMaterials.length > 0 ? (
                      <div className="panel-materi-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        {filteredMaterials.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => {
                              onSelectMaterial && onSelectMaterial(m);
                              setActivePanel(null);
                              setLocalSearch('');
                            }}
                            className="panel-materi-item"
                            style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '10px 12px',
                              borderRadius: 10,
                              border: `1px solid ${T.hairline}`,
                              background: T.canvas,
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontFamily: 'inherit',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = CATEGORY_COLORS[m.category] || T.primary;
                              e.currentTarget.style.background = T.surface;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = T.hairline;
                              e.currentTarget.style.background = T.canvas;
                            }}
                          >
                            <div
                              style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: CATEGORY_COLORS[m.category] || T.stone,
                                flexShrink: 0,
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontSize: 13, fontWeight: 600, color: T.ink,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              }}>
                                {m.title}
                              </div>
                              <div style={{ fontSize: 10, color: T.ash, marginTop: 1 }}>
                                {m.subject}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Search}
                        color={T.stone}
                        title="Belum ada materi"
                        description="Tidak ada materi yang cocok dengan pencarian atau kategori ini."
                        hint="Coba kata kunci lain atau ganti kategori"
                      />
                    )}
                  </div>
                </>
              )}
            </PanelShell>
          )}

          {activePanel === 'kategori' && (
            <PanelShell
              title="Kategori"
              subtitle={`${catMeta.length} kategori belajar`}
              accent={T.stickerOrange}
              onClose={() => setActivePanel(null)}
            >
              {() => (
                <div style={{ overflowY: 'auto', flex: 1, padding: '16px' }}>
                  <div
                    className="panel-kategori-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                      gap: 10,
                    }}
                  >
                    {catMeta.map((cat, i) => {
                      const Ic = [FlaskConical, Landmark, GraduationCap][i] || GraduationCap;
                      const isActive = activeCategory === cat.id;
                      return (
                        <motion.button
                          key={cat.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.04 * i }}
                          onClick={() => {
                            onCategoryChange && onCategoryChange(cat.id);
                            setActivePanel(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-left cursor-pointer transition-all"
                          style={{
                            padding: '16px 14px',
                            borderRadius: 'var(--radius-lg)',
                            border: isActive ? `1.5px solid ${cat.color}` : `1px solid ${T.hairline}`,
                            background: isActive ? hexToRgba(cat.color, 0.05) : T.canvas,
                            fontFamily: 'inherit',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = cat.color;
                            e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = isActive ? cat.color : T.hairline;
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div
                            style={{
                              width: 34, height: 34,
                              borderRadius: 10,
                              background: hexToRgba(cat.color, 0.1),
                              color: cat.color,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              marginBottom: 10,
                            }}
                          >
                            <Ic size={17} />
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 3 }}>{cat.name}</div>
                          <div style={{ fontSize: 11, color: T.stone, lineHeight: 1.45, marginBottom: 8 }}>{cat.description}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            {cat.subjects.slice(0, 2).map((s) => (
                              <span
                                key={s}
                                style={{
                                  fontSize: 9.5, fontWeight: 600,
                                  padding: '2px 7px', borderRadius: 'var(--radius-full)',
                                  background: T.surface, color: T.stone,
                                }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: T.surface,
                      border: `1px solid ${T.hairline}`,
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: 'rgba(0,0,0,0.05)',
                        color: T.stone,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <BookOpen size={14} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>Lihat Semua Materi</div>
                      <div style={{ fontSize: 10, color: T.ash }}>Pilih Semua untuk melihat seluruh koleksi</div>
                    </div>
                    <button
                      onClick={() => { onCategoryChange && onCategoryChange('all'); setActivePanel(null); }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: T.primary,
                        color: T.onDark,
                        border: 'none',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      Semua
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(0,117,222,0.05)',
                      border: '1px solid rgba(0,117,222,0.15)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <GoogleDriveIcon size={18} />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>Folder Drive per Mapel</div>
                          <div style={{ fontSize: 10, color: T.stone }}>Buka materi langsung di Google Drive</div>
                        </div>
                      </div>
                      <a
                        href={GDRIVE_FOLDER_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: 'rgba(0,117,222,0.12)',
                          color: '#0075de',
                          fontSize: 10.5,
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                        title="Buka Folder Google Drive Utama Semua Mapel"
                      >
                        <span>Semua</span>
                        <ExternalLink size={9} />
                      </a>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 6 }}>
                      {SUBJECT_GDRIVE_LIST.map((item) => (
                        <a
                          key={item.subject}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '6px 8px',
                            borderRadius: 6,
                            background: T.canvas,
                            border: `1px solid ${T.hairline}`,
                            color: T.ink,
                            fontSize: 11,
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#0075de';
                            e.currentTarget.style.color = '#0075de';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = T.hairline;
                            e.currentTarget.style.color = T.ink;
                          }}
                          title={`Buka Google Drive ${item.name}`}
                        >
                          <GoogleDriveIcon size={11} />
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.short}
                          </span>
                          <ExternalLink size={8} style={{ opacity: 0.5, flexShrink: 0 }} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </PanelShell>
          )}

          {activePanel === 'riwayat' && (
            <PanelShell
              title="Riwayat Bacaan"
              subtitle="Materi yang terakhir dibaca"
              accent={T.stickerTeal}
              onClose={() => setActivePanel(null)}
            >
              {() => (
                <EmptyState
                  icon={Clock}
                  color={T.stickerTeal}
                  title="Riwayat masih kosong"
                  description="Selesaikan baca satu materi untuk melihat catatan riwayat bacaanmu di sini."
                  hint="Buka materi dari Koleksi atau panel Materi"
                />
              )}
            </PanelShell>
          )}

          {activePanel === 'pengaturan' && (
            <PanelShell
              title="Pengaturan"
              subtitle="Tampilan & tema Smart Reader"
              accent={T.secondaryDeep || '#1a2559'}
              onClose={() => setActivePanel(null)}
            >
              {() => (
                <div style={{ overflowY: 'auto', flex: 1, padding: '16px 18px' }}>
                  <div style={{ marginBottom: 22 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 8, letterSpacing: '0.02em' }}>
                      TEMA TAMPILAN
                    </div>
                    <div
                      className="theme-grid"
                      style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
                      }}
                    >
                      {[
                        { id: 'light', label: 'Terang', Ic: Sun, bg: '#ffffff', fg: '#1a1a1a', border: '#e6e6e6' },
                        { id: 'sepia', label: 'Sepia', Ic: Sun, bg: '#f8f6f1', fg: '#1c1917', border: '#e8e3d8' },
                        { id: 'dark', label: 'Gelap', Ic: Moon, bg: '#16171d', fg: '#f3f4f6', border: '#2e303a' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => onThemeChange && onThemeChange(t.id)}
                          className="cursor-pointer transition-all"
                          style={{
                            padding: '10px',
                            borderRadius: 'var(--radius-md)',
                            border: currentTheme === t.id
                              ? `1.5px solid ${T.primary}`
                              : `1px solid ${T.hairline}`,
                            background: currentTheme === t.id ? hexToRgba(T.primary, 0.04) : 'transparent',
                            fontFamily: 'inherit',
                          }}
                        >
                          <div
                            style={{
                              width: '100%', aspectRatio: '16 / 10',
                              borderRadius: 8,
                              background: t.bg,
                              border: `1px solid ${t.border}`,
                              marginBottom: 8,
                              padding: 8,
                              display: 'flex', flexDirection: 'column', gap: 4,
                            }}
                          >
                            <div style={{ width: '50%', height: 5, borderRadius: 2, background: t.fg, opacity: 0.4 }} />
                            <div style={{ width: '100%', height: 4, borderRadius: 2, background: t.fg, opacity: 0.2 }} />
                            <div style={{ width: '85%', height: 4, borderRadius: 2, background: t.fg, opacity: 0.2 }} />
                          </div>
                          <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                            fontSize: 11, fontWeight: 600,
                            color: currentTheme === t.id ? T.primary : T.inkSecondary,
                          }}>
                            <t.Ic size={12} />
                            {t.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, letterSpacing: '0.02em' }}>
                        UKURAN FONT BACA
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <button
                          onClick={() => setFontSize((s) => Math.max(13, s - 1))}
                          style={{
                            width: 28, height: 28,
                            borderRadius: 8, border: `1px solid ${T.hairline}`,
                            background: T.surface, cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            color: T.stone,
                          }}
                        >
                          <ZoomOut size={13} />
                        </button>
                        <div
                          style={{
                            minWidth: 44, textAlign: 'center',
                            fontSize: 12, fontWeight: 700, color: T.ink,
                            padding: '4px 8px', borderRadius: 6, background: T.surface,
                          }}
                        >
                          {fontSize}px
                        </div>
                        <button
                          onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                          style={{
                            width: 28, height: 28,
                            borderRadius: 8, border: `1px solid ${T.hairline}`,
                            background: T.surface, cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            color: T.stone,
                          }}
                        >
                          <ZoomIn size={13} />
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: T.surface,
                        border: `1px solid ${T.hairline}`,
                        fontSize: 11, color: T.stone,
                        lineHeight: lineHeight || 1.7,
                        fontFamily: fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)',
                        transition: 'font-family 0.2s, line-height 0.2s',
                      }}
                    >
                      <div style={{ display: 'inline-block', marginBottom: 4, fontSize: 10, fontWeight: 700, color: T.ink, letterSpacing: '0.03em' }}>
                        <Type size={10} style={{ verticalAlign: '-2px', marginRight: 4 }} /> PREVIEW ({fontFamily === 'serif' ? 'Serif' : 'Sans'}, {lineHeight}x)
                      </div>
                      <br />
                      Ini adalah contoh paragraf teks bacaan yang akan tampil di Smart Reader. Sesuaikan ukuran agar paling nyaman di mata dan perangkatmu.
                    </div>
                  </div>

                  {/* Pengaturan Lanjutan (Interaktif) */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, letterSpacing: '0.02em' }}>
                        PENGATURAN LANJUTAN
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#16a34a',
                          background: 'rgba(22,163,74,0.08)',
                          border: '1px solid rgba(22,163,74,0.2)',
                          padding: '2px 8px',
                          borderRadius: 99,
                        }}
                      >
                        Aktif
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {/* Font Sans / Serif */}
                      <div
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          background: T.surface,
                          border: `1px solid ${T.hairline}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: T.ink }}>
                            Jenis Font (Sans / Serif)
                          </div>
                          <div style={{ fontSize: 10, color: T.stone }}>
                            {fontFamily === 'serif' ? 'Serif (Lora Editorial)' : 'Sans (Inter Modern)'}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={() => onFontFamilyChange && onFontFamilyChange('sans')}
                            className="cursor-pointer transition-all"
                            style={{
                              padding: '3px 9px',
                              borderRadius: 6,
                              fontSize: 10,
                              fontWeight: 600,
                              background: fontFamily === 'sans' ? 'rgba(0,117,222,0.1)' : 'var(--app-canvas, #ffffff)',
                              border: fontFamily === 'sans' ? '1.5px solid var(--color-primary, #0075de)' : `1px solid ${T.hairline}`,
                              color: fontFamily === 'sans' ? 'var(--color-primary, #0075de)' : T.stone,
                            }}
                          >
                            Sans
                          </button>
                          <button
                            type="button"
                            onClick={() => onFontFamilyChange && onFontFamilyChange('serif')}
                            className="cursor-pointer transition-all"
                            style={{
                              padding: '3px 9px',
                              borderRadius: 6,
                              fontSize: 10,
                              fontWeight: 600,
                              fontFamily: 'serif',
                              background: fontFamily === 'serif' ? 'rgba(0,117,222,0.1)' : 'var(--app-canvas, #ffffff)',
                              border: fontFamily === 'serif' ? '1.5px solid var(--color-primary, #0075de)' : `1px solid ${T.hairline}`,
                              color: fontFamily === 'serif' ? 'var(--color-primary, #0075de)' : T.stone,
                            }}
                          >
                            Serif
                          </button>
                        </div>
                      </div>

                      {/* Spacing Baris */}
                      <div
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          background: T.surface,
                          border: `1px solid ${T.hairline}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: T.ink }}>
                            Spacing Baris
                          </div>
                          <div style={{ fontSize: 10, color: T.stone }}>
                            Jarak vertikal antar baris teks ({lineHeight}x)
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                          {['1.4', '1.7', '2.0'].map((sp) => (
                            <button
                              key={sp}
                              type="button"
                              onClick={() => onLineHeightChange && onLineHeightChange(sp)}
                              className="cursor-pointer transition-all"
                              style={{
                                padding: '3px 8px',
                                borderRadius: 6,
                                fontSize: 10,
                                fontWeight: 600,
                                background: lineHeight === sp ? 'rgba(0,117,222,0.1)' : 'var(--app-canvas, #ffffff)',
                                border: lineHeight === sp ? '1.5px solid var(--color-primary, #0075de)' : `1px solid ${T.hairline}`,
                                color: lineHeight === sp ? 'var(--color-primary, #0075de)' : T.stone,
                              }}
                            >
                              {sp}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mode Fokus */}
                      <div
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          background: T.surface,
                          border: `1px solid ${T.hairline}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: T.ink }}>
                            Mode Fokus (Zen)
                          </div>
                          <div style={{ fontSize: 10, color: T.stone }}>
                            {focusMode ? 'Aktif (bilah disembunyikan saat membaca)' : 'Nonaktif'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onFocusModeChange && onFocusModeChange(!focusMode)}
                          className="cursor-pointer transition-all"
                          style={{
                            width: 36,
                            height: 20,
                            borderRadius: 99,
                            background: focusMode ? 'var(--color-primary, #0075de)' : 'rgba(0,0,0,0.15)',
                            border: `1px solid ${focusMode ? 'var(--color-primary, #0075de)' : T.hairline}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: focusMode ? 'flex-end' : 'flex-start',
                            padding: '0 2px',
                            flexShrink: 0,
                          }}
                          title="Klik untuk aktifkan/nonaktifkan Mode Fokus"
                        >
                          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: hexToRgba(T.primary, 0.04),
                      border: `1px solid ${hexToRgba(T.primary, 0.12)}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Settings size={14} style={{ color: T.primary, flexShrink: 0 }} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>
                        Preferensi Reader Aktif
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: T.stone, lineHeight: 1.6 }}>
                      Font Sans/Serif, spacing baris, & mode fokus aktif dan tersinkronisasi langsung ke Smart Reader.
                    </div>
                  </div>
                </div>
              )}
            </PanelShell>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="dock-wrap"
        style={{
          position: 'fixed',
          bottom: 16,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          padding: '0 12px',
        }}
      >
        <motion.div
          initial="initial"
          animate="animate"
          variants={floatingAnimation}
          data-dock="true"
          className="dock-root"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            padding: '8px 10px',
            borderRadius: 18,
            background: 'var(--dock-bg, rgba(255,255,255,0.92))',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${T.hairline}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
            pointerEvents: 'auto',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            maxWidth: '100%',
          }}
        >
          <DockButton
            icon={Home}
            label="Beranda"
            alwaysWide
            active={activeItem === 'home' && activePanel !== 'materi'}
            onClick={() => { togglePanel(null); onNavigate && onNavigate('home'); }}
          />

          <div className="dock-divider" style={{ width: 1, height: 24, background: T.hairline, margin: '0 4px', flexShrink: 0 }} />

          <DockButton
            icon={BookOpen}
            label="Materi"
            alwaysWide
            active={activePanel === 'materi'}
            onClick={() => togglePanel('materi')}
          />

          <div className="dock-divider" style={{ width: 1, height: 24, background: T.hairline, margin: '0 4px', flexShrink: 0 }} />

          <DockButton
            icon={GraduationCap}
            label="Kategori"
            alwaysWide
            active={activePanel === 'kategori'}
            accent={T.stickerOrange}
            onClick={() => togglePanel('kategori')}
          />

          <div className="dock-divider" style={{ width: 1, height: 24, background: T.hairline, margin: '0 4px', flexShrink: 0 }} />

          <DockButton
            icon={Sparkles}
            label="Tanya AI"
            alwaysWide
            accent="#9333ea"
            onClick={() => {
              togglePanel(null);
              onOpenChat && onOpenChat();
            }}
          />

          <div className="dock-divider dock-divider-second" style={{ width: 1, height: 24, background: T.hairline, margin: '0 4px', flexShrink: 0 }} />

          <DockButton
            icon={Clock}
            label="Riwayat"
            active={activePanel === 'riwayat'}
            accent={T.stickerTeal}
            onClick={() => togglePanel('riwayat')}
          />

          <DockButton
            icon={Settings}
            label="Pengaturan"
            active={activePanel === 'pengaturan'}
            accent={T.secondaryDeep || '#1a2559'}
            onClick={() => togglePanel('pengaturan')}
          />
        </motion.div>
      </motion.div>

      <style>{`
        .dock-root::-webkit-scrollbar { display: none; }

        .panel-shell {
          left: 0 !important;
          right: 0 !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        /* ===== Responsive Dock ===== */
        /* Mobile (sempit): label disembunyikan → icon-only, lebih ramping */
        @media (max-width: 640px) {
          .dock-btn-label { display: none !important; }
          .dock-btn-chevron { display: none !important; }
          .dock-btn.is-wide,
          .dock-btn.always-wide {
            padding: 0 10px !important;
            min-width: 40px !important;
            gap: 0 !important;
          }
          .dock-divider-second { display: none !important; }
          .panel-shell {
            bottom: 78px !important;
            left: 0 !important;
            right: 0 !important;
            margin-left: auto !important;
            margin-right: auto !important;
            width: calc(100% - 24px) !important;
          }
          .panel-materi-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 420px) {
          .dock-wrap { padding: 0 8px !important; bottom: 10px !important; }
          .dock-root {
            padding: 6px 8px !important;
            border-radius: 16px !important;
            gap: 1px !important;
          }
          .dock-btn { height: 36px !important; min-width: 36px !important; padding: 0 8px !important; }
          .dock-btn svg { width: 16px !important; height: 16px !important; }
          .dock-divider { margin: 0 2px !important; height: 20px !important; }
          .dock-divider-second { display: none !important; }
          .panel-shell {
            width: calc(100% - 16px) !important;
            max-height: 78vh !important;
            bottom: 72px !important;
            left: 0 !important;
            right: 0 !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .panel-tabs { gap: 3px !important; }
          .panel-tab-pill { font-size: 11px !important; padding: 4px 10px !important; }
        }

        /* Tablet: tetap label tapi materi grid single column */
        @media (min-width: 641px) and (max-width: 820px) {
          .panel-materi-grid { grid-template-columns: 1fr !important; }
        }

        /* Desktop (lebar): tampilkan label pada wide buttons */
        @media (min-width: 641px) {
          .dock-btn-label { display: inline; }
          .dock-btn.is-wide,
          .dock-btn.always-wide {
            padding: 0 14px !important;
            min-width: auto !important;
            gap: 6px !important;
          }
        }

        @media (max-width: 520px) {
          .theme-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}
