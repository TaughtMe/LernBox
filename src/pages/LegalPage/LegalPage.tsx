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

        {/* Platzhalter – mit echten Daten füllen */}
        <p><strong>Verantwortlich</strong>: &lt;Name/Firma&gt;</p>
        <p><strong>Anschrift</strong>: &lt;Straße Nr.&gt;, &lt;PLZ Ort&gt;, &lt;Land&gt;</p>
        <p><strong>Kontakt</strong>: E-Mail: &lt;adresse@domain.tld&gt; · Tel.: &lt;Nummer&gt;</p>

        <h3>Haftungsausschluss</h3>
        <p>
          Inhalte wurden mit größter Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und
          Aktualität wird keine Gewähr übernommen
        </p>

        <h3>Urheberrecht</h3>
        <p>
          Sofern nicht anders angegeben, unterliegen Inhalte dem Urheberrecht des Anbieters.
          Vervielfältigung nur im Rahmen der jeweils genannten Lizenzen zulässig
        </p>
      </section>

      <section id="lizenzen" className="page__section card">
        <h2>Lizenzen</h2>

        <h3>App-Lizenz</h3>
        <p>
          Diese Anwendung steht unter: <em>&lt;Lizenztyp, z.&nbsp;B. MIT&gt;</em>.
          Den vollständigen Lizenztext bitte hier verlinken oder einbetten
        </p>

        <h3>Open-Source-Bibliotheken</h3>
        <p>
          Eine vollständige Übersicht externer Bibliotheken und ihrer Lizenzen befindet sich in&nbsp;
          <a href="/THIRDPARTY_NOTICES.txt" target="_blank" rel="noopener noreferrer">
            THIRDPARTY_NOTICES.txt
          </a>
        </p>

        <h3 id="schriften">Schriften (Google Fonts)</h3>
        <p>
          Die verwendeten Schriften werden <strong>selbst gehostet</strong> und nicht über Google-CDNs geladen
          {/* Falls aktuell CDN genutzt wird, diesen Satz anpassen: 
              "Die Schriften werden über Google Fonts (CDN) geladen. Dabei kann Ihre IP-Adresse an Google übermittelt werden.
               Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer einheitlichen Darstellung)."
              Empfehlung: Selbsthosting umsetzen */}
        </p>
        <ul>
          <li>
            <strong>&lt;Font-Name 1&gt;</strong> – Version &lt;x.y&gt; – Lizenz: <em>OFL&nbsp;1.1</em> oder <em>Apache-2.0</em> – Quelle: <code>https://fonts.google.com/</code>
          </li>
          <li>
            <strong>&lt;Font-Name 2&gt;</strong> – Version &lt;x.y&gt; – Lizenz: <em>OFL&nbsp;1.1</em> oder <em>Apache-2.0</em> – Quelle: <code>https://fonts.google.com/</code>
          </li>
        </ul>
        <p>
          Hinweis: Bei OFL 1.1 ist keine Attribution erforderlich, die <em>Lizenzdatei</em> sollte jedoch mit ausgeliefert werden
        </p>

        <h3 id="bildnachweise">Bildnachweise</h3>
        <p>
          Sofern nicht anders angegeben, sind Bilder/Grafiken urheberrechtlich geschützt. Für Materialien unter Creative-Commons-Lizenzen werden folgende Nachweise geführt
        </p>
        <ul>
          <li>
            <strong>&lt;Motiv/Titel&gt;</strong> von &lt;Urheber&gt; – Lizenz: <em>CC&nbsp;BY&nbsp;4.0</em> – Quelle: &lt;Link&gt; – Änderungen: &lt;ja/nein, welche&gt;
          </li>
          <li>
            <strong>&lt;Motiv/Titel&gt;</strong> von &lt;Urheber&gt; – Lizenz: <em>CC0&nbsp;1.0</em> – Quelle: &lt;Link&gt; – Änderungen: &lt;ja/nein&gt;
          </li>
          <li>
            <strong>&lt;Stock-Bild&gt;</strong> – Lizenz: &lt;Agentur/Vertrags-ID&gt; – Nutzungsart: &lt;Web/App&gt;
          </li>
        </ul>
      </section>
    </main>
  )
}
