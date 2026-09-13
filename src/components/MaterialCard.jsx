import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, FileText } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function MaterialCard({ material, index, onClick }) {
  const cardRef = useRef(null);

  // Sticker palette — used as decorative accents
  const stickerColors = {
    IPA: { top: '#2a9d99', dot: '#2a9d99', tint: 'rgba(42,157,153,0.05)' },
    IPS: { top: '#0075de', dot: '#62aef0', tint: 'rgba(0,117,222,0.04)' },
    Basic: { top: '#dd5b00', dot: '#dd5b00', tint: 'rgba(221,91,0,0.04)' },
  };

  const sticker = stickerColors[material.category] || { top: '#615d59', dot: '#615d59', tint: 'rgba(97,93,89,0.04)' };

  return (
    <motion.article
      ref={cardRef}
      variants={cardVariants}
      className="group relative cursor-pointer"
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #e6e6e6',
        overflow: 'hidden',
        transition: 'border-color 0.15s, box-shadow 0.2s, transform 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,117,222,0.25)';
        e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e6e6e6';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      onClick={onClick}
    >
      {/* Top color bar */}
      <div style={{ height: 3, background: sticker.top }} />

      <div style={{ padding: '20px 20px 16px' }}>
        {/* Category + subject */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
            style={{
              background: sticker.tint,
              color: sticker.top,
              borderRadius: 'var(--radius-full)',
              letterSpacing: '0.03em',
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: sticker.dot, display: 'inline-block' }} />
            {material.category}
          </span>
          <span style={{ color: '#a39e98', fontSize: 11 }}>·</span>
          <span style={{ fontSize: 11, color: '#615d59', fontWeight: 500 }}>
            {material.subject}
          </span>
        </div>

        {/* Title */}
        <h3
          className="group-hover:text-[#0075de] transition-colors duration-150"
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#000000',
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
            color: '#31302e',
            lineHeight: 1.55,
            marginBottom: 12,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {material.excerpt}
        </p>

        {/* Source file */}
        <div className="flex items-center gap-1.5 mb-3" style={{ color: '#a39e98', minWidth: 0 }}>
          <FileText style={{ width: 11, height: 11, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.02em', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {material.source}
          </span>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5" style={{ fontSize: 13, fontWeight: 600, color: '#0075de' }}>
            <BookOpen style={{ width: 14, height: 14 }} />
            <span>Baca Materi</span>
          </div>
          <motion.div
            initial={{ x: 0, opacity: 0.5 }}
            whileHover={{ x: 3 }}
            className="flex items-center gap-1"
            style={{ fontSize: 12, color: '#615d59' }}
          >
            <span className="hidden group-hover:inline" style={{ fontSize: 12 }}>Buka</span>
            <ArrowRight style={{ width: 13, height: 13 }} />
          </motion.div>
        </div>
      </div>

      {/* Decorative sticker dot */}
      <div
        className="absolute top-3 right-3 w-2 h-2 rounded-full opacity-40"
        style={{ background: sticker.dot }}
      />
    </motion.article>
  );
}
