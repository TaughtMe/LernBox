import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Button } from '../Button/Button';
import RichTextEditor from '../common/RichTextEditor';
import { type Card as CardType } from '../../context/DeckContext';
import { MdEdit, MdDelete, MdSave, MdCancel } from 'react-icons/md';
import './CardListEditor.css';

type CardListEditorProps = {
  deckId: string;
  cards: CardType[];
  onAddCard: (
    deckId: string,
    cardData: { question: string; answer: string }
  ) => void;
  onDeleteCard: (deckId: string, cardId: string) => void;
  onUpdateCard: (
    deckId: string,
    cardId: string,
    updatedData: { question: string; answer: string }
  ) => void;
  addMultipleCardsToDeck: (
    deckId: string,
    newCardsData: { question: string; answer: string }[]
  ) => void;
  sortCriteria: string;
  setSortCriteria: (value: string) => void;
};

// Hilfsfunktion um zu prüfen, ob der Editor-Inhalt leer ist
const isContentEmpty = (content: string) => {
  if (!content) return true;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  return tempDiv.textContent?.trim() === '';
};

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
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // ... (CSV Import Logik bleibt unverändert)
    const file = event.target.files?.[0];
    if (!file || !deckId) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ';',
      complete: (results) => {
        const newCardsData: { question: string; answer: string }[] = [];
        results.data.forEach((row: unknown) => {
          const cardData = row as { question?: string; answer?: string };
          if (cardData.question && cardData.answer) {
            newCardsData.push({
              question: cardData.question,
              answer: cardData.answer,
            });
          }
        });
        if (newCardsData.length > 0) {
          addMultipleCardsToDeck(deckId, newCardsData);
          alert(`${newCardsData.length} Karten wurden erfolgreich importiert.`);
        } else {
          alert('Keine gültigen Karten in der Datei gefunden.');
        }
        if (event.target) event.target.value = '';
      },
      error: (error) => {
        console.error('Fehler beim Parsen der CSV-Datei:', error);
        alert('Die CSV-Datei konnte nicht verarbeitet werden.');
      },
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isContentEmpty(newQuestion) || isContentEmpty(newAnswer)) {
      alert('Bitte füllen Sie beide Felder aus.');
      return;
    }
    onAddCard(deckId, { question: newQuestion, answer: newAnswer });
    setNewQuestion('');
    setNewAnswer('');
  };

  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editedCardData, setEditedCardData] = useState({
    question: '',
    answer: '',
  });

  const handleEditClick = (card: CardType) => {
    setEditingCardId(card.id);
    setEditedCardData({ question: card.question, answer: card.answer });
  };

  const handleCancelClick = () => {
    setEditingCardId(null);
    setEditedCardData({ question: '', answer: '' });
  };

  const handleSaveClick = (cardId: string) => {
    if (
      isContentEmpty(editedCardData.question) ||
      isContentEmpty(editedCardData.answer)
    ) {
      alert('Frage und Antwort dürfen nicht leer sein.');
      return;
    }
    onUpdateCard(deckId, cardId, editedCardData);
    setEditingCardId(null);
    setEditedCardData({ question: '', answer: '' });
  };

  const handleEditedCardChange = (field: 'question' | 'answer', html: string) => {
    setEditedCardData(prev => ({ ...prev, [field]: html }));
  };

  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isCardListVisible, setIsCardListVisible] = useState(false);

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".csv"
        onChange={handleFileChange}
      />
      <div className="card-management-area">
        <h2
          style={{ cursor: 'pointer', margin: '0 0 1rem 0' }}
          onClick={() => setIsAddFormVisible(!isAddFormVisible)}
        >
          Neue Karte hinzufügen {isAddFormVisible ? '▲' : '▼'}
        </h2>
        {isAddFormVisible && (
          <form onSubmit={handleAddSubmit} className="add-card-form">
            <div className="form-group">
              <label>Vorderseite</label>
              <RichTextEditor content={newQuestion} onChange={setNewQuestion} />
            </div>
            <div className="form-group">
              <label>Rückseite</label>
              <RichTextEditor content={newAnswer} onChange={setNewAnswer} />
            </div>
            <div
              className="form-actions"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '1rem',
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

      <div className="card-list-area">
        <h2
          style={{ cursor: 'pointer', margin: '0 0 1rem 0' }}
          onClick={() => setIsCardListVisible(!isCardListVisible)}
        >
          Karten in diesem Deck ({cards.length}){' '}
          {isCardListVisible ? '▲' : '▼'}
        </h2>
        {isCardListVisible && (
          <>
            {/* KORRIGIERTER/WIEDEREINGEFÜGTER TEIL */}
            <div className="sort-controls">
              <label>Sortieren nach:</label>
              <div className="sort-buttons-group">
                <Button onClick={() => setSortCriteria('default')} variant={sortCriteria === 'default' ? 'primary' : 'text'} aria-label="Sortierung zurücksetzen">Standard</Button>
                <Button onClick={() => setSortCriteria('question-asc')} variant={sortCriteria === 'question-asc' ? 'primary' : 'text'} aria-label="Nach Frage sortieren">VS</Button>
                <Button onClick={() => setSortCriteria('answer-asc')} variant={sortCriteria === 'answer-asc' ? 'primary' : 'text'} aria-label="Nach Antwort sortieren">RS</Button>
                <Button onClick={() => setSortCriteria('level-asc')} variant={sortCriteria === 'level-asc' ? 'primary' : 'text'} aria-label="Nach Stufe sortieren">Stufe</Button>
              </div>
            </div>
            <ul className="card-list">
              {cards.length > 0 ? (
                cards.map((card) => (
                  <li key={card.id} className="card-list-item">
                    {editingCardId === card.id ? (
                      <>
                        <div className="card-info-edit">
                          <RichTextEditor
                            content={editedCardData.question}
                            onChange={(html) => handleEditedCardChange('question', html)}
                          />
                          <RichTextEditor
                            content={editedCardData.answer}
                            onChange={(html) => handleEditedCardChange('answer', html)}
                          />
                        </div>
                        <div className="card-actions">
                          <Button onClick={() => handleSaveClick(card.id)} variant="success" isIconOnly aria-label="Speichern">
                            <MdSave />
                          </Button>
                          <Button onClick={handleCancelClick} variant="secondary" isIconOnly aria-label="Abbrechen">
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
                          <Button onClick={() => handleEditClick(card)} variant="success" isIconOnly aria-label="Bearbeiten">
                            <MdEdit />
                          </Button>
                          <Button onClick={() => onDeleteCard(deckId, card.id)} variant="danger" isIconOnly aria-label="Löschen">
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
  );
};