// src/components/QR/QRScanModal.tsx
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../Button/Button'
import { MdClose, MdError } from 'react-icons/md'
import { decodeAnyPayload, isLikelyQrCardPayloadText } from '../../utils/qrCodec'
import { Scanner } from '@yudiel/react-qr-scanner'
import { toSafeQrItems } from '../../utils/qrValidate'

type CardData = { questionHtml: string; answerHtml: string }

type QRScanModalProps = {
  isOpen: boolean
  onClose: () => void
  /** 'single' → nach erstem Treffer übernehmen & schließen, 'multi' → sammeln und per Button übernehmen */
  mode?: 'single' | 'multi'
  onSuccess?: (data: CardData) => void
  onSuccessMany?: (items: CardData[]) => void
  /** Throttle: Mindestabstand zwischen zwei Auswertungen (ms) */
  throttleMs?: number
}

// Kompatibilitätstypisierung ohne any
const ScannerAny = Scanner as unknown as React.ComponentType<{
  onResult?: (res: unknown) => void
  onDecode?: (text: string) => void
  onScan?: (text: string) => void
  onError?: (err?: unknown) => void
  constraints?: MediaStreamConstraints
}>

const QRScanModal: React.FC<QRScanModalProps> = ({
  isOpen,
  onClose,
  mode = 'single',
  onSuccess,
  onSuccessMany,
  throttleMs = 700,
}) => {
  const [error, setError] = useState<string | null>(null)
  const handledRef = useRef<boolean>(false) // nur für single-Mode einmal verarbeiten
  const lastHandledAt = useRef<number>(0) // Throttle-Zeitstempel

  // Multi-Scan-Sammlung
  const [items, setItems] = useState<CardData[]>([])

  useEffect(() => {
    if (!isOpen) {
      handledRef.current = false
      setError(null)
      setItems([])
      lastHandledAt.current = 0
    }
  }, [isOpen])

  // ESC schließt Modal
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const addItem = (data: CardData) => setItems((prev) => [...prev, data])
  const addMany = (arr: CardData[]) => setItems((prev) => [...prev, ...arr])

  const decodeAndHandle = (text: string): void => {
    if (!text) return

    // Throttle gegen Mehrfach-Treffer desselben QR
    const now = Date.now()
    if (now - lastHandledAt.current < throttleMs) return
    lastHandledAt.current = now

    // Erwartetes LernBox-Format (LB1:…)
    if (!isLikelyQrCardPayloadText(text)) {
      setError('Unbekanntes QR-Format. Erwartet wird eine LernBox-Payload mit Präfix LB1:.')
      return
    }

    // Vorhandene Decoder-Logik nutzen (LB1-Wrapper + Base64 etc.)
    const res = decodeAnyPayload(text)
    if (!res.ok) {
      setError(res.error)
      return
    }

    // In gehärtetes Format überführen und validieren
    if (res.kind === 'single') {
      const safe = toSafeQrItems(res.payload) // einzelnes Objekt ist erlaubt
      if (!safe || safe.length === 0) {
        setError('QR-Inhalt leer oder unzulässig')
        return
      }
      const data = safe[0]
      if (mode === 'single') {
        if (handledRef.current) return
        handledRef.current = true
        onSuccess?.(data) // Parent legt an & schließt
      } else {
        addItem(data)
      }
      return
    }

    // batch
    const safe = toSafeQrItems({ items: res.payload.items })
    if (!safe || safe.length === 0) {
      setError('QR-Inhalt leer oder unzulässig')
      return
    }

    if (mode === 'single') {
      if (handledRef.current) return
      handledRef.current = true
      onSuccessMany ? onSuccessMany(safe) : onSuccess?.(safe[0])
    } else {
      addMany(safe)
    }
  }

  const handleError = (err?: unknown) => {
    const msg =
      typeof err === 'string'
        ? err
        : (err as { message?: string })?.message || 'Kamera konnte nicht gestartet werden'
    setError(msg)
  }

  const handleManual = (text: string) => {
    setError(null)
    decodeAndHandle(text)
  }

  const handleAcceptMany = () => {
    if (items.length === 0) return
    onSuccessMany?.(items)
  }

  if (!isOpen) return null
  const multi = mode === 'multi'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Karte(n) via QR-Code hinzufügen"
      style={styles.backdrop}
      onClick={onClose}
    >
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            {multi ? 'Mehrere Karten via QR-Code hinzufügen' : 'Karte via QR-Code hinzufügen'}
          </h3>
          <button aria-label="Schließen" onClick={onClose} style={styles.iconButton}>
            <MdClose size={22} />
          </button>
        </div>

        <div style={styles.body}>
          {/* Kamera */}
          <div style={styles.scannerWrap}>
            <ScannerAny
              onResult={(res: unknown) => {
                let text = ''
                if (typeof res === 'string') text = res
                else if (Array.isArray(res)) {
                  const first = res[0] as unknown
                  if (first && typeof first === 'object') {
                    const obj = first as { rawValue?: string; text?: string }
                    text = obj.rawValue ?? obj.text ?? ''
                  }
                } else if (res && typeof res === 'object') {
                  const obj = res as { rawValue?: string; text?: string }
                  text = obj.rawValue ?? obj.text ?? ''
                }
                if (text) decodeAndHandle(text)
              }}
              onDecode={(text: string) => decodeAndHandle(text)}
              onScan={(text: string) => decodeAndHandle(text)}
              onError={handleError}
              constraints={{ video: { facingMode: { ideal: 'environment' } }, audio: false }}
            />
          </div>

          {error && (
            <div style={styles.errorBox} role="alert">
              <MdError style={{ marginRight: 6 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Multi-Scan Übersicht */}
          {multi && (
            <div style={styles.multiInfo}>
              <div>
                Gesammelt: <strong>{items.length}</strong> Karte{items.length === 1 ? '' : 'n'}
              </div>
              {/* letzte 3 anzeigen */}
              <div className="mini-list" style={styles.miniList}>
                {items.slice(-3).map((it, i) => (
                  <div key={i} style={styles.miniItem}>
                    <span style={styles.miniText}>
                      {stripText(it.questionHtml).slice(0, 48) || 'VS …'} —{' '}
                      {stripText(it.answerHtml).slice(0, 48) || 'RS …'}
                    </span>
                  </div>
                ))}
                {items.length > 3 && <div style={styles.miniMore}>…</div>}
              </div>
            </div>
          )}

          {/* Fallback: manuelle Eingabe */}
          <details style={styles.details}>
            <summary style={styles.summary}>Kein Kamerazugriff? Payload einfügen</summary>
            <ManualPaste onManualSubmit={handleManual} />
          </details>

          <div style={styles.hint}>Tipp: Gute Ausleuchtung und ruhige Hand verbessern die Erkennungsrate</div>

          <div
            style={{
              display: 'flex',
              justifyContent: multi ? 'space-between' : 'flex-end',
              marginTop: 12,
            }}
          >
            {multi && (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="button" onClick={() => setItems([])} aria-label="Gesammelte Kartenliste leeren">
                  Zurücksetzen
                </Button>
                <Button
                  type="button"
                  onClick={handleAcceptMany}
                  variant="primary"
                  aria-label="Gesammelte Karten übernehmen"
                  disabled={items.length === 0}
                >
                  Übernehmen ({items.length})
                </Button>
              </div>
            )}
            <Button onClick={onClose} aria-label="Scanner schließen">
              Schließen
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const stripText = (html: string) => {
  const div = document.createElement('div')
  div.innerHTML = html
  return (div.textContent || '').trim()
}

const ManualPaste: React.FC<{ onManualSubmit: (text: string) => void }> = ({ onManualSubmit }) => {
  const [text, setText] = useState<string>('')
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onManualSubmit(text)
    setText('')
  }
  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="LB1:… hier einfügen"
        style={{ width: '100%', minHeight: 90, padding: 8 }}
      />
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <Button type="submit" variant="primary" aria-label="Payload hinzufügen">
          Hinzufügen
        </Button>
        <Button type="button" onClick={() => setText('')} aria-label="Eingabefeld leeren">
          Leeren
        </Button>
      </div>
    </form>
  )
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    width: 'min(95vw, 760px)',
    background: 'var(--color-bg, #fff)',
    color: 'var(--color-fg, #111)',
    borderRadius: 12,
    boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
  },
  title: { margin: 0, fontSize: 18, fontWeight: 600 },
  iconButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    borderRadius: 8,
  },
  body: { padding: 16 },
  scannerWrap: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.08)',
  },
  errorBox: {
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    padding: '8px 10px',
    borderRadius: 8,
    background: 'rgba(255,0,0,0.06)',
    color: '#a40000',
  },
  details: {
    marginTop: 12,
    background: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    padding: 8,
  },
  summary: { cursor: 'pointer', fontWeight: 600, marginBottom: 6 },
  hint: { marginTop: 8, fontSize: 12, opacity: 0.8 },
  multiInfo: { marginTop: 10 },
  miniList: { marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 },
  miniItem: { fontSize: 12, opacity: 0.85 },
  miniMore: { fontSize: 14, opacity: 0.6 },
}

export default QRScanModal
