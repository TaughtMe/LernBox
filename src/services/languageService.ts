import { francAll } from 'franc'

/**
 * Erkennt die Sprache eines Textes mit einem mehrstufigen Hybrid-Ansatz.
 * 1. Prüft auf deutsche Sonderzeichen (ä, ö, ü, ß) für eine schnelle, sichere Erkennung.
 * 2. Nutzt 'francAll', um die statistische Wahrscheinlichkeit mit einer Konfidenzschwelle zu bewerten.
 * 3. Fällt bei Unsicherheit auf eine Zählung häufiger deutscher und englischer Wörter zurück.
 *
 * @param text Der zu analysierende Text.
 * @returns 'de' für Deutsch, 'en' für Englisch.
 */
export const detectLanguage = (text: string): 'de' | 'en' => {
  const cleanedText = text.trim()

  if (cleanedText.length < 2) {
    return 'en'
  }

  // --- Schritt 1: Heuristik für 100% sichere deutsche Zeichen ---
  const germanChars = /[äöüß]/i
  if (germanChars.test(cleanedText)) {
    return 'de'
  }

  // --- Schritt 2: 'francAll' mit Konfidenzprüfung ---
  const langProbs = francAll(cleanedText, {
    only: ['deu', 'eng'],
  })

  // Wir geben den Elementen hier explizite Typen, um den 'implicit any' Fehler zu beheben
  const deuProb =
    langProbs.find(([lang]: [string, number]) => lang === 'deu')?.[1] || 0
  const engProb =
    langProbs.find(([lang]: [string, number]) => lang === 'eng')?.[1] || 0

  const confidenceThreshold = 0.1
  if (deuProb > engProb + confidenceThreshold) {
    return 'de'
  }
  if (engProb > deuProb + confidenceThreshold) {
    return 'en'
  }

  // --- Schritt 3: Fallback-Prüfung häufiger Wörter ---
  const germanCommonWords = new Set([
    'der',
    'die',
    'das',
    'und',
    'ist',
    'nicht',
    'es',
    'sie',
    'er',
    'ich',
    'mit',
    'zu',
  ])
  const englishCommonWords = new Set([
    'the',
    'and',
    'is',
    'in',
    'to',
    'of',
    'a',
    'for',
    'with',
    'on',
    'he',
    'she',
  ])

  const words = cleanedText.toLowerCase().split(/\s+/)
  const germanCount = words.filter((word) => germanCommonWords.has(word)).length
  const englishCount = words.filter((word) =>
    englishCommonWords.has(word)
  ).length

  return germanCount > englishCount ? 'de' : 'en'
}
