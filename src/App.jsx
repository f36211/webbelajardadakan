import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import Reader from './components/Reader';
import { materials } from './data/materials';

export default function App() {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubject, setActiveSubject] = useState('all');

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
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedMaterial) {
        handleCloseMaterial();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMaterial, handleCloseMaterial]);

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
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Reader
              material={selectedMaterial}
              onClose={handleCloseMaterial}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
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
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
