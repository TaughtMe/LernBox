// src/components/Flashcard/Flashcard.tsx

import React from 'react';
import styles from './Flashcard.module.css';

interface FlashcardProps {
  text: string; // Zeigt entweder Vorder- oder Rückseite an
}

export const Flashcard: React.FC<FlashcardProps> = ({ text }) => {
  return (
    <div className={styles.card}>
      <p className={styles.text}>{text}</p>
    </div>
  );
};