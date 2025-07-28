import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDecks } from '../../context/DeckContext'
import { ThemeToggle } from '../../components/ThemeToggle'
import type { Deck } from '../../context/DeckContext'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { decks, addDeck, deleteDeck, restoreDecks } = useDecks()
  const [newDeckTitle, setNewDeckTitle] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDelete = (e: React.MouseEvent, deckId: string) => {
    e.stopPropagation()
    deleteDeck(deckId)
  }

  const handleAddDeck = (e: React.FormEvent) => {
    e.preventDefault()
    if (newDeckTitle.trim()) {
      addDeck(newDeckTitle.trim())
      setNewDeckTitle('')
    }
  }

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(decks, null, 2)
    )}`
    const link = document.createElement('a')
    link.href = jsonString
    link.download = 'lernbox-backup.json'
    link.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content !== 'string') return

      const confirmation = window.confirm(
        'WARNUNG: Das Importieren einer Datei überschreibt alle aktuellen Decks. Möchten Sie fortfahren?'
      )

      if (confirmation) {
        try {
          const importedDecks = JSON.parse(content) as Deck[]
          if (Array.isArray(importedDecks)) {
            restoreDecks(importedDecks)
            alert('Decks erfolgreich importiert!')
          } else {
            throw new Error('Invalides Dateiformat.')
          }
        } catch (error) {
          console.error('Fehler beim Importieren der Decks:', error)
          alert(
            'Fehler: Die Datei konnte nicht gelesen werden. Stellen Sie sicher, dass es eine valide JSON-Datei ist.'
          )
        }
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <header className="dashboard-header">
        <div className="title-container">
          <h1>Meine Lernstapel</h1>
          <span className="version">v1.1.0</span>
        </div>
        <div className="version-toggle-container">
          <ThemeToggle />
        </div>
      </header>

      <main>
        <div className="deck-list">
          {decks.length === 0 ? (
            <p>Noch keine Stapel vorhanden. Erstelle deinen ersten!</p>
          ) : (
            decks.map((deck) => (
              <div
                key={deck.id}
                className="deck-card"
                onClick={() => navigate(`/deck/${deck.id}`)}
                role="button"
                tabIndex={0}
              >
                <div className="deck-card-info">
                  <h2>{deck.title}</h2>
                  <p>{deck.cards.length} Karte(n)</p>
                </div>
                <button
                  className="deck-card-delete"
                  onClick={(e) => handleDelete(e, deck.id)}
                  aria-label={`Stapel ${deck.title} löschen`}
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>

        <form className="new-deck-form" onSubmit={handleAddDeck}>
          <input
            type="text"
            className="input-field"
            placeholder="Name für neuen Stapel..."
            value={newDeckTitle}
            onChange={(e) => setNewDeckTitle(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Neuen Stapel erstellen
          </button>
        </form>

        <div className="data-management">
          <button onClick={handleExport} className="btn">
            Alle Decks exportieren
          </button>
          <button onClick={triggerFileInput} className="btn">
            Decks importieren
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            style={{ display: 'none' }}
          />
        </div>
      </main>
    </>
  )
}

export default DashboardPage
