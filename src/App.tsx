// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom'; // HINZUFÜGEN
import { HomePage } from './pages/HomePage';
import { StackDetailPage } from './pages/StackDetailPage'; // HINZUFÜGEN
import { LernmodusPage } from './pages/LernmodusPage';
import './App.css';

function App() {
  return (
    // Definiert den Bereich, in dem die Routen ausgetauscht werden
    <Routes> 
      {/* Route 1: Die Startseite */}
      <Route path="/" element={<HomePage />} />
      
      {/* Route 2: Die Detailseite für einen Stapel. 
          :stackId ist ein dynamischer Parameter. */}
      <Route path="/stack/:stackId" element={<StackDetailPage />} />
      <Route path="/learn/:stackId/:level" element={<LernmodusPage />} />
    </Routes>
  );
}

export default App;