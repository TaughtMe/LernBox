# Protokoll: Design-System

Dieses Dokument protokolliert die wichtigsten Entscheidungen und Schritte beim Aufbau des Design-Systems.

## Phase 1: Initiales Setup mit Storybook

### Installierte Abhängigkeiten

- **Storybook**: Initialisiert mit `npx storybook@latest init`. Dient zur isolierten Entwicklung und Dokumentation von UI-Komponenten.

### Komponente: Button

- **Zweck**: Eine wiederverwendbare Button-Komponente für primäre und sekundäre Aktionen.
- **Struktur**:
  - `src/components/Button/Button.tsx`: Die React-Komponente (Logik und Struktur).
  - `src/components/Button/Button.css`: Das Styling für die Komponente.
  - `src/components/Button/Button.stories.tsx`: Die Storybook-Datei zur Dokumentation und Darstellung der Varianten.
  ---
## Phase 2: Erweiterung des Design-Systems
*Datum: 15.07.2025*

### 2. Card
- **Beschreibung**: Eine `Card` ist eine flexible Container-Komponente, die Inhalte wie Text, Bilder oder andere Komponenten aufnehmen und visuell gruppieren kann. Sie dient als grundlegender Baustein für UI-Layouts.
- **Verwendung**:
  ```tsx
  import { Card } from './components/Card/Card';

  <Card>
    <h2>Titel in der Karte</h2>
    <p>Inhalt der Karte.</p>
  </Card>