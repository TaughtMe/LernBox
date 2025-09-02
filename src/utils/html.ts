// src/utils/html.ts

/**
 * Wandelt HTML sicher in Plaintext um (für Sortierung/Filter/TTS).
 * Entfernt überflüssige Whitespaces.
 */
export function htmlToPlainText(html?: string): string {
  const div = document.createElement('div')
  div.innerHTML = html ?? ''
  return (div.textContent || '').replace(/\s+/g, ' ').trim()
}
