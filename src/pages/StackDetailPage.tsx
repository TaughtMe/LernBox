// src/pages/StackDetailPage.tsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStackStore } from '../store/stackStore';
import { StackSettings } from '../components/StackSettings/StackSettings';
import { AddCardForm } from '../components/AddCardForm/AddCardForm';
import styles from './StackDetailPage.module.css';
import { CardList } from '../components/CardList/CardList';
import { LearningDashboard } from '../components/LearningDashboard/LearningDashboard';


export const StackDetailPage: React.FC = () => {
  const { stackId } = useParams<{ stackId: string }>();
  const stack = useStackStore((state) =>
    state.stacks.find((s) => s.id === stackId)
  );

  const { addCardToStack, deleteCardFromStack } = useStackStore();

  if (!stack) {
    return (
      <div className={styles.pageContainer}>
        <h1 className={styles.title}>Stapel nicht gefunden</h1>
        <Link to="/" className={styles.backLink}>← Zurück zur Übersicht</Link>
      </div>
    );
  }
  
  const handleAddCard = (cardData: { front: string; back: string }) => {
    if (stackId) {
      addCardToStack(stackId, cardData);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    if (stackId) {
      deleteCardFromStack(stackId, cardId);
    }
  };

  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <Link to="/" className={styles.backLink}>← Zurück</Link>
        <h1 className={styles.title}>{stack.name}</h1>
      </div>

      <LearningDashboard cards={stack.cards} stackId={stack.id} />

      <StackSettings stack={stack} />

      <AddCardForm onAddCard={handleAddCard} />
      <CardList cards={stack.cards} onDeleteCard={handleDeleteCard} />
    </main>
  );
};