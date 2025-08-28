import React, { useState, useRef } from "react"
import Papa from "papaparse"
import { Button } from "../Button/Button"
import { type Card as CardType } from "../../context/DeckContext"
import { MdEdit, MdDelete, MdSave, MdCancel } from "react-icons/md"
import FrontBackEditor from "../common/FrontBackEditor.tsx"
import "./CardListEditor.css"

type CardListEditorProps = {
  deckId: string
  cards: CardType[]
  onAddCard: (
    deckId: string,
    cardData: { question: string; answer: string }
  ) => void
  onDeleteCard: (deckId: string, cardId: string) => void
  onUpdateCard: (
    deckId: string,
    cardId: string,
    updatedData: { question: string; answer: string }
  ) => void
  addMultipleCardsToDeck: (
    deckId: string,
    newCardsData: { question: string; answer: string }[]
  ) => void
  sortCriteria: string
  setSortCriteria: (value: string) => void
}

// Editor-Content leer?
const isContentEmpty = (content: string) => {
  if (!content) return true
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = content
  return (tempDiv.textContent || "").trim() === ""
}

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
  // --- State: neue Karte anlegen ---
  const [newQuestion, setNewQuestion] = useState<string>("")
  const [newAnswer, setNewAnswer] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !deckId) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ";",
      complete: (results) => {
        const newCardsData: { question: string; answer: string }[] = []
        results.data.forEach((row: unknown) => {
          const cardData = row as { question?: string; answer?: string }
          if (cardData.question && cardData.answer) {
            newCardsData.push({
              question: cardData.question,
              answer: cardData.answer,
            })
          }
        })
        if (newCardsData.length > 0) {
          addMultipleCardsToDeck(deckId, newCardsData)
          alert(`${newCardsData.length} Karten wurden erfolgreich importiert.`)
        } else {
          alert("Keine gültigen Karten in der Datei gefunden.")
        }
        if (event.target) event.target.value = ""
      },
      error: (error) => {
        console.error("Fehler beim Parsen der CSV-Datei:", error)
        alert("Die CSV-Datei konnte nicht verarbeitet werden.")
      },
    })
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isContentEmpty(newQuestion) || isContentEmpty(newAnswer)) {
      alert("Bitte füllen Sie beide Felder aus.")
      return
    }
    onAddCard(deckId, { question: newQuestion, answer: newAnswer })
    setNewQuestion("")
    setNewAnswer("")
  }

  // --- State: Karte bearbeiten ---
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [editedCardData, setEditedCardData] = useState<{ question: string; answer: string }>({
    question: "",
    answer: "",
  })

  const handleEditClick = (card: CardType) => {
    setEditingCardId(card.id)
    setEditedCardData({ question: card.question, answer: card.answer })
  }

  const handleCancelClick = () => {
    setEditingCardId(null)
    setEditedCardData({ question: "", answer: "" })
  }

  const handleSaveClick = (cardId: string) => {
    if (isContentEmpty(editedCardData.question) || isContentEmpty(editedCardData.answer)) {
      alert("Frage und Antwort dürfen nicht leer sein.")
      return
    }
    onUpdateCard(deckId, cardId, editedCardData)
    setEditingCardId(null)
    setEditedCardData({ question: "", answer: "" })
  }

  const [isAddFormVisible, setIsAddFormVisible] = useState(false)
  const [isCardListVisible, setIsCardListVisible] = useState(false)

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".csv"
        onChange={handleFileChange}
      />

      {/* ---------- Neue Karte hinzufügen ---------- */}
      <div className="card-management-area">
        <h2
          style={{ cursor: "pointer", margin: "0 0 1rem 0" }}
          onClick={() => setIsAddFormVisible(!isAddFormVisible)}
        >
          Neue Karte hinzufügen {isAddFormVisible ? "▲" : "▼"}
        </h2>

        {isAddFormVisible && (
          <form onSubmit={handleAddSubmit} className="add-card-form space-y-4">
            {/* VORDER- & RÜCKSEITE als Karten-Eingabefeld */}
            <FrontBackEditor
              frontHtml={newQuestion}
              backHtml={newAnswer}
              onChangeFront={(html: string) => setNewQuestion(html)}
              onChangeBack={(html: string) => setNewAnswer(html)}
            />

            <div
              className="form-actions"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginTop: "0.5rem",
              }}
            >
              <Button type="submit" variant="primary" aria-label="Karte hinzufügen">
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
                href="/LernBox/import_template.csv"
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
          style={{ cursor: "pointer", margin: "0 0 1rem 0" }}
          onClick={() => setIsCardListVisible(!isCardListVisible)}
        >
          Karten in diesem Deck ({cards.length}) {isCardListVisible ? "▲" : "▼"}
        </h2>

        {isCardListVisible && (
          <>
            {/* Sortierung */}
            <div className="sort-controls">
              <label>Sortieren nach:</label>
              <div className="sort-buttons-group">
                <Button
                  onClick={() => setSortCriteria("default")}
                  variant={sortCriteria === "default" ? "primary" : "text"}
                  aria-label="Sortierung zurücksetzen"
                >
                  Standard
                </Button>
                <Button
                  onClick={() => setSortCriteria("question-asc")}
                  variant={sortCriteria === "question-asc" ? "primary" : "text"}
                  aria-label="Nach Frage sortieren"
                >
                  VS
                </Button>
                <Button
                  onClick={() => setSortCriteria("answer-asc")}
                  variant={sortCriteria === "answer-asc" ? "primary" : "text"}
                  aria-label="Nach Antwort sortieren"
                >
                  RS
                </Button>
                <Button
                  onClick={() => setSortCriteria("level-asc")}
                  variant={sortCriteria === "level-asc" ? "primary" : "text"}
                  aria-label="Nach Stufe sortieren"
                >
                  Stufe
                </Button>
              </div>
            </div>

            <ul className="card-list">
              {cards.length > 0 ? (
                cards.map((card) => (
                  <li key={card.id} className="card-list-item">
                    {editingCardId === card.id ? (
                      <>
                        {/* Bearbeitungsmodus: beide Seiten als Karten-Eingabe */}
                        <div className="card-info-edit">
                          <FrontBackEditor
                            frontHtml={editedCardData.question}
                            backHtml={editedCardData.answer}
                            onChangeFront={(html: string) =>
                              setEditedCardData((p) => ({ ...p, question: html }))
                            }
                            onChangeBack={(html: string) =>
                              setEditedCardData((p) => ({ ...p, answer: html }))
                            }
                          />
                        </div>

                        <div className="card-actions">
                          <Button
                            onClick={() => handleSaveClick(card.id)}
                            variant="success"
                            isIconOnly
                            aria-label="Speichern"
                          >
                            <MdSave />
                          </Button>
                          <Button
                            onClick={handleCancelClick}
                            variant="secondary"
                            isIconOnly
                            aria-label="Abbrechen"
                          >
                            <MdCancel />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="card-info">
                          <div dangerouslySetInnerHTML={{ __html: `<strong>VS:</strong> ${card.question}` }} />
                          <div dangerouslySetInnerHTML={{ __html: `<strong>RS:</strong> ${card.answer}` }} />
                        </div>
                        <div className="card-actions">
                          <span className="card-level">Stufe: {card.level}</span>
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
                ))
              ) : (
                <p>Es sind noch keine Karten vorhanden.</p>
              )}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
