/**
 * DockDemo — demonstrasi komponen Dock navigation
 * Untuk preview/testing. Tidak digunakan di aplikasi utama.
 */
import React from 'react';
import Dock from './Dock';

export default function DockDemo() {
  return (
    <div style={{ minHeight: 400, background: '#f6f5f4', padding: 40 }}>
      <Dock
        activeItem="home"
        onNavigate={(id) => console.log('Navigasi:', id)}
      />
    </div>
  );
}
