import React from 'react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import './DashboardPage.css';
import { useNavigate } from 'react-router-dom';
import { useDecks } from '../../context/DeckContext';
import { ThemeToggle } from '../../components/ThemeToggle';

const DashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { decks, addDeck, deleteDeck } = useDecks();

  const handleDelete = (e: React.MouseEvent, deckId: string) => {
    e.stopPropagation();
    deleteDeck(deckId);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Meine Decks</h1>
        <div className="dashboard-header-buttons">
          <ThemeToggle />
          <Button onClick={addDeck} label="Neues Deck" />
          <Button onClick={logout} label="Logout" />
        </div>
      </div>
      <div className="deck-list">
        {decks.length === 0 ? (
          <p className="empty-deck-message">
            Noch keine Decks vorhanden. Erstelle dein erstes Deck!
          </p>
        ) : (
          decks.map((deck) => (
            <div
              key={deck.id}
              className="deck-card-wrapper"
              onClick={() => navigate(`/deck/${deck.id}`)}
            >
              <Card
                title={deck.title}
                description={`Anzahl Karten: ${deck.cards.length}`}
              />
              <div className="deck-card-delete-button">
                <Button
                  onClick={(e) => handleDelete(e, deck.id)}
                  label="Löschen"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;