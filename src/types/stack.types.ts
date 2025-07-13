// src/types/stack.types.ts

/**
 * @interface VocabularyCard
 * Definiert die Struktur einer einzelnen Lernkarte.
 */
export interface VocabularyCard {
  /** Eindeutiger Identifikator für die Karte (z.B. UUID). */
  id: string;

  /** Die Vorderseite der Karte (Frage, Begriff). */
  front: string;

  /** Die Rückseite der Karte (Antwort, Definition). */
  back: string;

  /** Das aktuelle Lernlevel der Karte (z.B. für ein Leitner-System). */
  level: number;

  /** Zeitstempel des letzten Abfragedatums. */
  lastReviewed: string | null;
}

/**
 * @interface StackSettings
 * Definiert die benutzerspezifischen Einstellungen für einen Stapel.
 */
export interface StackSettings {
  /** Der gewählte Lernmodus. */
  learningMode: 'Schreiben' | 'Klassisch';

  /** Die Richtung der Abfrage. */
  direction: 'Vorderseite → Rückseite' | 'Rückseite → Vorderseite';

  /** Die Sprachen für die Text-to-Speech-Ausgabe. */
  speechLanguage: {
    front: string; // z.B. 'de-DE'
    back: string;  // z.B. 'en-US'
  };
}


/**
 * @interface Stack
 * Definiert die Hauptstruktur für einen Vokabelstapel (eine "Box").
 */
export interface Stack {
  /** Eindeutiger Identifikator für den Stapel (z.B. UUID). */
  id: string;

  /** Der vom Benutzer vergebene Name des Stapels. */
  name: string;

  /** Eine Sammlung aller Lernkarten, die zu diesem Stapel gehören. */
  cards: VocabularyCard[];

  /** Die spezifischen Einstellungen für diesen Stapel. */
  settings: StackSettings;

  /** Zeitstempel der Erstellung des Stapels. */
  createdAt: string;
}