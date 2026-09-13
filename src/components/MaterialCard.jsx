import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, FileText, ExternalLink } from 'lucide-react';
import GoogleDriveIcon from './GoogleDriveIcon';
import { GDRIVE_FOLDER_URL } from '../data/materials';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function MaterialCard({ material, index, onClick }) {
  const cardRef = useRef(null);

  // Sticker palette — used as decorative accents
  const stickerColors = {
    IPA: { top: '#2a9d99', dot: '#2a9d99', tint: 'rgba(42,157,153,0.08)' },
    IPS: { top: '#0075de', dot: '#62aef0', tint: 'rgba(0,117,222,0.08)' },
    Basic: { top: '#dd5b00', dot: '#dd5b00', tint: 'rgba(221,91,0,0.08)' },
  };

  const sticker = stickerColors[material.category] || { top: '#615d59', dot: '#615d59', tint: 'rgba(97,93,89,0.06)' };
  const gdriveLink = material.gdriveUrl || material.sourceUrl || GDRIVE_FOLDER_URL;

  return (
    <motion.article
      ref={cardRef}
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -4, scale: 1.008 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className="group double-bezel-outer cursor-pointer select-none"
      onClick={onClick}
    >
      <div className="double-bezel-inner flex flex-col h-full">
        {/* Top color bar */}
        <div style={{ height: 3, background: sticker.top }} />

        <div style={{ padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Category + subject + GDrive Pill */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
                style={{
                  background: sticker.tint,
                  color: sticker.top,
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.04em',
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: sticker.dot, display: 'inline-block' }} />
                {material.category}
              </span>
              <span style={{ color: 'var(--app-text-ash, #a39e98)', fontSize: 11 }}>·</span>
              <span style={{ fontSize: 11, color: 'var(--app-text-muted, #615d59)', fontWeight: 600 }}>
                {material.subject}
              </span>
            </div>

            <motion.a
              href={gdriveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md border transition-all cursor-pointer flex-shrink-0"
              style={{
                borderColor: 'var(--app-hairline, #e6e6e6)',
                background: 'var(--app-surface, #fbfbfb)',
                color: 'var(--app-text-muted, #615d59)',
              }}
              title={`Buka Google Drive ${material.subject}`}
            >
              <GoogleDriveIcon size={11} />
              <span>Drive</span>
              <ExternalLink size={9} style={{ opacity: 0.6 }} />
            </motion.a>
          </div>

          {/* Title */}
          <h3
            className="group-hover:text-[#0075de] transition-colors duration-200"
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--app-text, #000000)',
              letterSpacing: '-0.015em',
              lineHeight: 1.35,
              marginBottom: 8,
            }}
          >
            {material.title}
          </h3>

          {/* Excerpt */}
          <p
            style={{
              fontSize: 13,
              color: 'var(--app-text-secondary, #31302e)',
              lineHeight: 1.55,
              marginBottom: 14,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {material.excerpt}
          </p>

          {/* Source file */}
          <div className="flex items-center gap-1.5 mb-3" style={{ color: 'var(--app-text-ash, #a39e98)', minWidth: 0 }}>
            <FileText style={{ width: 11, height: 11, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.02em', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {material.source}
            </span>
          </div>

          {/* CTA Bar with Button-in-Button Trailing Icon & Subject GDrive Button */}
          <div
            className="flex items-center justify-between pt-3 border-t mt-auto"
            style={{ borderColor: 'var(--app-hairline, #f0f0f0)' }}
          >
            <div className="flex items-center gap-2" style={{ fontSize: 13, fontWeight: 700, color: '#0075de' }}>
              <span>Baca Materi</span>
              <span className="btn-nested-icon w-6 h-6 rounded-full bg-blue-50 text-[#0075de] flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5 shadow-2xs">
                <ArrowRight size={12} strokeWidth={2.4} />
              </span>
            </div>

            <motion.a
              href={gdriveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-all cursor-pointer"
              style={{
                borderColor: 'var(--app-hairline, #e6e6e6)',
                background: 'var(--app-surface, #fbfbfb)',
                color: 'var(--app-text-secondary, #31302e)',
              }}
              title={`Buka Folder Google Drive ${material.subject}`}
            >
              <GoogleDriveIcon size={12} />
              <span>Folder {material.subject}</span>
              <ExternalLink size={10} style={{ opacity: 0.6 }} />
            </motion.a>
          </div>
        </div>

        {/* Decorative sticker dot */}
        <div
          className="absolute top-3 right-3 w-2 h-2 rounded-full opacity-40"
          style={{ background: sticker.dot }}
        />
      </div>
    </motion.article>
  );
}
