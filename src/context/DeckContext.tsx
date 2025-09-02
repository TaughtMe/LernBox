import { createContext, useContext, type ReactNode, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// ——— Hilfsfunktionen ———
const generateId = (): string =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const wrapPlainAsHtml = (text: string) => `<p>${escapeHtml(text ?? '')}</p>`

// ——— Typen ———
export interface Card {
  id: string
  questionHtml: string
  answerHtml: string
  level: number
}

export interface Deck {
  id: string
  title: string
  langFront: string
  langBack: string
  cards: Card[]
}

interface DeckContextType {
  decks: Deck[]
  addDeck: (title: string) => void
  updateDeck: (deckId: string, title: string) => void
  deleteDeck: (deckId: string) => void

  addCardToDeck: (
    deckId: string,
    cardData: { questionHtml: string; answerHtml: string }
  ) => void

  addMultipleCardsToDeck: (
    deckId: string,
    newCardsData: { questionHtml: string; answerHtml: string }[]
  ) => void

  updateCardInDeck: (
    deckId: string,
    cardId: string,
    updatedData: { questionHtml: string; answerHtml: string }
  ) => void

  deleteCardFromDeck: (deckId: string, cardId: string) => void
  answerCard: (deckId: string, cardId: string, wasCorrect: boolean) => void
  restoreDecks: (decks: Deck[]) => void
  updateDeckLanguages: (
    deckId: string,
    languages: { langFront: string; langBack: string }
  ) => void
  exportDecks: () => void
}

// ——— Migration (alte question/answer → questionHtml/answerHtml) ———
type AnyCard = {
  id: string
  level?: number
  questionHtml?: string
  answerHtml?: string
  question?: string
  answer?: string
}

const migrateCard = (raw: AnyCard): Card => {
  const level = typeof raw.level === 'number' ? raw.level : 1
  // wenn neue Felder existieren, bevorzugen
  if (
    typeof raw.questionHtml === 'string' ||
    typeof raw.answerHtml === 'string'
  ) {
    return {
      id: raw.id,
      level,
      questionHtml: raw.questionHtml ?? wrapPlainAsHtml(raw.question ?? ''),
      answerHtml: raw.answerHtml ?? wrapPlainAsHtml(raw.answer ?? ''),
    }
  }
  // Alt: Plaintext-Felder
  return {
    id: raw.id,
    level,
    questionHtml: wrapPlainAsHtml(raw.question ?? ''),
    answerHtml: wrapPlainAsHtml(raw.answer ?? ''),
  }
}

const migrateDeck = (d: any): Deck => {
  return {
    id: d.id,
    title: d.title,
    langFront: d.langFront ?? 'de',
    langBack: d.langBack ?? 'en',
    cards: Array.isArray(d.cards) ? d.cards.map(migrateCard) : [],
  }
}

const migrateDeckArray = (arr: any[]): Deck[] =>
  Array.isArray(arr) ? arr.map(migrateDeck) : []

// ——— Context ———
const DeckContext = createContext<DeckContextType | undefined>(undefined)

interface DeckProviderProps {
  children: ReactNode
}

export const DeckProvider = ({ children }: DeckProviderProps) => {
  const [decks, setDecks] = useLocalStorage<Deck[]>('lernbox-decks', [])

  // Beim ersten Render gespeicherte Daten migrieren (idempotent)
  useEffect(() => {
    setDecks((prev) => migrateDeckArray(prev as any))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addDeck = (title: string) => {
    const newDeck: Deck = {
      id: generateId(),
      title,
      langFront: 'de',
      langBack: 'en',
      cards: [],
    }
    setDecks((prev) => [...prev, newDeck])
  }

  const addCardToDeck = (
    deckId: string,
    cardData: { questionHtml: string; answerHtml: string }
  ) => {
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== deckId) return deck
        const newCard: Card = {
          id: generateId(),
          questionHtml: cardData.questionHtml,
          answerHtml: cardData.answerHtml,
          level: 1,
        }
        return { ...deck, cards: [...deck.cards, newCard] }
      })
    )
  }

  const addMultipleCardsToDeck = (
    deckId: string,
    newCardsData: { questionHtml: string; answerHtml: string }[]
  ) => {
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== deckId) return deck
        const newCards: Card[] = newCardsData.map((c) => ({
          id: generateId(),
          questionHtml: c.questionHtml,
          answerHtml: c.answerHtml,
          level: 1,
        }))
        return { ...deck, cards: [...deck.cards, ...newCards] }
      })
    )
  }

  const deleteDeck = (deckId: string) => {
    setDecks((prev) => prev.filter((deck) => deck.id !== deckId))
  }

  const updateDeck = (deckId: string, title: string) => {
    setDecks((prev) =>
      prev.map((deck) => (deck.id === deckId ? { ...deck, title } : deck))
    )
  }

  const updateDeckLanguages = (
    deckId: string,
    languages: { langFront: string; langBack: string }
  ) => {
    setDecks((prev) =>
      prev.map((deck) =>
        deck.id === deckId
          ? {
              ...deck,
              langFront: languages.langFront,
              langBack: languages.langBack,
            }
          : deck
      )
    )
  }

  const deleteCardFromDeck = (deckId: string, cardId: string) => {
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== deckId) return deck
        const updatedCards = deck.cards.filter((c) => c.id !== cardId)
        return { ...deck, cards: updatedCards }
      })
    )
  }

  const updateCardInDeck = (
    deckId: string,
    cardId: string,
    updatedData: { questionHtml: string; answerHtml: string }
  ) => {
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== deckId) return deck
        const original = deck.cards.find((c) => c.id === cardId)
        const updatedCards = deck.cards.map((c) =>
          c.id === cardId
            ? {
                ...c,
                questionHtml: updatedData.questionHtml,
                answerHtml: updatedData.answerHtml,
                level: original?.level ?? c.level ?? 1,
              }
            : c
        )
        return { ...deck, cards: updatedCards }
      })
    )
  }

  const answerCard = (deckId: string, cardId: string, wasCorrect: boolean) => {
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== deckId) return deck
        const updatedCards = deck.cards.map((c) => {
          if (c.id !== cardId) return c
          const newLevel = wasCorrect ? Math.min((c.level ?? 1) + 1, 5) : 1
          return { ...c, level: newLevel }
        })
        return { ...deck, cards: updatedCards }
      })
    )
  }

  const restoreDecks = (decksData: Deck[]) => {
    // auch bei Restore migrieren (falls altes Backup)
    setDecks(migrateDeckArray(decksData as any))
  }

  const exportDecks = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(decks, null, 2)
    )}`
    const link = document.createElement('a')
    link.href = jsonString
    link.download = 'lernbox-backup.json'
    link.click()
  }

  const value: DeckContextType = {
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
  }

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDecks = () => {
  const ctx = useContext(DeckContext)
  if (ctx === undefined) {
    throw new Error('useDecks must be used within a DeckProvider')
  }
  return ctx
}
