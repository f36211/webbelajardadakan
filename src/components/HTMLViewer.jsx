import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ChevronFirst, ChevronLast, ZoomIn, ZoomOut,
  Loader2, AlertCircle, ExternalLink,
} from 'lucide-react';

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const NUM_PAGES_ESTIMATE = 3;
const PADDING_X = 48;

const MIN_USER_ZOOM = 0.5;
const MAX_USER_ZOOM = 2.0;
const ZOOM_STEP = 0.15;
const DEFAULT_USER_ZOOM = 1.0;

export default function HTMLViewer({ htmlUrl, sourceUrl }) {
  const [userZoom, setUserZoom] = useState(DEFAULT_USER_ZOOM);
  const [fitScale, setFitScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  const scrollRef = useRef(null);
  const measureRef = useRef(null);
  const loadTimeoutRef = useRef(null);

  const scale = fitScale * userZoom;

  useEffect(() => {
    loadTimeoutRef.current = setTimeout(() => {
      setLoading(false);
    }, 12000);
    return () => clearTimeout(loadTimeoutRef.current);
  }, [htmlUrl]);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const updateFitScale = () => {
      const available = el.clientWidth;
      if (!available) return;
      const next = Math.max(0.3, Math.min(1.0, (available - PADDING_X) / PAGE_WIDTH));
      setFitScale((prev) => (Math.abs(prev - next) > 0.01 ? next : prev));
    };
    updateFitScale();
    const ro = new ResizeObserver(updateFitScale);
    ro.observe(el);
    window.addEventListener('orientationchange', updateFitScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', updateFitScale);
    };
  }, []);

  const zoomIn = useCallback(
    () => setUserZoom((z) => Math.min(MAX_USER_ZOOM, parseFloat((z + ZOOM_STEP).toFixed(2)))),
    []
  );
  const zoomOut = useCallback(
    () => setUserZoom((z) => Math.max(MIN_USER_ZOOM, parseFloat((z - ZOOM_STEP).toFixed(2)))),
    []
  );
  const zoomReset = useCallback(() => setUserZoom(DEFAULT_USER_ZOOM), []);

  const scrollToTop = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (document.activeElement?.tagName === 'INPUT') return;
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomIn(); }
    else if (e.key === '-') { e.preventDefault(); zoomOut(); }
    else if (e.key === '0') { e.preventDefault(); zoomReset(); }
    else if (e.key === 'Home') { e.preventDefault(); scrollToTop(); }
    else if (e.key === 'End') { e.preventDefault(); scrollToBottom(); }
  }, [zoomIn, zoomOut, zoomReset, scrollToTop, scrollToBottom]);

  const handleIframeLoad = useCallback(() => {
    setLoading(false);
    setError(null);
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
  }, []);

  const handleIframeError = useCallback(() => {
    setError('Gagal memuat dokumen HTML.');
    setLoading(false);
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
  }, []);

  const zoomPercent = Math.round(userZoom * 100);

  const iframePxHeight = Math.min(PAGE_HEIGHT * NUM_PAGES_ESTIMATE + 40, 4000);
  const layoutWidth = PAGE_WIDTH * scale;
  const layoutHeight = iframePxHeight * scale;

  return (
    <div
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      className="flex flex-col h-full outline-none bg-stone-100"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-white border-b border-stone-200 flex-wrap flex-shrink-0">
        {/* Scroll nav */}
        <div className="flex items-center gap-1">
          <ToolbarBtn onClick={scrollToTop} title="Ke atas (Home)">
            <ChevronFirst style={{ width: 15, height: 15 }} />
          </ToolbarBtn>
          <span className="text-xs font-medium text-stone-400 tabular-nums px-1.5">
            Scroll
          </span>
          <ToolbarBtn onClick={scrollToBottom} title="Ke bawah (End)">
            <ChevronLast style={{ width: 15, height: 15 }} />
          </ToolbarBtn>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <ToolbarBtn onClick={zoomOut} disabled={userZoom <= MIN_USER_ZOOM} title="Perkecil (-)">
            <ZoomOut style={{ width: 14, height: 14 }} />
          </ToolbarBtn>

          <button
            onClick={zoomReset}
            className="min-w-[52px] px-2 py-1 rounded-md border border-stone-200 bg-stone-50 text-[11px] font-bold tabular-nums text-stone-900 cursor-pointer text-center hover:bg-white transition-colors"
            title="Reset zoom (0)"
          >
            {zoomPercent}%
          </button>

          <ToolbarBtn onClick={zoomIn} disabled={userZoom >= MAX_USER_ZOOM} title="Perbesar (+)">
            <ZoomIn style={{ width: 14, height: 14 }} />
          </ToolbarBtn>
        </div>

        {/* Source / Open in tab */}
        <div className="flex items-center gap-2">
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-stone-200 bg-stone-50 text-stone-500 no-underline transition-colors hover:border-[var(--color-cat-ips)] hover:text-[var(--color-cat-ips)]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span className="hidden sm:inline">Sumber</span>
            </a>
          )}
          <a
            href={htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-stone-200 bg-stone-50 text-stone-500 no-underline transition-colors hover:border-[var(--color-cat-ips)] hover:text-[var(--color-cat-ips)]"
            title="Buka di tab baru"
          >
            <ExternalLink style={{ width: 12, height: 12 }} />
            <span className="hidden sm:inline">Tab Baru</span>
          </a>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto overflow-x-hidden bg-[#3a3d40]"
        style={{ scrollbarGutter: 'stable', WebkitOverflowScrolling: 'touch' }}
      >
        <div
          ref={measureRef}
          className="flex flex-col items-center bg-stone-100 w-full"
          style={{ minHeight: loading ? '600px' : undefined }}
        >
          {loading && !error && (
            <div className="flex items-center justify-center gap-2.5 py-24">
              <Loader2 className="w-5 h-5 text-[var(--color-cat-ips)] animate-spin" />
              <span className="text-sm text-stone-500">Memuat dokumen…</span>
            </div>
          )}

          {error ? (
            <div className="flex flex-col items-center justify-center gap-3 min-h-[400px] px-6 py-16 text-center">
              <AlertCircle style={{ width: 32, height: 32, color: '#ef4444' }} />
              <p className="text-sm text-stone-400">{error}</p>
              <a
                href={htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-[13px] font-semibold no-underline text-white"
                style={{ background: 'var(--color-cat-ips, #0075de)' }}
              >
                Buka di tab baru
              </a>
            </div>
          ) : (
            <div
              className="w-full flex justify-center py-4 sm:py-6 overflow-hidden"
              style={{ paddingBottom: 60 }}
            >
              <div
                style={{
                  width: layoutWidth,
                  height: layoutHeight,
                  position: 'relative',
                  flexShrink: 0,
                  filter: loading ? 'blur(2px) opacity(0.5)' : 'none',
                  transition: 'width 0.2s ease, height 0.2s ease, filter 0.25s ease',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: PAGE_WIDTH,
                    height: iframePxHeight,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                  }}
                >
                  <iframe
                    ref={iframeRef}
                    src={htmlUrl}
                    title="Materi HTML"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    className="border-none"
                    style={{
                      width: PAGE_WIDTH,
                      height: iframePxHeight,
                      background: '#fff',
                      boxShadow: '0 4px 28px rgba(0,0,0,0.22)',
                      borderRadius: 4,
                      display: 'block',
                    }}
                  />
                </div>
              </div>
            </div>
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
      className={[
        'w-[30px] h-[30px]',
        'flex items-center justify-center',
        'rounded-md border border-stone-200',
        'transition-colors flex-shrink-0',
        disabled
          ? 'bg-transparent text-stone-200 cursor-not-allowed border-stone-200'
          : 'bg-white text-stone-500 cursor-pointer hover:border-[var(--color-cat-ips)] hover:text-[var(--color-cat-ips)]',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
