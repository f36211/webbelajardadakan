import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  ChevronFirst, ChevronLast, ZoomIn, ZoomOut,
  Loader2, AlertCircle,
} from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const T = {
  primary: '#0075de',
  primaryActive: '#005bab',
  ink: '#000000',
  stone: '#615d59',
  ash: '#a39e98',
  hairline: '#e6e6e6',
  surface: '#f6f5f4',
  canvas: '#ffffff',
  onDark: '#ffffff',
};

const MIN_SCALE = 0.35;
const MAX_SCALE = 1.5;
const SCALE_STEP = 0.2;

export default function PDFViewer({ pdfUrl, sourceUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(0.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const pageRefs = useRef({});
  const pageInputRef = useRef(null);
  const containerRef = useRef(null);
  const [pageWidth, setPageWidth] = useState(0);

  // Measure actual rendered page width
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        if (w > 0) setPageWidth(w);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages: n }) => {
    setNumPages(n);
    setLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((err) => {
    console.error('PDF load error:', err);
    setError('Gagal memuat file PDF.');
    setLoading(false);
  }, []);

  const scrollToPage = useCallback((pageNum) => {
    const ref = pageRefs.current[pageNum];
    if (ref) ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const zoomIn = useCallback(() => setScale((s) => Math.min(MAX_SCALE, parseFloat((s + SCALE_STEP).toFixed(2)))), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(MIN_SCALE, parseFloat((s - SCALE_STEP).toFixed(2)))), []);
  const zoomReset = useCallback(() => setScale(0.5), []);

  const goToPage = useCallback((val) => {
    const n = parseInt(val, 10);
    if (!isNaN(n) && n >= 1 && n <= numPages) scrollToPage(n);
  }, [numPages, scrollToPage]);

  // Track active page on scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !numPages) return;
    const scrollTop = scrollRef.current.scrollTop;
    let closest = 1;
    let closestDist = Infinity;
    for (let i = 1; i <= numPages; i++) {
      const ref = pageRefs.current[i];
      if (!ref) continue;
      const dist = Math.abs(ref.offsetTop - scrollTop);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    }
    if (pageInputRef.current && document.activeElement?.tagName !== 'INPUT') {
      pageInputRef.current.value = closest;
    }
  }, [numPages]);

  const handleKeyDown = useCallback((e) => {
    if (document.activeElement?.tagName === 'INPUT') return;
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomIn(); }
    else if (e.key === '-') { e.preventDefault(); zoomOut(); }
    else if (e.key === '0') { e.preventDefault(); zoomReset(); }
  }, [zoomIn, zoomOut, zoomReset]);

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: T.surface,
        outline: 'none',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '8px 16px',
          background: T.canvas,
          borderBottom: `1px solid ${T.hairline}`,
          flexShrink: 0,
          flexWrap: 'wrap',
        }}
      >
        {/* Page nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ToolbarBtn onClick={() => scrollToPage(1)} disabled={!numPages} title="Halaman pertama">
            <ChevronFirst style={{ width: 15, height: 15 }} />
          </ToolbarBtn>

          <input
            ref={pageInputRef}
            type="number"
            min={1}
            max={numPages || 1}
            defaultValue={1}
            onChange={(e) => goToPage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') pageInputRef.current?.blur(); }}
            onFocus={(e) => e.target.select()}
            style={{
              width: 52,
              textAlign: 'center',
              padding: '4px 6px',
              borderRadius: 6,
              border: `1px solid ${T.hairline}`,
              background: T.surface,
              fontSize: 12,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              color: T.ink,
              outline: 'none',
            }}
          />
          <span style={{ fontSize: 12, color: T.ash, fontWeight: 500 }}>
            / {numPages || '—'}
          </span>

          <ToolbarBtn onClick={() => scrollToPage(numPages)} disabled={!numPages} title="Halaman terakhir">
            <ChevronLast style={{ width: 15, height: 15 }} />
          </ToolbarBtn>
        </div>

        {/* Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ToolbarBtn onClick={zoomOut} disabled={scale <= MIN_SCALE} title="Perkecil (-)">
            <ZoomOut style={{ width: 14, height: 14 }} />
          </ToolbarBtn>

          <button
            onClick={zoomReset}
            style={{
              minWidth: 52,
              padding: '4px 8px',
              borderRadius: 6,
              border: `1px solid ${T.hairline}`,
              background: T.surface,
              fontSize: 11,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              color: T.ink,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = T.canvas; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = T.surface; }}
          >
            {Math.round(scale * 100)}%
          </button>

          <ToolbarBtn onClick={zoomIn} disabled={scale >= MAX_SCALE} title="Perbesar (+)">
            <ZoomIn style={{ width: 14, height: 14 }} />
          </ToolbarBtn>
        </div>

        {/* Source */}
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 10px',
              borderRadius: 6,
              fontSize: 11, fontWeight: 600,
              border: `1px solid ${T.hairline}`,
              background: T.surface,
              color: T.stone,
              textDecoration: 'none',
              transition: 'border-color 0.1s, color 0.1s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.hairline; e.currentTarget.style.color = T.stone; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Sumber
          </a>
        )}
      </div>

      {/* Scrollable pages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          background: '#525659',
        }}
      >
        {/* Inner wrap — centered, full width of PDF pages */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: T.surface,
            padding: '0 0 40px',
          }}
        >
          {error ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 12, minHeight: 400, padding: '60px 24px',
            }}>
              <AlertCircle style={{ width: 32, height: 32, color: '#ef4444' }} />
              <p style={{ fontSize: 14, color: T.ash, textAlign: 'center' }}>{error}</p>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
                style={{ padding: '7px 16px', borderRadius: 8, background: T.primary, color: T.onDark, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                Buka di tab baru
              </a>
            </div>
          ) : (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 500, gap: 10 }}>
                  <Loader2 style={{ width: 20, height: 20, color: T.primary, animation: 'spin 1s linear infinite' }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  <span style={{ fontSize: 13, color: T.ash }}>Memuat PDF…</span>
                </div>
              }
              error={
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 40 }}>
                  <AlertCircle style={{ width: 28, height: 28, color: '#ef4444' }} />
                  <p style={{ fontSize: 13, color: T.ash }}>Gagal memuat dokumen.</p>
                </div>
              }
            >
              {Array.from({ length: numPages || 0 }, (_, i) => i + 1).map((pageNum) => (
                <div
                  key={pageNum}
                  ref={(el) => { pageRefs.current[pageNum] = el; }}
                  style={{
                    position: 'relative',
                    background: T.canvas,
                    width: pageWidth > 0 ? pageWidth : '100%',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                    borderRadius: 0,
                    overflow: 'hidden',
                  }}
                >
                  <Page
                    pageNumber={pageNum}
                    width={pageWidth > 0 ? pageWidth : undefined}
                    scale={scale}
                    loading={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 600, gap: 8 }}>
                        <Loader2 style={{ width: 16, height: 16, color: T.primary, animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontSize: 12, color: T.ash }}>Halaman {pageNum}…</span>
                      </div>
                    }
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                  {/* Page badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 14,
                    fontSize: 10,
                    fontWeight: 700,
                    color: T.ash,
                    fontVariantNumeric: 'tabular-nums',
                    background: 'rgba(255,255,255,0.9)',
                    padding: '2px 8px',
                    borderRadius: 4,
                    border: `1px solid ${T.hairline}`,
                    pointerEvents: 'none',
                  }}>
                    {pageNum} / {numPages}
                  </div>
                </div>
              ))}
            </Document>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolbarBtn({ children, onClick, disabled, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        border: `1px solid ${T.hairline}`,
        background: disabled ? 'transparent' : T.canvas,
        color: disabled ? T.hairline : T.stone,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'border-color 0.1s, color 0.1s',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = T.primary;
          e.currentTarget.style.color = T.primary;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.hairline;
        e.currentTarget.style.color = disabled ? T.hairline : T.stone;
      }}
    >
      {children}
    </button>
  );
}
