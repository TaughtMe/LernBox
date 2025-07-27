import type { Card } from '../context/DeckContext'

// Definiert die Gewichtung für jede Stufe des Leitner-Systems.
// Karten auf niedrigeren Stufen erhalten ein höheres Gewicht und werden somit wahrscheinlicher ausgewählt.
const LEVEL_WEIGHTS: Record<number, number> = {
  1: 16, // Höchste Priorität
  2: 8,
  3: 4,
  4: 2,
  5: 1, // Niedrigste Priorität
}

/**
 * Wählt die nächste zu lernende Karte aus einem Stapel basierend auf dem Leitner-System aus.
 * Verwendet einen gewichteten Zufallsalgorithmus, um Karten auf niedrigeren Stufen zu priorisieren.
 *
 * @param cards - Das Array von Karten, aus dem ausgewählt werden soll.
 * @returns Die ausgewählte Karte oder null, wenn der Stapel leer ist.
 */
export const selectNextCard = (cards: Card[]): Card | null => {
  if (!cards || cards.length === 0) {
    return null
  }

  // Berechne das Gesamtgewicht aller Karten im Stapel.
  const totalWeight = cards.reduce((sum, card) => {
    // Falls eine Karte ein unerwartetes Level hat, gib ihr ein Standardgewicht von 1.
    const weight = LEVEL_WEIGHTS[card.level] ?? 1
    return sum + weight
  }, 0)

  // Wähle einen zufälligen Punkt auf der Gewichtsskala.
  let randomWeight = Math.random() * totalWeight

  // Finde die Karte, die dem zufällig gewählten Gewicht entspricht.
  for (const card of cards) {
    const weight = LEVEL_WEIGHTS[card.level] ?? 1
    randomWeight -= weight

    if (randomWeight <= 0) {
      return card
    }
  }

  // Fallback: Sollte theoretisch nie erreicht werden, wenn der Stapel nicht leer ist.
  // Gibt die letzte Karte zurück, um einen Fehler zu vermeiden.
  return cards[cards.length - 1]
}
