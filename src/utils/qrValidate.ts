// src/utils/qrValidate.ts
import { sanitizeHtml } from './sanitizeHtml'

/**
 * Zweck
 * - Eingehende QR-Payloads prüfen, normalisieren und XSS-sicher machen
 * - Größenlimits setzen, leere Inhalte herausfiltern
 */

export type QrItem = { questionHtml: string; answerHtml: string }

export const MAX_ITEMS = 50
export const MAX_HTML_LEN = 5000 // je Feld, nach Sanitize geprüft

function isString(x: unknown): x is string {
  return typeof x === 'string'
}

function safeTrim(x: unknown): string {
  return isString(x) ? x.trim() : ''
}

// Base64url → UTF-8 String
function fromBase64Url(input: string): string {
  // base64url -> base64
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64 + '==='.slice((b64.length + 3) % 4)
  // atob liefert Latin1; TextDecoder für UTF-8
  const raw = atob(padded)
  const bytes = new Uint8Array([...raw].map((c) => c.charCodeAt(0)))
  return new TextDecoder().decode(bytes)
}

function tryParseUnknown(input: unknown): unknown {
  if (!input) return null

  // Bereits Objekt
  if (typeof input === 'object') return input

  // String-Fall
  if (isString(input)) {
    // Versuch 1: direkt JSON
    try {
      return JSON.parse(input)
    } catch {
      // Versuch 2: base64url-decoded JSON
      try {
        const decoded = fromBase64Url(input)
        return JSON.parse(decoded)
      } catch {
        return null
      }
    }
  }
  return null
}

function isLikelyItem(obj: unknown): obj is Partial<QrItem> {
  if (!obj || typeof obj !== 'object') return false
  const o = obj as Record<string, unknown>
  // akzeptiere Varianten: questionHtml/answerHtml oder question/answer
  return (
    isString(o.questionHtml) ||
    isString(o.answerHtml) ||
    isString(o.question) ||
    isString(o.answer)
  )
}

function toQrItemUnsafe(obj: unknown): QrItem | null {
  if (!isLikelyItem(obj)) return null
  const o = obj as Record<string, unknown>

  const qRaw =
    (o.questionHtml as string) ??
    (o.question as string) ??
    (o.front as string) ??
    ''
  const aRaw =
    (o.answerHtml as string) ??
    (o.answer as string) ??
    (o.back as string) ??
    ''

  const qSan = sanitizeHtml(safeTrim(qRaw))
  const aSan = sanitizeHtml(safeTrim(aRaw))

  // Längenlimit nach Sanitizing
  if (qSan.length === 0 || aSan.length === 0) return null
  if (qSan.length > MAX_HTML_LEN || aSan.length > MAX_HTML_LEN) return null

  return { questionHtml: qSan, answerHtml: aSan }
}

/**
 * Nimmt beliebige QR-Payload (String base64url/JSON oder Objekt)
 * und liefert eine sichere, normalisierte Item-Liste oder null
 */
export function toSafeQrItems(input: unknown): QrItem[] | null {
  const parsed = tryParseUnknown(input)
  if (!parsed) return null

  // Formate akzeptieren:
  // { items: [...] } | [...] | { questionHtml, answerHtml }
  let arr: unknown[] = []

  if (Array.isArray(parsed)) {
    arr = parsed
  } else if (typeof parsed === 'object') {
    const o = parsed as Record<string, unknown>
    if (Array.isArray(o.items)) arr = o.items as unknown[]
    else arr = [o]
  } else {
    return null
  }

  // hartes Limit auf Anzahl
  if (arr.length === 0) return null
  if (arr.length > MAX_ITEMS) arr = arr.slice(0, MAX_ITEMS)

  const out: QrItem[] = []
  for (const it of arr) {
    const item = toQrItemUnsafe(it)
    if (item) out.push(item)
  }

  return out.length > 0 ? out : null
}
