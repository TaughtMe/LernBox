// src/utils/csvSafe.ts
/**
 * Schutz vor "Formula Injection" beim CSV-Import:
 * Excel/Sheets können Zellen als Formel interpretieren, wenn sie mit =, +, - oder @ beginnen.
 * Lösung: Gefährliche Präfixe mit einem führenden Apostroph neutralisieren.
 * Quelle: gängige Best Practices (OWASP, MS Excel)
 */

const DANGEROUS_PREFIX = /^[=+\-@]/ // Formelstarts
const CONTROL_CHARS = /[\u0000]/g   // Null-Bytes entfernen

export function sanitizeCsvCell(raw: unknown): string {
  let s = (raw ?? '').toString()

  // Null-Bytes u. ä. entfernen
  s = s.replace(CONTROL_CHARS, '')

  // Trim behalten wir bewusst NICHT global, um inhaltliche Spaces nicht zu verlieren
  // Nur BOM am Anfang entfernen
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1)

  // Gefährliche Formel-Präfixe neutralisieren
  if (DANGEROUS_PREFIX.test(s)) s = "'" + s

  return s
}

/**
 * Wendet die Zellsanitisierung auf eine flache Objektzeile an (z. B. PapaParse-Result row)
 */
export function sanitizeCsvRow<T extends Record<string, unknown>>(row: T): Record<keyof T, string> {
  const out = {} as Record<keyof T, string>
  for (const k in row) {
    out[k] = sanitizeCsvCell(row[k])
  }
  return out
}

/**
 * Sanitize für eine Liste von Rows
 */
export function sanitizeCsvImport<T extends Record<string, unknown>>(rows: T[]): Record<keyof T, string>[] {
  return rows.map(sanitizeCsvRow)
}
