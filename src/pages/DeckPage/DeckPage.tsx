import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDecks } from '../../context/DeckContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CardListEditor } from '../../components/CardListEditor/CardListEditor';

type LearnMode = 'Klassisch' | 'Schreiben';
type LearnDirection = 'V→R' | 'R→V' | 'Gemischt';

const DeckPage: React.FC = () => {
  const navigate = useNavigate();
  const { deckId } = useParams<{ deckId: string }>();
  const { decks, addCardToDeck, deleteCardFromDeck, updateCardInDeck } = useDecks();

  const [learnMode, setLearnMode] = useLocalStorage<LearnMode>('learnModeSetting', 'Klassisch');
  const [learnDirection, setLearnDirection] = useLocalStorage<LearnDirection>('learnDirectionSetting', 'V→R');
  // HINZUGEFÜGT: Der fehlende State für das Sortierkriterium
  const [sortCriteria, setSortCriteria] = useState('default');

  const currentDeck = useMemo(() => decks.find(d => d.id === deckId), [decks, deckId]);

  const cardsByLevel = useMemo(() => {
    const groups: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (currentDeck) {
      currentDeck.cards.forEach(card => {
        if (groups[card.level] !== undefined) {
          groups[card.level]++;
        }
      });
    }
    return groups;
  }, [currentDeck]);

  const sortedCards = useMemo(() => {
    // Wenn nicht sortiert werden soll, die originale Reihenfolge beibehalten
    if (!currentDeck || sortCriteria === 'default') {
      return currentDeck ? currentDeck.cards : [];
    }
    
    // Für die Sortierung immer eine Kopie des Arrays erstellen
    const cardsToSort = [...currentDeck.cards];

    switch (sortCriteria) {
      case 'question-asc':
        return cardsToSort.sort((a, b) => a.question.localeCompare(b.question));
      case 'answer-asc':
        return cardsToSort.sort((a, b) => a.answer.localeCompare(b.answer));
      case 'level-asc':
        return cardsToSort.sort((a, b) => a.level - b.level);
      default:
        return cardsToSort;
    }
  }, [currentDeck, sortCriteria]);

  const startLearningSession = (level: number) => {
    navigate(`/learn/${deckId}?mode=${learnMode}&direction=${learnDirection}&level=${level}`);
  };

  if (!deckId || !currentDeck) {
    return (
      <div>
        Deck nicht gefunden. <a href="/">Zurück zur Übersicht</a>
      </div>
    );
  }

  return (
    <>
      <a
        href="/"
        className="back-link"
        onClick={(e) => {
          e.preventDefault();
          navigate('/dashboard');
        }}
      >
        &larr; Zur Stapel-Übersicht
      </a>

      <header className="page-section">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{currentDeck.title}</h1>
      </header>

      {/* Sektion 1: Einstellungen */}
      <div className="card page-section">
        <h2 style={{ marginTop: 0 }}>Einstellungen</h2>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div className="control-group" style={{ flex: 1 }}>
            <label className="control-group-label">Lernmodus</label>
            <div className="segmented-control">
              <button
                className={learnMode === 'Klassisch' ? 'active' : ''}
                onClick={() => setLearnMode('Klassisch')}
              >
                Klassisch
              </button>
              <button
                className={learnMode === 'Schreiben' ? 'active' : ''}
                onClick={() => setLearnMode('Schreiben')}
              >
                Schreiben
              </button>
            </div>
          </div>
          <div className="control-group" style={{ flex: 1 }}>
            <label className="control-group-label">Lernrichtung</label>
            <div className="segmented-control">
              <button
                className={learnDirection === 'V→R' ? 'active' : ''}
                onClick={() => setLearnDirection('V→R')}
              >
                V→R
              </button>
              <button
                className={learnDirection === 'R→V' ? 'active' : ''}
                onClick={() => setLearnDirection('R→V')}
              >
                R→V
              </button>
              <button
                className={learnDirection === 'Gemischt' ? 'active' : ''}
                onClick={() => setLearnDirection('Gemischt')}
              >
                Gemischt
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sektion 2: Deine Lernlevel */}
      <section className="page-section">
        <h2>Deine Lernlevel</h2>
        <div className="level-grid">
          {Object.entries(cardsByLevel).map(([level, count]) => (
            <div key={level} className={`level-card level-${level}`}>
              <h3>Level {level}</h3>
              <p className="card-count">{count} Karten</p>
              <button
                className="btn btn-secondary"
                disabled={count === 0}
                onClick={() => startLearningSession(parseInt(level))}
              >
                Lernen
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Sektion 3: Kartenverwaltung */}
      <section className="card page-section">

        <CardListEditor
          deckId={deckId}
          cards={sortedCards}
          onAddCard={addCardToDeck}
          onDeleteCard={deleteCardFromDeck}
          onUpdateCard={updateCardInDeck}
          sortCriteria={sortCriteria}
          setSortCriteria={setSortCriteria}
        />
      </section>
    </>
  );
};

export default DeckPage;