/**
 * Detects the language of a given text based on a simple heuristic.
 * Currently supports German and English.
 *
 * @param text The text to analyze.
 * @returns 'de' for German, 'en' for English (default).
 */
export const detectLanguage = (text: string): 'de' | 'en' => {
  // Simple heuristic: Check for characters specific to the German language.
  const germanChars = /[äöüß]/i

  if (germanChars.test(text)) {
    return 'de'
  }

  // Default to English if no German-specific characters are found.
  return 'en'
}
