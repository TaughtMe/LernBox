// src/pages/LegalPage/LegalPage.tsx
// Rechtstexte an deutsches Recht angelehnt (ohne Rechtsberatung).
// Bitte Platzhalter in <> mit echten Daten füllen.

import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './LegalPage.css'

export default function LegalPage() {
  const { hash } = useLocation()

  useEffect(() => {
    document.title = 'Impressum & Lizenzen'
  }, [])

  // Deep-Links unterstützen
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [hash])

  // WICHTIG: Link zur Textdatei relativ zur Vite-BASE_URL auflösen
  const baseAbs = new URL(import.meta.env.BASE_URL, window.location.origin)
  const noticesUrl = new URL('THIRDPARTY_NOTICES.txt', baseAbs).toString()

  const stand = new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })

  return (
    <main className="page legal-page">
      <header className="page__header">
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

      {/* ============================== IMPRESSUM ============================== */}
      <section id="impressum" className="page__section card">
        <h2>Impressum</h2>

        <h3>Angaben gemäß § 5 TMG</h3>
        <p>
          <strong>Diensteanbieter</strong><br />
          &lt;Name der Schule&gt;<br />
          &lt;Straße Hausnummer&gt;<br />
          &lt;PLZ Ort&gt; – &lt;Land&gt;
        </p>

        <p>
          <strong>Vertreten durch (Schulleitung)</strong><br />
          &lt;Name, Funktion&gt;
        </p>

        <p>
          <strong>Schulträger</strong><br />
          &lt;Name des Schulträgers (Stadt/Gemeinde/Land)&gt;<br />
          &lt;Adresse des Schulträgers&gt;
        </p>

        <p>
          <strong>Kontakt</strong><br />
          Telefon: &lt;Telefonnummer&gt;<br />
          E-Mail: &lt;funktionsadresse@schule.de&gt;
        </p>

        <p>
          <strong>Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV</strong><br />
          &lt;Vor- und Nachname&gt;<br />
          &lt;dienstliche Anschrift oder wie oben&gt;
        </p>

        <p>
          <strong>Aufsichtsbehörde</strong><br />
          &lt;Zuständige Schulaufsichtsbehörde / Reg. von &gt;<br />
          &lt;Anschrift&gt;
        </p>

        <p>
          <strong>Umsatzsteuer-ID</strong><br />
          Nicht zutreffend / entfällt für diese öffentliche Einrichtung (falls vorhanden, hier eintragen)
        </p>

        <h3>Technische Umsetzung / Hosting</h3>
        <p>
          Diese Website/Anwendung wird über Cloudflare Pages (Cloudflare, Inc.) bereitgestellt. Beim
          Aufruf können serverseitig technische Zugriffsdaten (z.&nbsp;B. IP-Adresse, Zeitstempel,
          User-Agent) verarbeitet werden. Es werden keine Nutzerkonten geführt. Die App ist als
          PWA nutzbar und speichert Daten ausschließlich lokal auf dem Endgerät
          (IndexedDB/LocalStorage).
        </p>

        <h3>Haftung für Inhalte</h3>
        <p>
          Die Inhalte wurden mit größter Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und
          Aktualität wird keine Gewähr übernommen. Gesetzliche Informations- und Entfernungspflichten
          bleiben unberührt.
        </p>

        <h3>Haftung für Links</h3>
        <p>
          Externe Links wurden bei Verlinkung auf mögliche Rechtsverstöße geprüft. Auf die aktuelle
          inhaltliche Gestaltung haben wir keinen Einfluss. Für Inhalte verlinkter Seiten sind
          ausschließlich deren Betreiber verantwortlich. Bei Hinweisen auf Rechtsverstöße werden
          betroffene Links unverzüglich entfernt.
        </p>

        <h3>Urheberrecht / Nutzungsrechte</h3>
        <p>
          Sofern nicht anders gekennzeichnet, unterliegen Inhalte, Layouts und Quelltexte dem
          Urheberrecht von &lt;Name der Schule&gt; bzw. den genannten Rechteinhabern. Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der gesetzlichen Schranken
          bedürfen der vorherigen schriftlichen Zustimmung. Open-Source-Bestandteile sind gesondert
          lizenziert (siehe Abschnitt „Lizenzen &amp; Danksagungen“).
        </p>

        <h3>Barrierefreiheit</h3>
        <p>
          Die Erklärung zur digitalen Barrierefreiheit gemäß BayEGovV/BITV finden Sie unter:&nbsp;
          &lt;URL zur Barrierefreiheitserklärung&gt;
        </p>

        <h3>Datenschutz</h3>
        <p>
          Informationen zur Verarbeitung personenbezogener Daten entnehmen Sie bitte unserer
          Datenschutzerklärung:&nbsp; &lt;URL zur Datenschutzerklärung&gt;
        </p>

        <p><em>Stand: {stand}</em></p>
      </section>

      {/* ========================= LIZENZEN & DANKSAGUNGEN ========================= */}
      <section id="lizenzen" className="page__section card">
        <h2>Lizenzen &amp; Danksagungen</h2>

        <p>
          <strong>App-Name</strong>: LernBox<br />
          <strong>Copyright</strong>: © {new Date().getFullYear()} &lt;Name der Schule&gt;<br />
          <strong>Lizenz der Anwendung</strong>: &lt;z.&nbsp;B. „Alle Rechte vorbehalten“ oder „MIT-Lizenz“&gt;
        </p>

        <h3>Open-Source-Komponenten (Auszug)</h3>
        <ul>
          <li>React – MIT</li>
          <li>React Router – MIT</li>
          <li>Vite – MIT</li>
          <li>TypeScript – Apache-2.0</li>
          <li>TipTap (Editor) &amp; ProseMirror – MIT</li>
          <li>workbox (Service Worker Utilities, Google) – Apache-2.0</li>
          <li>html2canvas – MIT</li>
          <li>zxing-wasm (QR/Barcode Fallback) – Apache-2.0</li>
          <li>(falls genutzt) Material Symbols / Google – Apache-2.0</li>
        </ul>
        <p>
          Vollständige Abhängigkeiten und Lizenztexte:&nbsp;
          <a
            href={noticesUrl}
            download="THIRDPARTY_NOTICES.txt"
            rel="noopener noreferrer"
          >
            THIRDPARTY_NOTICES.txt
          </a>
          . Maßgeblich sind die jeweiligen Lizenztexte der Projekte.
        </p>

        <h3 id="schriften">Schriften (Google Fonts)</h3>
        <p>
          Es werden <strong>keine externen Webfonts</strong> von Google-CDNs geladen. Verwendete Google-Fonts
          sind lokal gebündelt (Self-Hosting). Für jede Schrift werden Name, Version, Lizenz und Quelle
          aufgeführt:
        </p>
        <ul>
          <li>
            <strong>&lt;Font-Name 1&gt;</strong> – Version &lt;x.y&gt; – Lizenz: <em>OFL&nbsp;1.1</em> (oder <em>Apache-2.0</em>) – Quelle: fonts.google.com
          </li>
          <li>
            <strong>&lt;Font-Name 2&gt;</strong> – Version &lt;x.y&gt; – Lizenz: <em>OFL&nbsp;1.1</em> (oder <em>Apache-2.0</em>) – Quelle: fonts.google.com
          </li>
        </ul>
        <p>
          Hinweis: Bei OFL&nbsp;1.1 ist keine namentliche Attribution erforderlich, die <em>Lizenzdatei</em>
          sollte jedoch mit ausgeliefert werden.
        </p>

        <h3 id="icons">Icons</h3>
        <p>
          Icons sind lokal als SVG eingebettet bzw. stammen aus Systemschriften. Falls Google-Material-Symbole
          verwendet werden: „Material Symbols (Google), Apache-2.0 – lokal eingebettet, kein externer Abruf“.
        </p>

        <h3 id="bildnachweise">Bildnachweise</h3>
        <p>
          Sofern nicht anders angegeben, sind Bilder/Grafiken urheberrechtlich geschützt. Für Materialien
          unter Creative-Commons-Lizenzen werden folgende Nachweise geführt:
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

        <p><em>Stand: {stand}</em></p>
      </section>
    </main>
  )
}
