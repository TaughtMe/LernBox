import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// NEU: Eine zuverlässige Funktion zum Generieren von IDs
const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// --- Typ-Definitionen ---
export interface Card {
  id: string;
  question: string;
  answer: string;
  level: number;
}
// ... (der Rest deiner Typen bleibt gleich) ...
export interface Deck {
  id: string;
  title: string;
  langFront: string;
  langBack: string;
  cards: Card[];
}

interface DeckContextType {
  decks: Deck[];
  addDeck: (title: string) => void;
  // ... (der Rest deines Context-Typs bleibt gleich) ...
  updateDeck: (deckId: string, title: string) => void;
  deleteDeck: (deckId: string) => void;
  addCardToDeck: (
    deckId: string,
    cardData: { question: string; answer: string }
  ) => void;
  addMultipleCardsToDeck: (
    deckId: string,
    newCardsData: { question: string; answer: string }[]
  ) => void;
  updateCardInDeck: (
    deckId: string,
    cardId: string,
    updatedData: { question: string; answer: string }
  ) => void;
  deleteCardFromDeck: (deckId: string, cardId: string) => void;
  answerCard: (deckId: string, cardId: string, wasCorrect: boolean) => void;
  restoreDecks: (decks: Deck[]) => void;
  updateDeckLanguages: (
    deckId: string,
    languages: { langFront: string; langBack: string }
  ) => void;
  exportDecks: () => void;
}

const DeckContext = createContext<DeckContextType | undefined>(undefined);

interface DeckProviderProps {
  children: ReactNode;
}

export const DeckProvider = ({ children }: DeckProviderProps) => {
  const [decks, setDecks] = useLocalStorage<Deck[]>('lernbox-decks', []);

  const addDeck = (title: string) => {
    const newDeck: Deck = {
      id: generateId(), // GEÄNDERT
      title: title,
      langFront: 'de',
      langBack: 'en',
      cards: [],
    };
    setDecks((prevDecks) => [...prevDecks, newDeck]);
  };

  const addCardToDeck = (
    deckId: string,
    cardData: { question: string; answer: string }
  ) => {
    setDecks((prevDecks) =>
      prevDecks.map((deck) => {
        if (deck.id === deckId) {
          const newCard: Card = {
            id: generateId(), // GEÄNDERT
            question: cardData.question,
            answer: cardData.answer,
            level: 1,
          };
          return { ...deck, cards: [...deck.cards, newCard] };
        }
        return deck;
      })
    );
  };

  const addMultipleCardsToDeck = (
    deckId: string,
    newCardsData: { question: string; answer: string }[]
  ) => {
    setDecks((prevDecks) =>
      prevDecks.map((deck) => {
        if (deck.id === deckId) {
          const newCards: Card[] = newCardsData.map((cardData) => ({
            id: generateId(), // GEÄNDERT
            question: cardData.question,
            answer: cardData.answer,
            level: 1,
          }));
          return { ...deck, cards: [...deck.cards, ...newCards] };
        }
        return deck;
      })
    );
  };

  // --- HIER FOLGT DER REST DEINER FUNKTIONEN OHNE ÄNDERUNGEN ---
  // (deleteDeck, updateDeck, updateDeckLanguages, etc.)
  
  const deleteDeck = (deckId: string) => {
    setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== deckId));
  };

  const updateDeck = (deckId: string, title: string) => {
    setDecks((prevDecks) =>
      prevDecks.map((deck) => (deck.id === deckId ? { ...deck, title } : deck))
    );
  };

  const updateDeckLanguages = (
    deckId: string,
    languages: { langFront: string; langBack: string }
  ) => {
    setDecks((prevDecks) =>
      prevDecks.map((deck) =>
        deck.id === deckId
          ? { ...deck, langFront: languages.langFront, langBack: languages.langBack }
          : deck
      )
    );
  };
  
  const deleteCardFromDeck = (deckId: string, cardId: string) => {
    setDecks((prevDecks) =>
      prevDecks.map((deck) => {
        if (deck.id === deckId) {
          const updatedCards = deck.cards.filter((card) => card.id !== cardId);
          return { ...deck, cards: updatedCards };
        }
        return deck;
      })
    );
  };

  const updateCardInDeck = (
    deckId: string,
    cardId: string,
    updatedData: { question: string; answer: string }
  ) => {
    setDecks((prevDecks) =>
      prevDecks.map((deck) => {
        if (deck.id === deckId) {
          const originalCard = deck.cards.find((card) => card.id === cardId);
          const updatedCards = deck.cards.map((card) =>
            card.id === cardId
              ? { ...card, ...updatedData, level: originalCard?.level ?? 1 }
              : card
          );
          return { ...deck, cards: updatedCards };
        }
        return deck;
      })
    );
  };

  const answerCard = (deckId: string, cardId: string, wasCorrect: boolean) => {
    setDecks((prevDecks) =>
      prevDecks.map((deck) => {
        if (deck.id === deckId) {
          const updatedCards = deck.cards.map((card) => {
            if (card.id === cardId) {
              const newLevel = wasCorrect ? Math.min(card.level + 1, 5) : 1;
              return { ...card, level: newLevel };
            }
            return card;
          });
          return { ...deck, cards: updatedCards };
        }
        return deck;
      })
    );
  };

  const restoreDecks = (decksData: Deck[]) => {
    setDecks(decksData);
  };
  
  const exportDecks = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(decks, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'lernbox-backup.json';
    link.click();
  };

  const value = {
    decks,
    addDeck,
    updateDeck,
    deleteDeck,
    addCardToDeck,
    addMultipleCardsToDeck,
    updateCardInDeck,
    deleteCardFromDeck,
    answerCard,
    restoreDecks,
    updateDeckLanguages,
    exportDecks,
  };

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDecks = () => {
  const context = useContext(DeckContext);
  if (context === undefined) {
    throw new Error('useDecks must be used within a DeckProvider');
  }
  return context;
};