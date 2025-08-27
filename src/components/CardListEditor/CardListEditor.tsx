import React, { useState, useRef } from "react"
import Papa from "papaparse"
import { Button } from "../Button/Button"
import FrontBackEditor from "../common/FrontBackEditor"          // NEU: 2-Felder-Editor für den Add-Bereich
import RichTextEditor from "../common/RichTextEditor"            // weiterhin für Inline-Edit in der Liste
import { type Card as CardType } from "../../context/DeckContext"
import { MdEdit, MdDelete, MdSave, MdCancel } from "react-icons/md"
import "./CardListEditor.css"

type CardListEditorProps = {
  deckId: string
  cards: CardType[]
  onAddCard: (deckId: string, cardData: { question: string; answer: string }) => void
  onDeleteCard: (deckId: string, cardId: string) => void
  onUpdateCard: (
    deckId: string,
    cardId: string,
    updatedData: { question: string; answer: string }
  ) => void
  addMultipleCardsToDeck: (deckId: string, newCardsData: { question: string; answer: string }[]) => void
  sortCriteria: string
  setSortCriteria: (value: string) => void
}

// Editorinhalt leer?
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
  // Add-Form: neuer Inhalt (Front/Back)
  const [newFront, setNewFront] = useState<string>("")
  const [newBack, setNewBack] = useState<string>("")

  // CSV
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
          const c = row as { question?: string; answer?: string }
          if (c.question && c.answer) newCardsData.push({ question: c.question, answer: c.answer })
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

  // Add-Form Sichtbarkeit
  const [isAddFormVisible, setIsAddFormVisible] = useState(false)
  // Kartenliste Sichtbarkeit
  const [isCardListVisible, setIsCardListVisible] = useState(false)

  // Add-Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isContentEmpty(newFront) || isContentEmpty(newBack)) {
      alert("Bitte fülle Vorder- und Rückseite aus.")
      return
    }
    onAddCard(deckId, { question: newFront, answer: newBack })
    setNewFront("")
    setNewBack("")
  }

  // Edit-Zustände
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
  const handleEditedCardChange = (field: "question" | "answer", html: string) => {
    setEditedCardData((prev) => ({ ...prev, [field]: html }))
  }

  return (
    <>
      {/* versteckter CSV-Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".csv"
        onChange={handleFileChange}
      />

      {/* --------- NEUE KARTE HINZUFÜGEN --------- */}
      <div className="card-management-area">
        <h2
          style={{ cursor: "pointer", margin: "0 0 1rem 0" }}
          onClick={() => setIsAddFormVisible(!isAddFormVisible)}
        >
          Neue Karte hinzufügen {isAddFormVisible ? "▲" : "▼"}
        </h2>

        {isAddFormVisible && (
          <form onSubmit={handleAddSubmit} className="add-card-form space-y-4">
            {/* Sichtbares Eingabefeld im Kartenlook: VORDERSEITE + RÜCKSEITE */}
            <FrontBackEditor
              frontHtml={newFront}
              backHtml={newBack}
              onChangeFront={(html: string) => setNewFront(html)}
              onChangeBack={(html: string) => setNewBack(html)}
            />

            {/* Aktionen */}
            <div
              className="form-actions"
              style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: ".5rem" }}
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

      {/* --------- KARTENLISTE --------- */}
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

            {/* Liste */}
            <ul className="card-list">
              {cards.length > 0 ? (
                cards.map((card) => (
                  <li key={card.id} className="card-list-item">
                    {editingCardId === card.id ? (
                      <>
                        <div className="card-info-edit">
                          {/* Inline-Edit je Seite; wenn du willst, kann ich hier ebenfalls FrontBackEditor einbauen */}
                          <RichTextEditor
                            content={editedCardData.question}
                            onChange={(html: string) => handleEditedCardChange("question", html)}
                          />
                          <RichTextEditor
                            content={editedCardData.answer}
                            onChange={(html: string) => handleEditedCardChange("answer", html)}
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
                          <div
                            dangerouslySetInnerHTML={{
                              __html: `<strong>VS:</strong> ${card.question}`,
                            }}
                          />
                          <div
                            dangerouslySetInnerHTML={{
                              __html: `<strong>RS:</strong> ${card.answer}`,
                            }}
                          />
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
