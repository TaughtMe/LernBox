// src/pages/LegalPage/LegalPage.tsx
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './LegalPage.css'


export default function LegalPage() {
  const { hash } = useLocation()

  useEffect(() => {
    document.title = 'Impressum & Lizenzen'
  }, [])

  // Hash-Deep-Link unterstützen
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [hash])

  return (
    <main className="page legal-page">
      <header className="page__header">
        {/* nutzt bestehenden Zurück-Pfeil-Stil */}
        <Link
          to="/dashboard"
          aria-label="Zur Übersicht"
          className="button button--secondary button--icon-only"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M20 11H7.83l5.59-5.59L12 4 4 12l8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </Link>

        <h1>Impressum &amp; Lizenzen</h1>
      </header>

      <section id="impressum" className="page__section card">
        <h2>Impressum</h2>

        <p><strong>Verantwortlich</strong>: &lt;Name/Firma&gt;</p>
        <p><strong>Anschrift</strong>: &lt;Straße Nr.&gt;, &lt;PLZ Ort&gt;, &lt;Land&gt;</p>
        <p><strong>Kontakt</strong>: E-Mail: &lt;adresse@domain.tld&gt; · Tel.: &lt;Nummer&gt;</p>

        <h3>Haftungsausschluss</h3>
        <p>
          Inhalte wurden mit größter Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und
          Aktualität wird keine Gewähr übernommen.
        </p>

        <h3>Urheberrecht</h3>
        <p>
          Sofern nicht anders angegeben, unterliegen Inhalte dem Urheberrecht des Anbieters.
          Vervielfältigung nur im Rahmen der Lizenz zulässig.
        </p>
      </section>

      <section id="lizenzen" className="page__section card">
        <h2>Lizenzen</h2>

        <h3>App-Lizenz</h3>
        <p>
          Diese Anwendung steht unter: <em>&lt;Lizenztyp, z.&nbsp;B. MIT&gt;</em>.
          Vollständigen Lizenztext hier hinterlegen oder verlinken.
        </p>

        <h3>Drittbibliotheken</h3>
        <p>
          Hinweise zu Drittbibliotheken in&nbsp;
          <a href="/THIRDPARTY_NOTICES.txt" target="_blank" rel="noopener noreferrer">
            THIRDPARTY_NOTICES.txt
          </a>
          .
        </p>

        <h3>Assets (Icons, Fonts, Bilder)</h3>
        <ul>
          <li>Icons: &lt;Quelle/Lizenz&gt;</li>
          <li>Schriftarten: &lt;Quelle/Lizenz&gt;</li>
          <li>Bilder/Grafiken: &lt;Quelle/Lizenz&gt;</li>
        </ul>
      </section>
    </main>
  )
}
