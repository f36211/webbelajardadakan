import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Sun, Moon, BookOpen,
  FileText, Settings2, Code2,
} from 'lucide-react';
import HTMLViewer from './HTMLViewer';

export default function Reader({ material, onClose }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const readerRef = useRef(null);

  const isHtml = !!material.html;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const stickerColors = {
    IPA: { tint: 'rgba(42,157,153,0.06)', text: '#2a9d99' },
    IPS: { tint: 'rgba(0,117,222,0.05)', text: '#0075de' },
    Basic: { tint: 'rgba(221,91,0,0.05)', text: '#dd5b00' },
  };
  const sticker = stickerColors[material.category?.toUpperCase()] || { tint: 'rgba(97,93,89,0.04)', text: '#615d59' };

  return (
    <div
      ref={readerRef}
      className="flex flex-col h-screen bg-stone-100"
    >
      <header
        className="sticky top-0 z-40 border-b border-stone-200"
        style={{
          background: 'rgba(255,255,255,0.93)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-2.5">
          <div className="flex items-center justify-between gap-4">
          {/* Back + title */}
          <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onClose}
                className="cursor-pointer w-[34px] h-[34px] flex items-center justify-center rounded-md border border-stone-200 bg-white text-stone-500 transition-colors flex-shrink-0 hover:border-[var(--color-cat-ips)] hover:text-[var(--color-cat-ips)]"
              >
                <ArrowLeft style={{ width: 15, height: 15 }} />
              </button>

              <div className="min-w-0">
                <h1 className="text-sm font-bold text-stone-900 tracking-tight max-w-[300px] truncate">
                  {material.title}
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-px rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: sticker.tint, color: sticker.text }}
                  >
                    {material.category?.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-stone-400">{material.subject}</span>
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
            <div className="flex items-center gap-1 flex-shrink-0">
              {material.sourceUrl && (
                <a
                  href={material.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-stone-200 bg-white text-stone-500 no-underline transition-colors hover:border-[var(--color-cat-ips)] hover:text-[var(--color-cat-ips)]"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <span className="hidden sm:inline">Sumber</span>
                </a>
              )}

              <button
                onClick={() => setShowSource(!showSource)}
                className={[
                  'cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border-none',
                  showSource
                    ? 'text-white'
                    : 'bg-transparent text-stone-500 hover:bg-stone-100',
                ].join(' ')}
                style={showSource ? { background: 'var(--color-cat-ips)' } : undefined}
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
                  : 'bg-transparent text-stone-500 hover:bg-stone-100',
                ].join(' ')}
                style={showSettings ? { background: 'var(--color-cat-ips)' } : undefined}
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
                className="overflow-hidden border-t border-stone-200 mt-2.5 pt-3"
              >
                <div className="flex flex-wrap items-center gap-5 pb-1">
                  {/* Theme */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Tema</span>
                    {[
                      { id: 'light', label: 'Terang', Icon: Sun },
                      { id: 'dark', label: 'Gelap', Icon: Moon },
                      { id: 'sepia', label: 'Sepia', Icon: BookOpen },
                    ].map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        onClick={() => document.documentElement.setAttribute('data-reading-theme', id === 'light' ? '' : id)}
                        className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-stone-200 bg-white text-stone-500 transition-colors hover:border-[var(--color-cat-ips)] hover:text-[var(--color-cat-ips)]"
                      >
                        <Icon style={{ width: 12, height: 12 }} />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Source URL display */}
                  {material.sourceUrl && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Sumber</span>
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

      {/* Main content */}
      <div className="flex-1 min-h-0 flex flex-col">
        {isHtml ? (
          <HTMLViewer
            htmlUrl={material.html}
            sourceUrl={material.sourceUrl}
          />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 p-10 bg-white rounded-lg border border-stone-200 mx-auto my-6 max-w-xl w-[1200px]">
            <FileText style={{ width: 32, height: 32, color: '#a39e98' }} />
            <p className="text-sm text-stone-500 text-center">
              File dokumen tidak ditemukan untuk materi ini.
            </p>
            <button
              onClick={onClose}
              className="cursor-pointer px-4 py-2 rounded-md text-[13px] font-semibold text-white border-none"
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
