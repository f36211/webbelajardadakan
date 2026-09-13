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
    const savedTheme = localStorage.getItem('app_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-reading-theme', savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isChatOpen) {
          setIsChatOpen(false);
        } else if (selectedMaterial) {
          handleCloseMaterial();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMaterial, isChatOpen, handleCloseMaterial]);

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
    <div className="min-h-screen transition-colors duration-300">
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
