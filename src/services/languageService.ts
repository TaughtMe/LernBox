import { franc } from 'franc'

/**
 * Detects the language of a given text using a hybrid approach.
 * First, it checks for unique German characters for high confidence.
 * If not found, it uses the 'franc' library for analysis.
 *
 * @param text The text to analyze.
 * @returns 'de' for German, 'en' for English (default).
 */
export const detectLanguage = (text: string): 'de' | 'en' => {
  console.log(`[HYBRID DEBUG] Input: "${text}"`);

  // Step 1: Heuristic
  const germanChars = /[äöüß]/i;
  if (germanChars.test(text)) {
    console.log('[HYBRID DEBUG] Result: "de" (from heuristic)');
    return 'de';
  }

  // Step 2: Franc
  const langCode = franc(text, {
    only: ['deu', 'eng'],
  });
  console.log(`[HYBRID DEBUG] Franc output: "${langCode}"`);

  if (langCode === 'deu') {
    console.log('[HYBRID DEBUG] Result: "de" (from franc)');
    return 'de';
  }

  // Step 3: Default
  console.log('[HYBRID DEBUG] Result: "en" (default)');
  return 'en';
}