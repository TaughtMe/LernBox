import React from 'react';
import { useNavigate } from 'react-router-dom';

const LicensesPage: React.FC = () => {
  const navigate = useNavigate();
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate('/dashboard'));

  return (
    <div className="App">
      {/* Kopf mit Zurück-Button – gleich wie überall */}
      <header className="deck-page-header page-section">
        <h1>Lizenzen & Danksagungen</h1>
        <button
          className="button button--secondary button--icon-only"
          type="button"
          aria-label="Zur Übersicht"
          onClick={goBack}
        >
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 19l-7-7 7-7v4h10v6H10v4z"></path>
          </svg>
        </button>
      </header>

      {/* Inhalt im Card-Look */}
      <section className="card page-section">
        <div className="card-content">
          <p>
            Diese Anwendung verwendet Open-Source-Bibliotheken. Vielen Dank an die
            jeweiligen Projekte und Autor:innen.
          </p>

          <h3>Third-Party Notices (Auszug)</h3>
          <ul>
            <li>React – MIT License</li>
            <li>React Router – MIT License</li>
            <li>Vite – MIT License</li>
            <li>TipTap &amp; StarterKit – MIT License</li>
            <li>workbox – MIT License</li>
            <li>html2canvas – MIT License</li>
            {/* ergänze hier deine Liste/Links wie im Repo gepflegt */}
          </ul>

          <h3>Icons/Schrift</h3>
          <p>
            Eingebettete SVG-Icons (lokal). Keine externen Fonts/CDNs. Falls
            Google-Fonts-SVGs eingebettet wurden, bitte Quellenangaben entsprechend ergänzen.
          </p>

          <h3>Quellcode & Copyright</h3>
          <p>
            © {new Date().getFullYear()} [Name der Schule]. Der App-Code steht (sofern nicht
            anders vermerkt) unter Ihrer Lizenz. Einzelne Bibliotheken stehen unter ihren
            jeweiligen Lizenzen (siehe oben/verlinkte Repos).
          </p>
        </div>
      </section>
    </div>
  );
};

export default LicensesPage;
