import React from 'react';

const LizenzenPage: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px 64px', lineHeight: 1.55 }}>
      <h1>Lizenzen & Danksagungen</h1>
      <p style={{ opacity: .85 }}>Open-Source-Komponenten, Schriften und Icons dieser Anwendung.</p>

      <section style={{ marginTop: 24 }}>
        <h2>Schriften & Icons</h2>
        <ul>
          <li>
            <strong>Google Fonts</strong> (lokal eingebunden) – <em>SIL Open Font License 1.1</em>, © jeweilige Urheber.
          </li>
          <li>
            <strong>Material Icons / Material Symbols</strong> – <em>Apache License 2.0</em>, © Google.
          </li>
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Bibliotheken (Auszug)</h2>
        <ul>
          <li>React, React Router – MIT</li>
          <li>TipTap (ProseMirror) – MIT</li>
          <li>Workbox – MIT</li>
          <li>html2canvas – MIT</li>
          <li>@yudiel/react-qr-scanner – MIT</li>
          <li>zxing-wasm – Apache-2.0</li>
        </ul>
        <p style={{ marginTop: 8 }}>
          Vollständige Lizenztexte sind den jeweiligen Projekten zu entnehmen (package.json).
        </p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Hinweise</h2>
        <p>
          Diese App lädt keine externen Ressourcen für Schriften/Icons (lokale Einbindung).
          Drittanbieterzugriffe sind durch eine strikte Content-Security-Policy begrenzt.
        </p>
      </section>

      <p style={{ marginTop: 24 }}>
        <a href="/THIRDPARTY_NOTICES.txt" download>THIRDPARTY_NOTICES.txt</a>
      </p>

      <p style={{ marginTop: 24, opacity: .8 }}>
        © {year} [Name der Schule]
      </p>
    </main>
  );
};

export default LizenzenPage;