import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import Reader from './components/Reader';
import Chatbot from './components/Chatbot';
import { materials } from './data/materials';

export default function App() {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubject, setActiveSubject] = useState('all');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'light';
  });
  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem('reading_font_family') || 'sans';
  });
  const [lineHeight, setLineHeight] = useState(() => {
    return localStorage.getItem('reading_line_height') || '1.7';
  });
  const [focusMode, setFocusMode] = useState(() => {
    return localStorage.getItem('reading_focus_mode') === 'true';
  });

  const allMaterials = materials;

  const handleOpenMaterial = useCallback((material) => {
    setSelectedMaterial(material);
    document.title = `${material.title} | TrifectaStudy`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleCloseMaterial = useCallback(() => {
    setSelectedMaterial(null);
    document.title = 'TrifectaStudy | Smart Document Reader';
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-reading-theme', theme);
    root.classList.remove('dark', 'sepia');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'sepia') {
      root.classList.add('sepia');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      '--reading-font-family',
      fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)'
    );
    root.setAttribute('data-font-family', fontFamily);
    localStorage.setItem('reading_font_family', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--reading-line-height', lineHeight);
    root.setAttribute('data-line-height', lineHeight);
    localStorage.setItem('reading_line_height', lineHeight);
  }, [lineHeight]);

  useEffect(() => {
    const root = document.documentElement;
    if (focusMode) {
      root.classList.add('focus-mode');
    } else {
      root.classList.remove('focus-mode');
    }
    localStorage.setItem('reading_focus_mode', focusMode ? 'true' : 'false');
  }, [focusMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isChatOpen) {
          setIsChatOpen(false);
        } else if (focusMode) {
          setFocusMode(false);
        } else if (selectedMaterial) {
          handleCloseMaterial();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMaterial, isChatOpen, focusMode, handleCloseMaterial]);

  const filteredMaterials = allMaterials.filter(m => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory === 'all' || m.category === activeCategory;
    const matchesSubject = activeSubject === 'all' || m.subject === activeSubject;

    return matchesSearch && matchesCategory && matchesSubject;
  });

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: 'var(--app-bg, #f6f5f4)',
        color: 'var(--app-text, #000000)',
      }}
    >
      <AnimatePresence mode="wait">
        {selectedMaterial ? (
          <motion.div
            key="reader"
            initial={{ opacity: 0, scale: 0.985, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.985, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Reader
              material={selectedMaterial}
              onClose={handleCloseMaterial}
              onOpenChat={() => setIsChatOpen(true)}
              theme={theme}
              onThemeChange={setTheme}
              fontFamily={fontFamily}
              onFontFamilyChange={setFontFamily}
              lineHeight={lineHeight}
              onLineHeightChange={setLineHeight}
              focusMode={focusMode}
              onFocusModeChange={setFocusMode}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.99, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.99, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Dashboard
              materials={filteredMaterials}
              allMaterials={allMaterials}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              activeSubject={activeSubject}
              setActiveSubject={setActiveSubject}
              onOpenMaterial={handleOpenMaterial}
              onOpenChat={() => setIsChatOpen(true)}
              theme={theme}
              onThemeChange={setTheme}
              fontFamily={fontFamily}
              onFontFamilyChange={setFontFamily}
              lineHeight={lineHeight}
              onLineHeightChange={setLineHeight}
              focusMode={focusMode}
              onFocusModeChange={setFocusMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Chatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        materialContext={selectedMaterial}
      />
    </div>
  );
}
