import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDecks } from '../../context/DeckContext';
import { ThemeToggle } from '../../components/ThemeToggle';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { decks, addDeck, deleteDeck } = useDecks();
  const [newDeckTitle, setNewDeckTitle] = useState('');

  const handleDelete = (e: React.MouseEvent, deckId: string) => {
    e.stopPropagation(); // Verhindert, dass zum Deck navigiert wird
    deleteDeck(deckId);
  };

  const handleAddDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeckTitle.trim()) {
      addDeck(newDeckTitle.trim()); // Annahme: addDeck akzeptiert einen Titel
      setNewDeckTitle('');
    }
  };

  return (
    // Die Klasse .App aus App.tsx steuert bereits das Hauptlayout
    <>
      <header className="dashboard-header">
        <div className="title-container">
          <h1>Meine Lernstapel</h1>
          <span className="version">v1.0.1</span>
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
      </main>
    </>
  );
};

export default DashboardPage;