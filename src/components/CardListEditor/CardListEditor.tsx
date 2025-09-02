import React, { useState, useRef } from 'react'
import Papa from 'papaparse'
import DOMPurify from 'dompurify'
import { Button } from '../Button/Button'
import { type Card as CardType } from '../../context/DeckContext'
import { MdEdit, MdDelete, MdSave, MdCancel, MdQrCode } from 'react-icons/md'
import BatchQRCodeModal from '../QR/BatchQRCodeModal'
import FrontBackEditor from '../common/FrontBackEditor.tsx'
import SafeHtmlRenderer from '../common/SafeHtmlRenderer.tsx'
import './CardListEditor.css'
import { sanitizeCsvImport } from '../../utils/csvSafe'


type CardListEditorProps = {
  deckId: string
  cards: CardType[]
  onAddCard: (
    deckId: string,
    cardData: { questionHtml: string; answerHtml: string }
  ) => void
  onDeleteCard: (deckId: string, cardId: string) => void
  onUpdateCard: (
    deckId: string,
    cardId: string,
    updatedData: { questionHtml: string; answerHtml: string }
  ) => void
  addMultipleCardsToDeck: (
    deckId: string,
    newCardsData: { questionHtml: string; answerHtml: string }[]
  ) => void
  sortCriteria: string
  setSortCriteria: (value: string) => void
}

// ——— Hilfen ———
const isContentEmpty = (html: string) => {
  if (!html) return true
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = clean
  return (tempDiv.textContent || '').trim() === ''
}

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const wrapPlainAsHtml = (text: string) => `<p>${escapeHtml(text)}</p>`

export const CardListEditor: React.FC<CardListEditorProps> = ({
  deckId,
  cards,
  onAddCard,
  onDeleteCard,
  onUpdateCard,
  addMultipleCardsToDeck,
  sortCriteria,
  setSortCriteria,
}) => {
  // --- State: neue Karte anlegen (HTML) ---
  const [newQuestionHtml, setNewQuestionHtml] = useState<string>('')
  const [newAnswerHtml, setNewAnswerHtml] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ▼▼▼ Multi-Select via QR-Icon
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [batchOpen, setBatchOpen] = useState(false)

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const clearSelection = () => setSelectedIds(new Set())
  const selectAllVisible = () => setSelectedIds(new Set(cards.map((c) => c.id)))

  const selectedItems = React.useMemo(
    () =>
      cards
        .filter((c) => selectedIds.has(c.id))
        .map((c) => ({
          questionHtml:
            (c as any).questionHtml ??
            wrapPlainAsHtml((c as any).question ?? ''),
          answerHtml:
            (c as any).answerHtml ?? wrapPlainAsHtml((c as any).answer ?? ''),
        })),
    [cards, selectedIds]
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !deckId) return

    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      delimiter: ';',
      transformHeader: (h) => (h ?? '').toString().trim().toLowerCase(),
      complete: ({ data, errors }) => {
        if (errors?.length) {
          alert(`CSV wurde mit ${errors.length} Parsing-Hinweisen gelesen`)
          // wir fahren fort und filtern ungültige Zeilen heraus
        }

        // 1) Rohzeilen säubern (Formula-Injection, Steuerzeichen)
        const rows = (data || []).filter(Boolean) as Record<string, unknown>[]
        const safeRows = sanitizeCsvImport(rows)

        // 2) Spalten-Mapping mit Fallbacks
        const newCardsData: { questionHtml: string; answerHtml: string }[] = []
        for (const r of safeRows) {
          const qHtml =
            typeof r['questionhtml'] === 'string'
              ? (r['questionhtml'] as string)
              : typeof r['question'] === 'string'
                ? wrapPlainAsHtml(r['question'] as string)
                : typeof r['front'] === 'string'
                  ? wrapPlainAsHtml(r['front'] as string)
                  : ''
          const aHtml =
            typeof r['answerhtml'] === 'string'
              ? (r['answerhtml'] as string)
              : typeof r['answer'] === 'string'
                ? wrapPlainAsHtml(r['answer'] as string)
                : typeof r['back'] === 'string'
                  ? wrapPlainAsHtml(r['back'] as string)
                  : ''

          if (!isContentEmpty(qHtml) && !isContentEmpty(aHtml)) {
            newCardsData.push({ questionHtml: qHtml, answerHtml: aHtml })
          }
        }

        if (newCardsData.length === 0) {
          alert('Keine gültigen Karten gefunden. Erwartete Spalten: question|answer bzw. questionHtml|answerHtml')
          return
        }

        // 3) Batch-Anlage
        addMultipleCardsToDeck(deckId, newCardsData)

        // 4) Input zurücksetzen
        if (event.target) event.target.value = ''
        alert(`${newCardsData.length} Karten wurden erfolgreich importiert.`)
      },
      error: () => {
        alert('Die CSV-Datei konnte nicht verarbeitet werden.')
      },
    })
  }


  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isContentEmpty(newQuestionHtml) || isContentEmpty(newAnswerHtml)) {
      alert('Bitte fülle beide Felder aus.')
      return
    }
    onAddCard(deckId, {
      questionHtml: newQuestionHtml,
      answerHtml: newAnswerHtml,
    })
    setNewQuestionHtml('')
    setNewAnswerHtml('')
  }

  // --- State: Karte bearbeiten ---
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [editedCardData, setEditedCardData] = useState<{
    questionHtml: string
    answerHtml: string
  }>({
    questionHtml: '',
    answerHtml: '',
  })

  const handleEditClick = (card: CardType) => {
    setEditingCardId(card.id)
    setEditedCardData({
      questionHtml:
        (card as any).questionHtml ??
        wrapPlainAsHtml((card as any).question ?? ''),
      answerHtml:
        (card as any).answerHtml ?? wrapPlainAsHtml((card as any).answer ?? ''),
    })
  }

  const handleCancelClick = () => {
    setEditingCardId(null)
    setEditedCardData({ questionHtml: '', answerHtml: '' })
  }

  const handleSaveClick = (cardId: string) => {
    if (
      isContentEmpty(editedCardData.questionHtml) ||
      isContentEmpty(editedCardData.answerHtml)
    ) {
      alert('Frage und Antwort dürfen nicht leer sein.')
      return
    }
    onUpdateCard(deckId, cardId, editedCardData)
    setEditingCardId(null)
    setEditedCardData({ questionHtml: '', answerHtml: '' })
  }

  const [isAddFormVisible, setIsAddFormVisible] = useState(false)
  const [isCardListVisible, setIsCardListVisible] = useState(false)

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".csv"
        onChange={handleFileChange}
      />

      {/* ---------- Neue Karte hinzufügen ---------- */}
      <div className="card-management-area">
        <h2
          style={{ cursor: 'pointer', margin: '0 0 1rem 0' }}
          onClick={() => setIsAddFormVisible(!isAddFormVisible)}
        >
          Neue Karte hinzufügen {isAddFormVisible ? '▲' : '▼'}
        </h2>

        {isAddFormVisible && (
          <form onSubmit={handleAddSubmit} className="add-card-form space-y-4">
            <FrontBackEditor
              frontHtml={newQuestionHtml}
              backHtml={newAnswerHtml}
              onChangeFront={(html: string) => setNewQuestionHtml(html)}
              onChangeBack={(html: string) => setNewAnswerHtml(html)}
            />

            <div
              className="form-actions"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '0.5rem',
              }}
            >
              <Button
                type="submit"
                variant="primary"
                aria-label="Karte hinzufügen"
              >
                Karte hinzufügen
              </Button>
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Aus CSV importieren"
              >
                Aus CSV importieren
              </Button>
              <a
                href={import.meta.env.BASE_URL + "import_template.csv"}
                download="import_vorlage.csv"
                className="link-secondary hide-on-mobile"
              >
                Vorlage
              </a>
            </div>
          </form>
        )}
      </div>

      <hr className="section-divider" />

      {/* ---------- Kartenliste ---------- */}
      <div className="card-list-area">
        <h2
          style={{ cursor: 'pointer', margin: '0 0 1rem 0' }}
          onClick={() => setIsCardListVisible(!isCardListVisible)}
        >
          Karten in diesem Deck ({cards.length}) {isCardListVisible ? '▲' : '▼'}
        </h2>

        {isCardListVisible && (
          <>
            {/* Sortierung */}
            <div className="sort-controls">
              <label>Sortieren nach:</label>
              <div className="sort-buttons-group">
                <Button
                  onClick={() => setSortCriteria('default')}
                  variant={sortCriteria === 'default' ? 'primary' : 'text'}
                  aria-label="Sortierung zurücksetzen"
                >
                  Standard
                </Button>
                <Button
                  onClick={() => setSortCriteria('question-asc')}
                  variant={sortCriteria === 'question-asc' ? 'primary' : 'text'}
                  aria-label="Nach Vorderseite sortieren"
                >
                  VS
                </Button>
                <Button
                  onClick={() => setSortCriteria('answer-asc')}
                  variant={sortCriteria === 'answer-asc' ? 'primary' : 'text'}
                  aria-label="Nach Rückseite sortieren"
                >
                  RS
                </Button>
                <Button
                  onClick={() => setSortCriteria('level-asc')}
                  variant={sortCriteria === 'level-asc' ? 'primary' : 'text'}
                  aria-label="Nach Stufe sortieren"
                >
                  Stufe
                </Button>
              </div>
            </div>

            {/* Auswahl-Toolbar */}
            <div
              className="selection-toolbar"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                margin: '0.5rem 0 0.75rem',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: 14, opacity: 0.9 }}>
                Ausgewählt: <strong>{selectedIds.size}</strong>
              </span>

              <span style={{ flex: 1 }} />

              <Button
                onClick={selectAllVisible}
                aria-label="Alle sichtbaren Karten auswählen"
              >
                Alle auswählen
              </Button>
              <Button onClick={clearSelection} aria-label="Auswahl leeren">
                Auswahl leeren
              </Button>
              <Button
                onClick={() => setBatchOpen(true)}
                variant="primary"
                aria-label="Auswahl als QR teilen"
                disabled={selectedItems.length === 0}
              >
                <MdQrCode style={{ marginRight: 6 }} />
                Auswahl als QR teilen
              </Button>
            </div>

            <ul className="card-list">
              {cards.length > 0 ? (
                cards.map((card) => {
                  const questionHtml =
                    (card as any).questionHtml ??
                    wrapPlainAsHtml((card as any).question ?? '')
                  const answerHtml =
                    (card as any).answerHtml ??
                    wrapPlainAsHtml((card as any).answer ?? '')
                  const isSelected = selectedIds.has(card.id)

                  return (
                    <li key={card.id} className="card-list-item">
                      {editingCardId === card.id ? (
                        <>
                          <div className="card-info-edit unified-edit">
                            <FrontBackEditor
                              frontHtml={editedCardData.questionHtml}
                              backHtml={editedCardData.answerHtml}
                              onChangeFront={(html: string) =>
                                setEditedCardData((p) => ({
                                  ...p,
                                  questionHtml: html,
                                }))
                              }
                              onChangeBack={(html: string) =>
                                setEditedCardData((p) => ({
                                  ...p,
                                  answerHtml: html,
                                }))
                              }
                            />
                            <div className="edit-actions-row">
                              <Button
                                onClick={() => handleSaveClick(card.id)}
                                variant="success"
                                aria-label="Speichern"
                              >
                                <MdSave /> Speichern
                              </Button>
                              <Button
                                onClick={handleCancelClick}
                                variant="secondary"
                                aria-label="Abbrechen"
                              >
                                <MdCancel /> Abbrechen
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="card-info unified">
                            <div className="face">
                              <div className="face-header">
                                <strong>Vorderseite (VS)</strong>
                              </div>
                              <div className="face-content">
                                <SafeHtmlRenderer htmlContent={questionHtml} />
                              </div>
                            </div>
                            <div className="face">
                              <div className="face-header">
                                <strong>Rückseite (RS)</strong>
                              </div>
                              <div className="face-content">
                                <SafeHtmlRenderer htmlContent={answerHtml} />
                              </div>
                            </div>
                          </div>

                          <div className="card-actions">
                            {'level' in card && (
                              <span className="card-level">
                                Stufe: {(card as any).level}
                              </span>
                            )}

                            {/* QR-Icon toggelt Auswahl-Pool */}
                            <Button
                              onClick={() => toggleSelect(card.id)}
                              variant={isSelected ? 'success' : 'secondary'}
                              isIconOnly
                              aria-label={
                                isSelected
                                  ? 'Aus QR-Pool entfernen'
                                  : 'Zum QR-Pool hinzufügen'
                              }
                            >
                              <MdQrCode />
                            </Button>

                            <Button
                              onClick={() => handleEditClick(card)}
                              variant="success"
                              isIconOnly
                              aria-label="Bearbeiten"
                            >
                              <MdEdit />
                            </Button>
                            <Button
                              onClick={() => onDeleteCard(deckId, card.id)}
                              variant="danger"
                              isIconOnly
                              aria-label="Löschen"
                            >
                              <MdDelete />
                            </Button>
                          </div>
                        </>
                      )}
                    </li>
                  )
                })
              ) : (
                <p>Es sind noch keine Karten vorhanden.</p>
              )}
            </ul>
          </>
        )}
      </div>

      {/* Batch-QR Modal */}
      <BatchQRCodeModal
        isOpen={batchOpen}
        onClose={() => {
          setBatchOpen(false)
          // Immer: Auswahl nach Export (bzw. nach Schließen des Modals) leeren
          clearSelection()
        }}
        items={selectedItems}
      />
    </>
  )
}
