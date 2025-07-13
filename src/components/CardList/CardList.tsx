// src/components/CardList/CardList.tsx

import React from 'react';
import type { VocabularyCard } from '../../types/stack.types';
import { CardListItem } from '../CardListItem/CardListItem';
import styles from './CardList.module.css';

interface CardListProps {
  cards: VocabularyCard[];
  onDeleteCard: (cardId: string) => void;
}

export const CardList: React.FC<CardListProps> = ({ cards, onDeleteCard }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Vorderseite</span>
        <span className={styles.headerTitle}>Rückseite</span>
      </div>

      {cards.length > 0 ? (
        cards.map((card) => (
          <CardListItem
            key={card.id}
            card={card}
            onDelete={onDeleteCard}
          />
        ))
      ) : (
        <p className={styles.emptyState}>Noch keine Karten vorhanden.</p>
      )}
    </div>
  );
};