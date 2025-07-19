import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDecks } from '../../context/DeckContext';
import { type Card } from '../../context/DeckContext';
import { selectNextCard } from '../../services/leitnerService';
import { Button } from '../../components/Button/Button';
import './DeckPage.css';

const DeckPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { decks, addCardToDeck, deleteCardFromDeck, answerCard, updateDeck } = useDecks();

  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // --- Lern-Sitzungs-State ---
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const deck = useMemo(() => decks.find(d => d.id === deckId), [decks, deckId]);

  // Lädt die nächste, intelligent ausgewählte Karte
  const loadNextCard = useCallback(() => {
    if (deck && deck.cards.length > 0) {
      const nextCard = selectNextCard(deck.cards);
      setCurrentCard(nextCard);
      setIsFlipped(false); // Kartenansicht für neue Karte zurücksetzen
    } else {
      setCurrentCard(null); // Keine Karten vorhanden oder alle gelernt
    }
  }, [deck]);

  // Lade die erste Karte, wenn die Komponente geladen wird oder sich das Deck ändert
  useEffect(() => {
    loadNextCard();
  }, [loadNextCard]);

  // Handler für das Beantworten einer Karte
  const handleAnswer = (wasCorrect: boolean) => {
    if (!deck || !currentCard) return;

    answerCard(deck.id, currentCard.id, wasCorrect);
    // Lade die nächste Karte direkt nach der Bewertung
    loadNextCard();
  };
  
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckId || newQuestion.trim() === '' || newAnswer.trim() === '') {
      alert('Bitte füllen Sie beide Felder aus.');
      return;
    }
    addCardToDeck(deckId, { question: newQuestion, answer: newAnswer });
    setNewQuestion('');
    setNewAnswer('');
  };

  if (!deck) {
    return (
      <div className="deck-page-container">
        <h1>Deck nicht gefunden</h1>
        <Button onClick={() => navigate('/dashboard')} label="Zurück zur Übersicht" />
      </div>
    );
  }

  const masteredCount = useMemo(() => {
    return deck.cards.filter(c => c.level === 5).length;
  }, [deck.cards]);

  return (
    <div className="deck-page-container">
      <div className="deck-page-header">
        <Button onClick={() => navigate('/dashboard')} label="‹ Zurück zur Übersicht" />
      </div>

      {/* --- Deck-Titel Bearbeitung --- */}
      <div className="deck-title-editor">
        <input
          type="text"
          className="deck-title-input"
          value={deck.title}
          onChange={(e) => updateDeck(deck.id, e.target.value)}
          aria-label="Deck-Titel bearbeiten"
        />
      </div>

      {/* --- LERN-ANSICHT (NEU) --- */}
      <div className="learn-session">
        {deck.cards.length > 0 ? (
          currentCard ? (
            <>
              <p className="card-counter">
                Fortschritt: {masteredCount} von {deck.cards.length} gemeistert (Stufe 5)
              </p>
              <div className="card-area" onClick={() => setIsFlipped(f => !f)}>
                <div className="flashcard-panel">
                  <h4 className="panel-title">Frage:</h4>
                  <p className="panel-content">{currentCard.question}</p>
                </div>
                <div className="flashcard-panel">
                  <h4 className="panel-title">Antwort:</h4>
                  <p className={`panel-content ${!isFlipped ? 'blurred' : ''}`}>
                    {currentCard.answer}
                  </p>
                </div>
              </div>
              <div className="navigation-buttons">
                {!isFlipped ? (
                  <Button onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }} label="Antwort aufdecken" primary fullWidth />
                ) : (
                  <div className="evaluation-buttons">
                    <Button onClick={(e) => { e.stopPropagation(); handleAnswer(false); }} label="Falsch" />
                    <Button onClick={(e) => { e.stopPropagation(); handleAnswer(true); }} label="Richtig" primary />
                  </div>
                )}
              </div>
            </>
          ) : (
            <p>Glückwunsch! Alle Karten in diesem Deck sind gemeistert.</p>
          )
        ) : (
          <p>Dieses Deck enthält noch keine Lernkarten.</p>
        )}
      </div>

      <hr className="section-divider" />

      {/* --- NEUE KARTE HINZUFÜGEN (unverändert) --- */}
      <div className="card-management-area">
        <h2>Neue Karte hinzufügen</h2>
        <form onSubmit={handleAddCard} className="add-card-form">
          <div className="form-group">
            <label htmlFor="question">Frage</label>
            <input id="question" type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Geben Sie die Frage ein" />
          </div>
          <div className="form-group">
            <label htmlFor="answer">Antwort</label>
            <input id="answer" type="text" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} placeholder="Geben Sie die Antwort ein" />
          </div>
          <Button type="submit" label="Karte hinzufügen" primary />
        </form>
      </div>

      <hr className="section-divider" />

      {/* --- KARTENLISTE (Level hinzugefügt) --- */}
      <div className="card-list-area">
        <h2>Karten in diesem Deck ({deck.cards.length})</h2>
        <ul className="card-list">
          {deck.cards.length > 0 ? (
            deck.cards.map(card => (
              <li key={card.id} className="card-list-item">
                <div className="card-info">
                  <span><strong>Frage:</strong> {card.question}</span>
                  <span><strong>Antwort:</strong> {card.answer}</span>
                </div>
                <div className="card-actions">
                  <span className="card-level">Stufe: {card.level}</span>
                  <Button onClick={() => deleteCardFromDeck(deck.id, card.id)} label="Löschen" />
                </div>
              </li>
            ))
          ) : (
            <p>Es sind noch keine Karten vorhanden.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DeckPage;