import React from 'react';
import BackHomeButton from '../../components/BackHomeButton/BackHomeButton';

const LicensesPage: React.FC = () => {
  return (
    <div className="App">
      <header className="deck-page-header page-section">
        <BackHomeButton />
      </header>

      <section className="card page-section">
        <div className="card-content">
          <h1>Lizenzen & Danksagungen</h1>

          <p>Diese Anwendung verwendet Open-Source-Bibliotheken. Vielen Dank an alle Projekte.</p>

          <h3>Third-Party Notices (Auszug)</h3>
          <ul>
            <li>React — MIT</li>
            <li>React Router — MIT</li>
            <li>Vite — MIT</li>
            <li>TipTap / StarterKit — MIT</li>
            <li>workbox — MIT</li>
            <li>html2canvas — MIT</li>
            {/* ggf. erweitern */}
          </ul>

          <h3>Icons/Schrift</h3>
          <p>Eingebettete SVG-Icons (lokal). Keine externen Fonts/CDNs.</p>

          <h3>Quellcode & Copyright</h3>
          <p>
            © {new Date().getFullYear()} [Name der Schule]. App-Code unter Ihrer Lizenz; Bibliotheken unter ihren
            jeweiligen Lizenzen.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LicensesPage;
