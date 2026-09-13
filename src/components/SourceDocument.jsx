import React from 'react';
import { FileText, Hash, ExternalLink } from 'lucide-react';
import GoogleDriveIcon from './GoogleDriveIcon';
import { GDRIVE_FOLDER_URL } from '../data/materials';

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
};

export default function SourceDocument({ material }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        {/* Left: icon + info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${T.hairline}`,
              flexShrink: 0,
            }}
          >
            <FileText style={{ width: 20, height: 20, color: T.primary }} />
          </div>

          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em', marginBottom: 1 }}>
              Dokumen Sumber
            </h3>
            <p style={{ fontSize: 11, color: T.ash, lineHeight: 1.4 }}>
              File asli yang digunakan sebagai referensi untuk materi ini
            </p>
          </div>
        </div>

        {/* ID pill */}
        <div style={{ display: 'flex', gap: 4 }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: T.canvas,
              border: `1px solid ${T.hairline}`,
              fontSize: 11, color: T.stone,
              fontFamily: 'var(--font-mono)',
            }}
          >
            <Hash style={{ width: 11, height: 11, color: T.ash }} />
            <span>{material.id}</span>
          </div>
        </div>
      </div>

      {/* Details row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginTop: 14 }}>
        {[
          { label: 'Kategori', value: material.category?.toUpperCase() },
          { label: 'Mapel', value: material.subject },
          { label: 'Format', value: 'PDF' },
          { label: 'Sumber', value: material.source },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              padding: '10px 14px',
              background: T.canvas,
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${T.hairline}`,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: T.ash, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
              {label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <a
          href={material.sourceUrl || material.gdriveUrl || GDRIVE_FOLDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#0075de] text-white no-underline transition-all hover:bg-[#005bab] shadow-xs"
        >
          <GoogleDriveIcon size={15} />
          <span>Buka Folder Google Drive {material.subject}</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
