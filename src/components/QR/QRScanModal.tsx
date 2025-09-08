// src/components/QR/QRScanModal.tsx
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../Button/Button'
import { MdClose, MdError } from 'react-icons/md'
import {
  decodeAnyPayload,
  isLikelyQrCardPayloadText,
} from '../../utils/qrCodec'
import { Scanner } from '@yudiel/react-qr-scanner'
import './QRScanModal.css'  // ⬅️ neu

type CardData = { questionHtml: string; answerHtml: string }

type QRScanModalProps = {
  isOpen: boolean
  onClose: () => void
  mode?: 'single' | 'multi'
  onSuccess?: (data: CardData) => void
  onSuccessMany?: (items: CardData[]) => void
  throttleMs?: number
}

const ScannerAny = Scanner as unknown as React.ComponentType<any>

const QRScanModal: React.FC<QRScanModalProps> = ({
  isOpen,
  onClose,
  mode = 'single',
  onSuccess,
  onSuccessMany,
  throttleMs = 700,
}) => {
  const [error, setError] = useState<string | null>(null)
  const handledRef = useRef(false)
  const lastHandledAt = useRef(0)
  const [items, setItems] = useState<CardData[]>([])

  useEffect(() => {
    if (!isOpen) {
      handledRef.current = false
      setError(null)
      setItems([])
      lastHandledAt.current = 0
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const addItem = (data: CardData) => setItems((p) => [...p, data])
  const addMany = (arr: CardData[]) => setItems((p) => [...p, ...arr])

  const decodeAndHandle = (text: string) => {
    if (!text) return
    const now = Date.now()
    if (now - lastHandledAt.current < throttleMs) return
    lastHandledAt.current = now

    if (!isLikelyQrCardPayloadText(text)) {
      setError('Unbekanntes QR-Format. Erwartet wird eine LernBox-Payload mit Präfix LB1:.')
      return
    }

    const res = decodeAnyPayload(text)
    if (!res.ok) {
      setError(res.error)
      return
    }

    if (res.kind === 'single') {
      const data: CardData = {
        questionHtml: res.payload.questionHtml,
        answerHtml: res.payload.answerHtml,
      }
      if (mode === 'single') {
        if (handledRef.current) return
        handledRef.current = true
        onSuccess?.(data)
      } else {
        addItem(data)
      }
      return
    }

    // batch
    const batchItems: CardData[] = res.payload.items.map((it) => ({
      questionHtml: it.questionHtml,
      answerHtml: it.answerHtml,
    }))

    if (mode === 'single') {
      if (handledRef.current) return
      handledRef.current = true
      onSuccessMany ? onSuccessMany(batchItems) : onSuccess?.(batchItems[0])
    } else {
      addMany(batchItems)
    }
  }

  const handleError = (err?: unknown) => {
    const msg =
      typeof err === 'string'
        ? err
        : (err as any)?.message || 'Kamera konnte nicht gestartet werden'
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
    <div className="qr-backdrop" role="dialog" aria-modal="true" aria-label="Karte(n) via QR-Code hinzufügen" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-header">
          <h3 className="qr-title">
            {multi ? 'Mehrere Karten via QR-Code hinzufügen' : 'Karte via QR-Code hinzufügen'}
          </h3>
          <button aria-label="Schließen" onClick={onClose} className="qr-icon-btn">
            <MdClose size={22} />
          </button>
        </div>

        <div className="qr-body">
          {/* Kamera */}
          <div className="qr-scanner">
            <ScannerAny
              onResult={(res: any) => {
                let text = ''
                if (typeof res === 'string') text = res
                else if (Array.isArray(res)) text = res[0]?.rawValue ?? ''
                else if (res && typeof res === 'object')
                  text = (res as any).rawValue ?? (res as any).text ?? ''
                if (text) decodeAndHandle(text)
              }}
              onDecode={(text: string) => decodeAndHandle(text)}
              onScan={(text: string) => decodeAndHandle(text)}
              onError={handleError}
              constraints={{ facingMode: 'environment' }}
            />
          </div>

          {error && (
            <div className="qr-error" role="alert">
              <MdError style={{ marginRight: 6 }} />
              <span>{error}</span>
            </div>
          )}

          {multi && (
            <div className="qr-multi-info">
              <div>
                Gesammelt: <strong>{items.length}</strong> Karte{items.length === 1 ? '' : 'n'}
              </div>
              <div className="qr-mini-list">
                {items.slice(-3).map((it, i) => (
                  <div key={i} className="qr-mini-item">
                    <span className="qr-mini-text">
                      {stripText(it.questionHtml).slice(0, 48) || 'VS …'} —{' '}
                      {stripText(it.answerHtml).slice(0, 48) || 'RS …'}
                    </span>
                  </div>
                ))}
                {items.length > 3 && <div className="qr-mini-more">…</div>}
              </div>
            </div>
          )}

          <details className="qr-details">
            <summary className="qr-summary">Kein Kamerazugriff? Payload einfügen</summary>
            <ManualPaste onManualSubmit={handleManual} />
          </details>

          <div className="qr-hint">Tipp: Gute Ausleuchtung und ruhige Hand verbessern die Erkennungsrate</div>

          <div className="qr-footer">
            {multi && (
              <div className="qr-footer-left">
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
  const [text, setText] = useState('')
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onManualSubmit(text)
    setText('')
  }
  return (
    <form onSubmit={handleSubmit} className="qr-form">
      <textarea
        className="qr-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="LB1:… hier einfügen"
      />
      <div className="qr-form-actions">
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

export default QRScanModal
