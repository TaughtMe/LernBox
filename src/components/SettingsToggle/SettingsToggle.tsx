// src/components/SettingsToggle/SettingsToggle.tsx

import React from 'react';
import styles from './SettingsToggle.module.css';

interface SettingsToggleProps {
  options: readonly string[]; // Ein Array von Texten für die Buttons, z.B. ['Klassisch', 'Schreiben']
  selectedValue: string; // Der aktuell ausgewählte Wert
  onSelect: (value: string) => void; // Funktion, die bei Klick aufgerufen wird
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <div className={styles.container}>
      {options.map((option) => (
        <button
          key={option}
          className={`${styles.option} ${
            selectedValue === option ? styles.active : ''
          }`}
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};