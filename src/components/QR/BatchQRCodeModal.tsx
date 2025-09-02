// src/components/QR/BatchQRCodeModal.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { encodeBatchPayload } from '../../utils/qrCodec'
import { Button } from '../Button/Button'
import { jsPDF } from 'jspdf'
import { createRoot } from 'react-dom/client'
import {
  MdClose,
  MdChevronLeft,
  MdChevronRight,
  MdContentCopy,
  MdFileDownload,
  MdPictureAsPdf,
} from 'react-icons/md'

type Item = { questionHtml: string; answerHtml: string }

type BatchQRCodeModalProps = {
  isOpen: boolean
  onClose: () => void
  items: Item[]
}

const MAX_QR_TEXT_LEN = 2500

const BatchQRCodeModal: React.FC<BatchQRCodeModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const [page, setPage] = useState(0)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const payloadRef = useRef<HTMLTextAreaElement | null>(null)
  const [busy, setBusy] = useState<null | 'pdf-one' | 'pdf-all'>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setPage((p) => Math.max(0, p - 1))
      if (e.key === 'ArrowRight')
        setPage((p) => Math.min(payloads.length - 1, p + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const hasItems = items && items.length > 0

  // Items in Seiten aufteilen
  const pages: Item[][] = useMemo(() => {
    if (!hasItems) return []
    const res: Item[][] = []
    let current: Item[] = []
    const pushCurrent = () => {
      if (current.length) res.push(current)
      current = []
    }

    for (const it of items) {
      const trial = [...current, it]
      const enc = encodeBatchPayload(trial)
      if (enc.length > MAX_QR_TEXT_LEN) {
        if (current.length === 0) {
          res.push([it])
          current = []
        } else {
          pushCurrent()
          current = [it]
        }
      } else {
        current = trial
      }
    }
    pushCurrent()
    return res
  }, [items, hasItems])

  const payloads = useMemo(
    () => (pages.length ? pages.map((pg) => encodeBatchPayload(pg)) : []),
    [pages]
  )

  useEffect(() => {
    setPage(0)
  }, [items.length])
  useEffect(() => {
    if (page > 0 && page > payloads.length - 1)
      setPage(Math.max(0, payloads.length - 1))
  }, [page, payloads.length])

  if (!isOpen) return null

  const total = payloads.length
  const value = total ? payloads[page] : ''
  const countCurrent = total ? (pages[page]?.length ?? 0) : 0

  const handleCopy = async () => {
    if (!total) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* noop */
    }
  }

  // Debug-Kopieren (Textarea)
  const handleCopyInDebug = async () => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* noop */
    }
  }

  const getVisibleCanvas = () =>
    containerRef.current?.querySelector('canvas') ??
    document.querySelector<HTMLCanvasElement>('#batch-qr-canvas')

  const handleDownloadPng = () => {
    if (!total) return
    const canvas = getVisibleCanvas()
    if (!canvas) return
    const link = document.createElement('a')
    link.download =
      total > 1 ? `karten-qr-${page + 1}-von-${total}.png` : 'karten-qr.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  // A4-Konstanten (mm)
  const pageW = 210,
    pageH = 297
  const qrSizeMm = 120
  const posX = (pageW - qrSizeMm) / 2
  const posY = (pageH - qrSizeMm) / 2

  const handleDownloadPdf = () => {
    if (!total) return
    const canvas = getVisibleCanvas()
    if (!canvas) return
    setBusy('pdf-one')
    try {
      const dataUrl = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      })
      pdf.setFontSize(12)
      pdf.text(
        total > 1
          ? `LernBox QR – Seite ${page + 1} von ${total}`
          : 'LernBox QR',
        pageW / 2,
        15,
        { align: 'center' }
      )
      pdf.addImage(dataUrl, 'PNG', posX, posY, qrSizeMm, qrSizeMm)
      const filename =
        total > 1 ? `karten-qr-${page + 1}-von-${total}.pdf` : 'karten-qr.pdf'
      pdf.save(filename)
    } finally {
      setBusy(null)
    }
  }

  // Offscreen QR rendern → DataURL
  const renderQrDataUrl = (payload: string, sizePx = 640): Promise<string> =>
    new Promise((resolve) => {
      const host = document.createElement('div')
      host.style.position = 'fixed'
      host.style.left = '-10000px'
      host.style.top = '-10000px'
      document.body.appendChild(host)
      const root = createRoot(host)
      root.render(
        <QRCodeCanvas value={payload} size={sizePx} includeMargin level="Q" />
      )
      requestAnimationFrame(() => {
        const canvas = host.querySelector('canvas') as HTMLCanvasElement | null
        const url = canvas ? canvas.toDataURL('image/png') : ''
        root.unmount()
        host.remove()
        resolve(url)
      })
    })

  const handleDownloadPdfAll = async () => {
    if (!total) return
    setBusy('pdf-all')
    try {
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      })
      for (let i = 0; i < payloads.length; i++) {
        if (i > 0) pdf.addPage()
        pdf.setFontSize(12)
        pdf.text(
          `LernBox QR – Seite ${i + 1} von ${payloads.length}`,
          pageW / 2,
          15,
          { align: 'center' }
        )
        const dataUrl = await renderQrDataUrl(payloads[i], 640)
        if (dataUrl)
          pdf.addImage(dataUrl, 'PNG', posX, posY, qrSizeMm, qrSizeMm)
        else {
          pdf.setFontSize(10)
          pdf.text('Fehler beim Rendern der QR-Grafik.', pageW / 2, pageH / 2, {
            align: 'center',
          })
        }
      }
      const filename = `karten-qr-${payloads.length}-seiten.pdf`
      pdf.save(filename)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ausgewählte Karten als QR"
      style={styles.backdrop}
      onClick={onClose}
    >
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            {!hasItems
              ? 'Keine Auswahl'
              : total > 1
                ? `QR-Paket (${page + 1}/${total})`
                : 'QR für ausgewählte Karten'}
          </h3>
          <button
            aria-label="Schließen"
            onClick={onClose}
            style={styles.iconButton}
          >
            <MdClose size={22} />
          </button>
        </div>

        <div style={styles.body}>
          {!hasItems ? (
            <>
              <div style={styles.info}>
                Es wurden <strong>keine Karten</strong> ausgewählt. Bitte wähle
                in der Liste eine oder mehrere Karten aus und öffne das Modal
                erneut.
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onClose} aria-label="Schließen">
                  Schließen
                </Button>
              </div>
            </>
          ) : (
            <>
              <div style={styles.info}>
                {items.length} Karte{items.length === 1 ? '' : 'n'} ausgewählt.
                {total > 1 ? (
                  <>
                    {' '}
                    Aufgrund der Größe in <strong>{total}</strong> QR-Seiten
                    aufgeteilt. <strong>Bitte alle Seiten scannen!</strong>
                  </>
                ) : (
                  <> Alle passen in einen QR.</>
                )}{' '}
                Pro Seite: <strong>{countCurrent}</strong>
              </div>

              {/* QR + Pager */}
              <div style={styles.qrArea}>
                <button
                  aria-label="Vorherige Seite"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  style={{
                    ...styles.pagerBtn,
                    visibility: total > 1 && page > 0 ? 'visible' : 'hidden',
                  }}
                >
                  <MdChevronLeft size={22} />
                </button>

                <div ref={containerRef} style={styles.qrWrap}>
                  <QRCodeCanvas
                    id="batch-qr-canvas"
                    value={value}
                    size={640}
                    includeMargin
                    level="Q"
                    style={{ width: 320, height: 320, display: 'block' }}
                  />
                </div>

                <button
                  aria-label="Nächste Seite"
                  onClick={() => setPage((p) => Math.min(total - 1, p + 1))}
                  style={{
                    ...styles.pagerBtn,
                    visibility:
                      total > 1 && page < total - 1 ? 'visible' : 'hidden',
                  }}
                >
                  <MdChevronRight size={22} />
                </button>
              </div>

              {/* Aktionen */}
              <div style={styles.actions}>
                <Button
                  onClick={handleCopy}
                  aria-label="QR-Payload kopieren"
                  disabled={!total || !!busy}
                >
                  <MdContentCopy style={{ marginRight: 6 }} />
                  {copied ? 'Kopiert' : 'Payload kopieren'}
                </Button>
                <Button
                  onClick={handleDownloadPng}
                  aria-label="QR als PNG speichern"
                  disabled={!total || !!busy}
                >
                  <MdFileDownload style={{ marginRight: 6 }} />
                  Als PNG speichern
                </Button>
                <Button
                  onClick={handleDownloadPdf}
                  aria-label="QR als PDF speichern"
                  disabled={!total || !!busy}
                >
                  <MdPictureAsPdf style={{ marginRight: 6 }} />
                  Als PDF speichern (diese Seite)
                </Button>
                {total > 1 && (
                  <Button
                    onClick={handleDownloadPdfAll}
                    aria-label="Alle Seiten als ein PDF speichern"
                    disabled={!!busy}
                  >
                    <MdPictureAsPdf style={{ marginRight: 6 }} />
                    Alle Seiten als PDF
                  </Button>
                )}
                {busy && (
                  <span style={{ fontSize: 12, opacity: 0.7 }}>
                    Erzeuge PDF…
                  </span>
                )}
              </div>

              {/* Debug */}
              <details style={styles.details}>
                <summary style={styles.summary}>
                  Debug: Aktuelle Payload
                </summary>

                <div style={styles.debugRow}>
                  <Button
                    onClick={handleCopyInDebug}
                    aria-label="Payload in Zwischenablage kopieren"
                  >
                    <MdContentCopy style={{ marginRight: 6 }} />
                    {copied ? 'Kopiert' : 'Kopieren'}
                  </Button>
                  <span style={{ fontSize: 12, opacity: 0.7 }}>
                    Tipp: Klick ins Feld markiert alles.
                  </span>
                </div>

                <textarea
                  ref={payloadRef}
                  value={value}
                  readOnly
                  onFocus={(e) => e.currentTarget.select()}
                  onClick={(e) =>
                    (e.currentTarget as HTMLTextAreaElement).select()
                  }
                  style={styles.payloadBox}
                />
              </details>
            </>
          )}
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
    width: 'min(96vw, 720px)',
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
  info: { marginBottom: 10, fontSize: 14, opacity: 0.9 },
  qrArea: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 40px',
    alignItems: 'center',
    gap: 8,
  },
  pagerBtn: {
    height: 40,
    width: 40,
    borderRadius: 10,
    border: '1px solid rgba(0,0,0,0.08)',
    background: 'rgba(0,0,0,0.02)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
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
  actions: { marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' },
  details: {
    marginTop: 10,
    background: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    padding: 8,
  },
  summary: { cursor: 'pointer', fontWeight: 600, marginBottom: 6 },
  debugRow: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 },
  payloadBox: {
    width: '100%',
    minHeight: 120,
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    fontSize: 12,
    lineHeight: 1.4,
    padding: 8,
    borderRadius: 8,
    border: '1px solid rgba(0,0,0,0.12)',
    background: 'rgba(0,0,0,0.02)',
    color: 'inherit',
    resize: 'vertical',
  },
}

export default BatchQRCodeModal
