// src/utils/qrImport.ts
import { toSafeQrItems, type QrItem } from './qrValidate'

/**
 * Verarbeitet eine QR-Payload sicher:
 * - akzeptiert base64url, JSON-String oder Objekt
 * - validiert, saniert und normalisiert die Items
 * - ruft addMultipleCardsToDeck(...) auf
 *
 * @returns Anzahl importierter Karten
 * @throws Error bei ungültiger/leerere Payload
 */
export function processQrAndImport(
  raw: unknown,
  opts: {
    deckId: string
    addMultipleCardsToDeck: (deckId: string, items: QrItem[]) => void
  }
): number {
  const items = toSafeQrItems(raw)
  if (!items || items.length === 0) {
    throw new Error('Ungültiger oder leerer QR-Inhalt')
  }
  // tatsächlicher Import
  opts.addMultipleCardsToDeck(opts.deckId, items)
  return items.length
}
