import React from 'react';

const ImpressumPage: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px 64px', lineHeight: 1.55 }}>
      <h1>Impressum</h1>
      <p style={{ opacity: .85, marginTop: 6 }}>
        (Hinweis: Platzhalter bitte mit schulischen Angaben ersetzen. Keine privaten Daten verwenden.)
      </p>

      <section style={{ marginTop: 24 }}>
        <h2>Anbieter</h2>
        <p>
          <strong>[Name der Schule]</strong><br />
          [Straße Hausnummer]<br />
          [PLZ Ort]<br />
          [Land]
        </p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Kontakt</h2>
        <p>
          E-Mail: <a href="mailto:[schulische-kontaktadresse]">[schulische-kontaktadresse]</a><br />
          Telefon (Sekretariat): [Schultelefon]
        </p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Vertretungsberechtigt</h2>
        <p>Schulleitung: [Name der Schulleitung]</p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Aufsichtsbehörde</h2>
        <p>[Zuständige Schulaufsicht / Behörde, Anschrift]</p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Verantwortlich i.S.d. § 18 Abs. 2 MStV</h2>
        <p>
          [Funktion/Referat an der Schule, z. B. Medienbeauftragte:r] – sofern erforderlich.
        </p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Urheberrecht</h2>
        <p>
          © {year} [Name der Schule], sofern nicht anders gekennzeichnet. Inhalte, Layout und
          Code dieser Anwendung sind urheberrechtlich geschützt. Drittinhalte siehe{' '}
          <a href="/lizenzen">Lizenzen</a>.
        </p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Haftungsausschluss</h2>
        <p>
          Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte
          externer Links. Für den Inhalt verlinkter Seiten sind ausschließlich deren Betreiber verantwortlich.
        </p>
      </section>
    </main>
  );
};

export default ImpressumPage;