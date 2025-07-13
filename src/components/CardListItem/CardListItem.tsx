// src/components/CardListItem/CardListItem.tsx

import React from 'react';
import type { VocabularyCard } from '../../types/stack.types';
import styles from './CardListItem.module.css';

interface CardListItemProps {
  card: VocabularyCard;
  onDelete: (cardId: string) => void;
}

export const CardListItem: React.FC<CardListItemProps> = ({ card, onDelete }) => {
  return (
    <div className={styles.item}>
      <div className={styles.content}>
        <span className={styles.text}>{card.front}</span>
        <span className={styles.text}>{card.back}</span>
      </div>
      <div className={styles.actions}>
        <button
          onClick={() => onDelete(card.id)}
          className={styles.deleteButton}
          aria-label="Lernkarte löschen"
        >
          {/* Ein einfaches Mülleimer-Icon (als SVG oder Zeichen) */}
          &#x1F5D1;
        </button>
      </div>
    </div>
  );
};