// src/components/AddStackForm/AddStackForm.tsx

import React, { useState } from 'react';
import styles from './AddStackForm.module.css';

interface AddStackFormProps {
  onAdd: (name: string) => void;
}

export const AddStackForm: React.FC<AddStackFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName(''); // Input-Feld nach dem Hinzufügen leeren
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name für neuen Stapel..."
        className={styles.input}
        aria-label="Name für neuen Stapel"
      />
      <button type="submit" className={styles.button}>
        Neuen Stapel erstellen
      </button>
    </form>
  );
};