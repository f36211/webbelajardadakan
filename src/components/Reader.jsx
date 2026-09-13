import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Sun, Moon, BookOpen,
  FileText, Settings2, Code2, ExternalLink, Sparkles,
} from 'lucide-react';
import HTMLViewer from './HTMLViewer';
import GoogleDriveIcon from './GoogleDriveIcon';
import { GDRIVE_FOLDER_URL } from '../data/materials';

export default function Reader({
  material,
  onClose,
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
  const [showSettings, setShowSettings] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const readerRef = useRef(null);

  const isHtml = !!material.html;
  const activeTheme = theme || localStorage.getItem('app_theme') || 'light';

  const handleThemeChange = (newTheme) => {
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (focusMode && onFocusModeChange) {
          onFocusModeChange(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, focusMode, onFocusModeChange]);

  const stickerColors = {
    IPA: { tint: 'rgba(42,157,153,0.06)', text: '#2a9d99' },
    IPS: { tint: 'rgba(0,117,222,0.05)', text: '#0075de' },
    Basic: { tint: 'rgba(221,91,0,0.05)', text: '#dd5b00' },
  };
  const sticker = stickerColors[material.category?.toUpperCase()] || { tint: 'rgba(97,93,89,0.04)', text: '#615d59' };

  return (
    <div
      ref={readerRef}
      className="flex flex-col h-screen"
      style={{ background: 'var(--app-bg, #f6f5f4)', color: 'var(--app-text, #000000)' }}
    >
      <header
        className="reader-header sticky top-0 z-40 border-b transition-all"
        style={{
          background: 'var(--app-header-bg, rgba(255,255,255,0.93))',
          borderColor: 'var(--app-hairline, #e6e6e6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-2.5">
          <div className="flex items-center justify-between gap-3">
          {/* Back + title */}
          <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onClose}
                className="cursor-pointer w-[34px] h-[34px] flex items-center justify-center rounded-md border transition-colors flex-shrink-0 hover:border-[var(--color-cat-ips)] hover:text-[var(--color-cat-ips)]"
                style={{
                  background: 'var(--app-canvas, #ffffff)',
                  borderColor: 'var(--app-hairline, #e6e6e6)',
                  color: 'var(--app-text-secondary, #31302e)',
                }}
              >
                <ArrowLeft style={{ width: 15, height: 15 }} />
              </button>

              <div className="min-w-0">
                <h1
                  className="text-sm font-bold tracking-tight max-w-[280px] sm:max-w-[400px] truncate"
                  style={{ color: 'var(--app-text, #000000)' }}
                >
                  {material.title}
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-px rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: sticker.tint, color: sticker.text }}
                  >
                    {material.category?.toUpperCase()}
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--app-text-muted, #615d59)' }}>{material.subject}</span>
                  {isHtml && (
                    <span
                      className="inline-flex items-center gap-0.5 px-1.5 py-px rounded-full text-[10px] font-semibold"
                      style={{
                        background: 'rgba(0,117,222,0.06)',
                        color: 'var(--color-cat-ips)',
                      }}
                    >
                      <Code2 style={{ width: 9, height: 9 }} />
                      HTML
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={onOpenChat}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border shadow-2xs"
                style={{
                  background: 'rgba(147, 51, 234, 0.09)',
                  borderColor: 'rgba(147, 51, 234, 0.25)',
                  color: '#9333ea',
                }}
                title="Tanya Asisten AI tentang materi ini"
              >
                <Sparkles style={{ width: 13, height: 13 }} />
                <span className="hidden xs:inline">Tanya AI</span>
              </button>

              {(material.sourceUrl || material.gdriveUrl || GDRIVE_FOLDER_URL) && (
                <a
                  href={material.sourceUrl || material.gdriveUrl || GDRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border no-underline transition-colors shadow-2xs"
                  style={{
                    background: 'var(--app-canvas, #ffffff)',
                    borderColor: 'var(--app-hairline, #e6e6e6)',
                    color: 'var(--app-text-secondary, #31302e)',
                  }}
                  title={`Buka Folder Google Drive ${material.subject}`}
                >
                  <GoogleDriveIcon size={14} />
                  <span className="hidden md:inline">Drive {material.subject}</span>
                  <ExternalLink size={11} className="opacity-60" />
                </a>
              )}

              <button
                onClick={() => setShowSource(!showSource)}
                className={[
                  'cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border-none',
                  showSource
                    ? 'text-white'
                    : 'bg-transparent hover:opacity-80',
                ].join(' ')}
                style={showSource ? { background: 'var(--color-cat-ips)' } : { color: 'var(--app-text-muted, #615d59)' }}
              >
                <FileText style={{ width: 13, height: 13 }} />
                <span className="hidden sm:inline">Dokumen</span>
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={[
                  'cursor-pointer w-[34px] h-[34px] flex items-center justify-center rounded-md text-xs font-semibold transition-colors border-none',
                  showSettings
                  ? 'text-white'
                  : 'bg-transparent hover:opacity-80',
                ].join(' ')}
                style={showSettings ? { background: 'var(--color-cat-ips)' } : { color: 'var(--app-text-muted, #615d59)' }}
              >
                <Settings2 style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>

          {/* Settings panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden border-t mt-2.5 pt-3"
                style={{ borderColor: 'var(--app-hairline, #e6e6e6)' }}
              >
                <div className="flex flex-wrap items-center gap-y-3 gap-x-5 pb-1">
                  {/* Theme */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--app-text-ash, #a39e98)' }}>Tema</span>
                    {[
                      { id: 'light', label: 'Terang', Icon: Sun },
                      { id: 'sepia', label: 'Sepia', Icon: BookOpen },
                      { id: 'dark', label: 'Gelap', Icon: Moon },
                    ].map(({ id, label, Icon }) => {
                      const isActive = activeTheme === id;
                      return (
                        <button
                          key={id}
                          onClick={() => handleThemeChange(id)}
                          className="cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                          style={{
                            border: isActive ? '1.5px solid var(--color-primary, #0075de)' : '1px solid var(--app-hairline, #e6e6e6)',
                            background: isActive ? 'rgba(0,117,222,0.1)' : 'var(--app-canvas, #ffffff)',
                            color: isActive ? 'var(--color-primary, #0075de)' : 'var(--app-text-secondary, #31302e)',
                          }}
                        >
                          <Icon style={{ width: 12, height: 12 }} />
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Font Sans / Serif */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--app-text-ash, #a39e98)' }}>Font</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onFontFamilyChange && onFontFamilyChange('sans')}
                        className="cursor-pointer px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
                        style={{
                          border: fontFamily === 'sans' ? '1.5px solid var(--color-primary, #0075de)' : '1px solid var(--app-hairline, #e6e6e6)',
                          background: fontFamily === 'sans' ? 'rgba(0,117,222,0.1)' : 'var(--app-canvas, #ffffff)',
                          color: fontFamily === 'sans' ? 'var(--color-primary, #0075de)' : 'var(--app-text-secondary, #31302e)',
                        }}
                      >
                        Sans
                      </button>
                      <button
                        onClick={() => onFontFamilyChange && onFontFamilyChange('serif')}
                        className="cursor-pointer px-2.5 py-1 rounded-md text-xs font-semibold transition-colors font-serif"
                        style={{
                          border: fontFamily === 'serif' ? '1.5px solid var(--color-primary, #0075de)' : '1px solid var(--app-hairline, #e6e6e6)',
                          background: fontFamily === 'serif' ? 'rgba(0,117,222,0.1)' : 'var(--app-canvas, #ffffff)',
                          color: fontFamily === 'serif' ? 'var(--color-primary, #0075de)' : 'var(--app-text-secondary, #31302e)',
                        }}
                      >
                        Serif
                      </button>
                    </div>
                  </div>

                  {/* Spacing Baris */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--app-text-ash, #a39e98)' }}>Spacing</span>
                    <div className="flex items-center gap-1">
                      {['1.4', '1.7', '2.0'].map((sp) => (
                        <button
                          key={sp}
                          onClick={() => onLineHeightChange && onLineHeightChange(sp)}
                          className="cursor-pointer px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
                          style={{
                            border: lineHeight === sp ? '1.5px solid var(--color-primary, #0075de)' : '1px solid var(--app-hairline, #e6e6e6)',
                            background: lineHeight === sp ? 'rgba(0,117,222,0.1)' : 'var(--app-canvas, #ffffff)',
                            color: lineHeight === sp ? 'var(--color-primary, #0075de)' : 'var(--app-text-secondary, #31302e)',
                          }}
                        >
                          {sp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mode Fokus (Zen) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onFocusModeChange && onFocusModeChange(!focusMode)}
                      className="cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                      style={{
                        border: focusMode ? '1.5px solid var(--color-primary, #0075de)' : '1px solid var(--app-hairline, #e6e6e6)',
                        background: focusMode ? 'rgba(0,117,222,0.1)' : 'var(--app-canvas, #ffffff)',
                        color: focusMode ? 'var(--color-primary, #0075de)' : 'var(--app-text-secondary, #31302e)',
                      }}
                    >
                      <Sparkles style={{ width: 12, height: 12 }} />
                      Mode Fokus (Zen)
                    </button>
                  </div>

                  {/* Source URL display */}
                  {material.sourceUrl && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--app-text-ash, #a39e98)' }}>Sumber</span>
                      <a
                        href={material.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-[var(--color-cat-ips)] underline decoration-[rgba(0,117,222,0.4)] max-w-[280px] truncate inline-block"
                      >
                        {material.sourceUrl}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Focus mode banner when active */}
      {focusMode && (
        <div
          className="flex items-center justify-between px-4 py-1.5 border-b text-xs transition-all z-30"
          style={{
            background: 'var(--color-primary-tint, rgba(0,117,222,0.08))',
            borderColor: 'var(--app-hairline, #e6e6e6)',
            color: 'var(--color-primary, #0075de)',
          }}
        >
          <div className="flex items-center gap-2 mx-auto font-medium">
            <Sparkles size={13} />
            <span>Mode Fokus Zen Aktif</span>
            <span className="opacity-70 text-[11px] hidden sm:inline">(Tekan Esc atau klik tombol di kanan untuk keluar)</span>
          </div>
          <button
            onClick={() => onFocusModeChange && onFocusModeChange(false)}
            className="cursor-pointer text-[11px] font-bold px-2.5 py-0.5 rounded border border-current transition-opacity hover:opacity-80"
          >
            Keluar Zen
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-h-0 flex flex-col">
        {isHtml ? (
          <HTMLViewer
            htmlUrl={material.html}
            sourceUrl={material.sourceUrl}
            theme={activeTheme}
            fontFamily={fontFamily}
            lineHeight={lineHeight}
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center min-h-[300px] gap-3 p-10 rounded-lg border mx-auto my-6 max-w-xl w-[1200px]"
            style={{
              background: 'var(--app-canvas, #ffffff)',
              borderColor: 'var(--app-hairline, #e6e6e6)',
              color: 'var(--app-text, #000000)',
            }}
          >
            <FileText style={{ width: 32, height: 32, color: 'var(--app-text-ash, #a39e98)' }} />
            <p className="text-sm text-center" style={{ color: 'var(--app-text-muted, #615d59)' }}>
              File dokumen tidak ditemukan untuk materi ini.
            </p>
            <button
              onClick={onClose}
              className="cursor-pointer px-4 py-2 rounded-md text-[13px] font-semibold text-white border-none shadow-2xs"
              style={{ background: 'var(--color-cat-ips, #0075de)' }}
            >
              Kembali ke Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
