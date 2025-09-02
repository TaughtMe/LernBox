// src/components/QR/QRCodeModal.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { encodeCardPayload } from '../../utils/qrCodec'
import { MdClose, MdContentCopy, MdFileDownload } from 'react-icons/md'
import { Button } from '../Button/Button'

type QRCodeModalProps = {
  isOpen: boolean
  onClose: () => void
  card: { question: string; answer: string } | null
}

/**
 * Zeigt einen versionierten & komprimierten QR-Code für genau eine Karte.
 * - HTML-Inhalte der Karte werden unverändert als questionHtml/answerHtml in die Payload übernommen
 * - PNG-Download & Payload-Kopierfunktion für Debug/Support
 */
export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  card,
}) => {
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // ESC schließt Modal
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const payload = useMemo(() => {
    if (!card) return ''
    // Wir nehmen an, dass question/answer bereits HTML-Strings sind (Rich-Text-Editor)
    return encodeCardPayload({
      questionHtml: card.question,
      answerHtml: card.answer,
    })
  }, [card])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payload)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignorieren; kein Toast hier, UI bleibt simpel
    }
  }

  const handleDownloadPng = () => {
    // QRCodeCanvas rendert ein <canvas/> als erstes Kindelement
    const canvas =
      containerRef.current?.querySelector('canvas') ??
      document.querySelector<HTMLCanvasElement>('#qr-canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'karte-qr.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  if (!isOpen || !card) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="QR-Code für Karte"
      style={styles.backdrop}
      onClick={onClose}
    >
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>QR-Code für diese Karte</h3>
          <button
            aria-label="Schließen"
            onClick={onClose}
            style={styles.iconButton}
          >
            <MdClose size={22} />
          </button>
        </div>

        <div style={styles.body}>
          <div ref={containerRef} style={styles.qrWrap}>
            <QRCodeCanvas
              id="qr-canvas"
              value={payload}
              size={256}
              includeMargin
              level="M" // M oder Q für bessere Fehlertoleranz
            />
          </div>

          <div style={styles.actions}>
            <Button
              onClick={handleCopy}
              aria-label="Payload in Zwischenablage kopieren"
            >
              <MdContentCopy style={{ marginRight: 6 }} />
              {copied ? 'Kopiert' : 'Payload kopieren'}
            </Button>
            <Button
              onClick={handleDownloadPng}
              aria-label="QR als PNG speichern"
            >
              <MdFileDownload style={{ marginRight: 6 }} />
              Als PNG speichern
            </Button>
          </div>

          <div style={styles.hint}>
            Bester Scan bei guter Ausleuchtung und ausreichend großem QR-Code
          </div>

          <details style={styles.details}>
            <summary style={styles.summary}>Debug: Payload ansehen</summary>
            <pre style={styles.pre}>{payload}</pre>
          </details>
        </div>
      </div>
    </div>
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
    width: 'min(92vw, 560px)',
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
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    borderRadius: 8,
  },
  body: {
    padding: 16,
  },
  qrWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    background: '#fff',
    borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.06)',
  },
  actions: {
    marginTop: 12,
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.8,
  },
  details: {
    marginTop: 10,
    background: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    padding: 8,
  },
  summary: {
    cursor: 'pointer',
    fontWeight: 600,
    marginBottom: 6,
  },
  pre: {
    maxHeight: 160,
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    margin: 0,
    fontSize: 12,
    lineHeight: 1.4,
  },
}

export default QRCodeModal
