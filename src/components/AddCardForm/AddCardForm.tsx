// src/components/AddCardForm/AddCardForm.tsx

import React, { useState } from 'react';
import styles from './AddCardForm.module.css';

interface AddCardFormProps {
  onAddCard: (cardData: { front: string; back: string }) => void;
}

export const AddCardForm: React.FC<AddCardFormProps> = ({ onAddCard }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (front.trim() && back.trim()) {
      onAddCard({ front: front.trim(), back: back.trim() });
      setFront('');
      setBack('');
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Neue Lernkarte erstellen</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <textarea
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="Vorderseite (Frage/Begriff)"
            className={styles.textarea}
            aria-label="Vorderseite der Lernkarte"
          />
          <textarea
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Rückseite (Antwort/Definition)"
            className={styles.textarea}
            aria-label="Rückseite der Lernkarte"
          />
        </div>
        <button type="submit" className={styles.button}>
          Lernkarte hinzufügen
        </button>
      </form>
    </div>
  );
};