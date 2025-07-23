import React, { useState } from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { type Card as CardType } from '../../context/DeckContext';
import './CardListEditor.css';

type CardListEditorProps = {
  deckId: string;
  cards: CardType[];
  onAddCard: (deckId: string, cardData: { question: string; answer: string }) => void;
  onDeleteCard: (deckId: string, cardId: string) => void;
  onUpdateCard: (deckId: string, cardId: string, updatedData: { question: string; answer: string }) => void;
  sortCriteria: string;
  setSortCriteria: (value: string) => void;
};

export const CardListEditor: React.FC<CardListEditorProps> = ({ deckId, cards, onAddCard, onDeleteCard, onUpdateCard, sortCriteria, setSortCriteria }) => {
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim() === '' || newAnswer.trim() === '') {
      alert('Bitte füllen Sie beide Felder aus.');
      return;
    }
    onAddCard(deckId, { question: newQuestion, answer: newAnswer });
    setNewQuestion('');
    setNewAnswer('');
  };

  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editedCardData, setEditedCardData] = useState({ question: '', answer: '' });

  const handleEditClick = (card: CardType) => {
    setEditingCardId(card.id);
    setEditedCardData({ question: card.question, answer: card.answer });
  };

  const handleCancelClick = () => {
    setEditingCardId(null);
    setEditedCardData({ question: '', answer: '' });
  };

  const handleSaveClick = (cardId: string) => {
    if (editedCardData.question.trim() === '' || editedCardData.answer.trim() === '') {
      alert('Frage und Antwort dürfen nicht leer sein.');
      return;
    }
    onUpdateCard(deckId, cardId, editedCardData);
    setEditingCardId(null);
    setEditedCardData({ question: '', answer: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCardData(prev => ({ ...prev, [name]: value }));
  };

  const [isAddFormVisible, setIsAddFormVisible] = useState(true);
  const [isCardListVisible, setIsCardListVisible] = useState(true);

  return (
    <>
      <div className="card-management-area">
        <h2 
          style={{ cursor: 'pointer' }} 
          onClick={() => setIsAddFormVisible(!isAddFormVisible)}
        >
          Neue Karte hinzufügen {isAddFormVisible ? '▲' : '▼'}
        </h2>
        {isAddFormVisible && (
          <form onSubmit={handleAddSubmit} className="add-card-form">
            <div className="form-group">
              <label htmlFor="question">Frage</label>
              <Input
                id="question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Geben Sie die Frage ein"
              />
            </div>
            <div className="form-group">
              <label htmlFor="answer">Antwort</label>
              <Input
                id="answer"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Geben Sie die Antwort ein"
              />
            </div>
            <Button type="submit" label="Karte hinzufügen" primary />
          </form>
        )}
      </div>

      <hr className="section-divider" />

        <div className="card-list-area">
            <h2 
                style={{ cursor: 'pointer' }} 
                onClick={() => setIsCardListVisible(!isCardListVisible)}
            >
                Karten in diesem Deck ({cards.length}) {isCardListVisible ? '▲' : '▼'}
            </h2>
            {isCardListVisible && (
                <>
                    {/* Sortier-UI an der neuen Position */}
                    <div className="sort-controls" style={{ margin: '1rem 0', padding: '0.5rem', border: '1px solid #eee', borderRadius: '8px' }}>
                        <label style={{ marginRight: '1rem', fontWeight: 'bold' }}>Sortieren nach:</label>
                        <button className={sortCriteria === 'question-asc' ? 'active' : ''} onClick={() => setSortCriteria('question-asc')}>Frage (A-Z)</button>
                        <button className={sortCriteria === 'answer-asc' ? 'active' : ''} onClick={() => setSortCriteria('answer-asc')}>Antwort (A-Z)</button>
                        <button className={sortCriteria === 'level-asc' ? 'active' : ''} onClick={() => setSortCriteria('level-asc')}>Lernstufe</button>
                        <button className={sortCriteria === 'default' ? 'active' : ''} onClick={() => setSortCriteria('default')}>Zurücksetzen</button>
                    </div>
                    <ul className="card-list">
                        {cards.length > 0 ? (
                        cards.map((card) => (
                            <li key={card.id} className="card-list-item">
                            {editingCardId === card.id ? (
                                // Bearbeitungsmodus
                                <>
                                <div className="card-info-edit">
                                    <Input
                                    type="text"
                                    name="question"
                                    value={editedCardData.question}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                    />
                                    <Input
                                    type="text"
                                    name="answer"
                                    value={editedCardData.answer}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                    />
                                </div>
                                <div className="card-actions">
                                    <Button onClick={() => handleSaveClick(card.id)} label="Speichern" primary />
                                    <Button onClick={handleCancelClick} label="Abbrechen" />
                                </div>
                                </>
                            ) : (
                                // Anzeigemodus
                                <>
                                <div className="card-info">
                                    <span><strong>Frage:</strong> {card.question}</span>
                                    <span><strong>Antwort:</strong> {card.answer}</span>
                                </div>
                                <div className="card-actions">
                                    <span className="card-level">Stufe: {card.level}</span>
                                    <Button onClick={() => handleEditClick(card)} label="Bearbeiten" />
                                    <Button onClick={() => onDeleteCard(deckId, card.id)} label="Löschen" />
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
  );
};