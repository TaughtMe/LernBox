import { Link } from 'react-router-dom';

export default function LicensesPage() {
  return (
    <div className="page-section">
      <header className="page-header">
        <h1>Lizenzen & Danksagungen</h1>

        <Link
          to="/dashboard"
          className="button button--secondary button--icon-only"
          aria-label="Zur Übersicht"
          title="Zur Übersicht"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14 7l-5 5 5 5V7z" />
          </svg>
        </Link>
      </header>

      <div className="card">
        <div className="card-content">
          <h2>Third-Party Notices</h2>
          <ul>
            <li>React – MIT License</li>
            <li>React Router – MIT License</li>
            <li>TipTap – MIT License</li>
            <li>Workbox – MIT License</li>
            <li>ZXing WASM – Apache-2.0 License</li>
            {/* …weitere Bibliotheken nach Bedarf… */}
          </ul>

          <h2>Schrift & Icons</h2>
          <p>
            Eingebettete SVG-Dateien (lokal). Es werden keine externen
            Schrift-CDNs geladen.
          </p>
        </div>
      </div>
    </div>
  );
}
