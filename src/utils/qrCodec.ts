// src/utils/qrCodec.ts
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string'
import {
  QrCardPayload,
  QrCardPayloadSchema,
  // ▼▼▼ NEU: Batch-Typen/Schema
  QrCardBatchPayload,
  QrCardBatchPayloadSchema,
} from '../types/qr'

export const QR_PAYLOAD_PREFIX = 'LB1:'

/**
 * Baut eine versionierte, identifizierbare Payload (SINGLE) und komprimiert sie
 */
export function encodeCardPayload(card: {
  questionHtml: string
  answerHtml: string
}): string {
  const payload: QrCardPayload = {
    app: 'LernBox',
    v: 1,
    type: 'card',
    questionHtml: card.questionHtml,
    answerHtml: card.answerHtml,
    meta: { createdAt: new Date().toISOString() },
  }
  const json = JSON.stringify(payload)
  const compressed = compressToEncodedURIComponent(json)
  return QR_PAYLOAD_PREFIX + compressed
}

export type DecodeResult =
  | { ok: true; payload: QrCardPayload }
  | { ok: false; error: string }

/**
 * Prüft Präfix, dekomprimiert, validiert (SINGLE)
 */
export function decodeCardPayload(text: string): DecodeResult {
  try {
    if (!text || !text.startsWith(QR_PAYLOAD_PREFIX)) {
      return {
        ok: false,
        error: 'Ungültiges oder unbekanntes QR-Format: Präfix fehlt',
      }
    }
    const compressed = text.slice(QR_PAYLOAD_PREFIX.length)
    const json = decompressFromEncodedURIComponent(compressed)
    if (!json) {
      return {
        ok: false,
        error: 'Dekompression fehlgeschlagen oder Payload leer',
      }
    }

    const parsed = JSON.parse(json)
    const validated = QrCardPayloadSchema.safeParse(parsed)
    if (!validated.success) {
      const details = validated.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join(', ')
      return { ok: false, error: `Validierung fehlgeschlagen: ${details}` }
    }

    return { ok: true, payload: validated.data }
  } catch (e: any) {
    return { ok: false, error: `Fehler beim Dekodieren: ${e?.message ?? e}` }
  }
}

/**
 * Schnelle Heuristik für frühe Format-Erkennung
 */
export function isLikelyQrCardPayloadText(text: string): boolean {
  return typeof text === 'string' && text.startsWith(QR_PAYLOAD_PREFIX)
}

/* ──────────────────────────────────────────────────────────────────────────
 * ▼▼▼ NEU: Batch-Codec (mehrere Karten in einem QR-Code)
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Erstellt eine Batch-Payload (card_batch) für mehrere Karten und komprimiert sie
 */
export function encodeBatchPayload(
  items: Array<{ questionHtml: string; answerHtml: string }>
): string {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('encodeBatchPayload: items dürfen nicht leer sein')
  }
  const payload: QrCardBatchPayload = {
    app: 'LernBox',
    v: 1,
    type: 'card_batch',
    items,
    meta: { createdAt: new Date().toISOString(), count: items.length },
  }
  const json = JSON.stringify(payload)
  const compressed = compressToEncodedURIComponent(json)
  return QR_PAYLOAD_PREFIX + compressed
}

export type DecodeAnyResult =
  | { ok: true; kind: 'single'; payload: QrCardPayload }
  | { ok: true; kind: 'batch'; payload: QrCardBatchPayload }
  | { ok: false; error: string }

/**
 * Universeller Decoder: erkennt SINGLE (card) oder BATCH (card_batch)
 */
export function decodeAnyPayload(text: string): DecodeAnyResult {
  try {
    if (!text || !text.startsWith(QR_PAYLOAD_PREFIX)) {
      return {
        ok: false,
        error: 'Ungültiges oder unbekanntes QR-Format: Präfix fehlt',
      }
    }
    const compressed = text.slice(QR_PAYLOAD_PREFIX.length)
    const json = decompressFromEncodedURIComponent(compressed)
    if (!json) {
      return {
        ok: false,
        error: 'Dekompression fehlgeschlagen oder Payload leer',
      }
    }

    const parsed = JSON.parse(json)
    // Erkennen über Feld "type"
    if (parsed?.type === 'card') {
      const v = QrCardPayloadSchema.safeParse(parsed)
      if (!v.success) {
        const details = v.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join(', ')
        return {
          ok: false,
          error: `Validierung (card) fehlgeschlagen: ${details}`,
        }
      }
      return { ok: true, kind: 'single', payload: v.data }
    }

    if (parsed?.type === 'card_batch') {
      const v = QrCardBatchPayloadSchema.safeParse(parsed)
      if (!v.success) {
        const details = v.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join(', ')
        return {
          ok: false,
          error: `Validierung (card_batch) fehlgeschlagen: ${details}`,
        }
      }
      return { ok: true, kind: 'batch', payload: v.data }
    }

    return {
      ok: false,
      error: `Unbekannter Payload-Typ: ${parsed?.type ?? 'n/a'}`,
    }
  } catch (e: any) {
    return { ok: false, error: `Fehler beim Dekodieren: ${e?.message ?? e}` }
  }
}
