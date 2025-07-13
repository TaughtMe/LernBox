// src/store/stackStore.ts

import { create } from 'zustand';
import type { Stack } from '../types/stack.types';

// --- Mock-Daten (Test-Daten) ---
// Wir initialisieren den Store mit unseren bekannten Test-Daten.
// ▼▼▼ ERSETZEN SIE DIESEN GESAMTEN BLOCK... ▼▼▼

// Eine kleine Hilfsfunktion, um realistische Test-Karten zu erzeugen
const createMockCards = (count: number, stackName: string): VocabularyCard[] => {
  if (count === 0) return [];
  return Array.from({ length: count }, (_, i) => ({
    id: `${stackName.toLowerCase()}-card-${i + 1}`,
    front: `Vorderseite ${i + 1}`,
    back: `Rückseite ${i + 1}`,
    level: (i % 5) + 1,
    lastReviewed: null,
  }));
};

const MOCK_STACKS: Stack[] = [
  {
    id: '1',
    name: 'Englisch Lektion 5',
    cards: createMockCards(25, 'englisch'), // Echte Karten-Objekte statt null
    settings: {
      learningMode: 'Klassisch',
      direction: 'Vorderseite → Rückseite',
      speechLanguage: { front: 'en-US', back: 'de-DE' },
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Spanisch für Anfänger',
    cards: createMockCards(58, 'spanisch'), // Echte Karten-Objekte statt null
    settings: {
      learningMode: 'Klassisch',
      direction: 'Vorderseite → Rückseite',
      speechLanguage: { front: 'es-ES', back: 'de-DE' },
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Leerer Stapel',
    cards: [], // Ein leeres Array ist korrekt
    settings: {
      learningMode: 'Schreiben',
      direction: 'Rückseite → Vorderseite',
      speechLanguage: { front: 'de-DE', back: 'de-DE' },
    },
    createdAt: new Date().toISOString(),
  },
];

// ▲▲▲ ...MIT DIESEM NEUEN BLOCK ▲▲▲
// ---------------------------------

interface StackState {
  stacks: Stack[];
  deleteStack: (id: string) => void;
  addStack: (name: string) => void;
  updateStackSettings: (stackId: string, newSettings: Partial<StackSettings>) => void;
  addCardToStack: (stackId: string, cardData: { front: string; back: string }) => void;
  deleteCardFromStack: (stackId: string, cardId: string) => void;
}

export const useStackStore = create<StackState>((set) => ({
  stacks: MOCK_STACKS,
  
  // Komplette Logik für deleteStack
  deleteStack: (id) => {
    set((state) => ({
      stacks: state.stacks.filter((stack) => stack.id !== id),
    }));
  },

  // Komplette Logik für addStack
  addStack: (name) => {
    const newStack: Stack = {
      id: crypto.randomUUID(),
      name,
      cards: [],
      settings: {
        learningMode: 'Klassisch',
        direction: 'Vorderseite → Rückseite',
        speechLanguage: { front: 'de-DE', back: 'en-US' },
      },
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      stacks: [...state.stacks, newStack],
    }));
  },

  // Komplette Logik für updateStackSettings
  updateStackSettings: (stackId, newSettings) => {
    set((state) => ({
      stacks: state.stacks.map((stack) => {
        if (stack.id !== stackId) {
          return stack;
        }
        return {
          ...stack,
          settings: {
            ...stack.settings,
            ...newSettings,
          },
        };
      }),
    }));
  },

  // Die neue Logik für addCardToStack
  addCardToStack: (stackId, cardData) => {
    const newCard: VocabularyCard = {
      id: crypto.randomUUID(),
      front: cardData.front,
      back: cardData.back,
      level: 1,
      lastReviewed: null,
    };
    set((state) => ({
      stacks: state.stacks.map((stack) => {
        if (stack.id !== stackId) {
          return stack;
        }
        return {
          ...stack,
          cards: [...stack.cards, newCard],
        };
      }),
    }));
  },

  deleteCardFromStack: (stackId, cardId) => {
    set((state) => ({
      stacks: state.stacks.map((stack) => {
        if (stack.id !== stackId) {
          return stack;
        }
        // Gib den Stapel zurück, aber mit einer gefilterten Kartenliste
        return {
          ...stack,
          cards: stack.cards.filter((card) => card.id !== cardId),
        };
      }),
    }));
  },

}));