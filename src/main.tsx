// src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; // HINZUFÜGEN
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* HINZUFÜGEN */}
      <App />
    </BrowserRouter> {/* HINZUFÜGEN */}
  </React.StrictMode>,
)