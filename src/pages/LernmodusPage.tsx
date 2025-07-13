// src/pages/LernmodusPage.tsx

import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStackStore } from '../store/stackStore';
import { Flashcard } from '../components/Flashcard';

export const LernmodusPage: React.FC = () => {
  const { stackId, level } = useParams<{ stackId: string; level: string }>();
  
  // Alle Karten für diesen Stapel aus dem Store holen
  const allCards = useStackStore((state) =>
    state.stacks.find((s) => s.id === stackId)
  )?.cards;

  // Die Karten für das ausgewählte Level filtern. useMemo verhindert unnötige Neuberechnungen.
  const cardsToLearn = useMemo(() => {
    if (!allCards) return [];
    return allCards.filter((card) => card.level === Number(level));
  }, [allCards, level]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Wenn keine Karten da sind, zeige eine Nachricht an
  if (!allCards) {
    return <div>Stapel nicht gefunden. <Link to="/">Zurück.</Link></div>;
  }
  if (cardsToLearn.length === 0) {
    return <div>Keine Karten in diesem Level. <Link to={`/stack/${stackId}`}>Zurück.</Link></div>;
  }

  const currentCard = cardsToLearn[currentCardIndex];
  const textToShow = isFlipped ? currentCard.back : currentCard.front;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
      <Flashcard text={textToShow} />
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setIsFlipped(!isFlipped)}>
          {isFlipped ? 'Frage anzeigen' : 'Antwort anzeigen'}
        </button>
      </div>
    </div>
  );
};