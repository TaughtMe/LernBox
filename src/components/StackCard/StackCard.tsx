// src/components/StackCard/StackCard.tsx

import React from 'react';
import type { Stack } from '../../../src/types/stack.types';
import styles from './StackCard.module.css';

/**
 * @interface StackCardProps
 * Definiert die Props für die StackCard Komponente.
 */
interface StackCardProps {
  /** Das Stack-Objekt, das angezeigt werden soll. */
  stack: Stack;
  
  /** Funktion, die beim Klick auf die Karte aufgerufen wird. */
  onClick: (id: string) => void;
  
  /** Funktion, die beim Klick auf den Löschen-Button aufgerufen wird. */
  onDelete: (id: string) => void;
}

export const StackCard: React.FC<StackCardProps> = ({ stack, onClick, onDelete }) => {
  
  // Verhindert, dass der Klick auf den Button auch den onClick der Karte auslöst.
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(stack.id);
  };

  const handleCardClick = () => {
    onClick(stack.id);
  };

  return (
    <div className={styles.card} onClick={handleCardClick} role="button" tabIndex={0}>
      <button 
        className={styles.deleteButton} 
        onClick={handleDeleteClick}
        aria-label={`Stapel ${stack.name} löschen`}
      >
        {/* Ein einfaches 'x' als Icon */}
        &#x2715;
      </button>
      <div className={styles.cardName}>{stack.name}</div>
      <div className={styles.cardCount}>
        {stack.cards.length} {stack.cards.length === 1 ? 'Karte' : 'Karten'}
      </div>
    </div>
  );
};