// src/components/StackSettings/StackSettings.tsx

import React from 'react';
import type { Stack } from '../../types/stack.types';
import { useStackStore } from '../../store/stackStore';
import { SettingsToggle } from '../SettingsToggle/SettingsToggle';
import styles from './StackSettings.module.css';

interface StackSettingsProps {
  stack: Stack; // Nimmt den gesamten Stapel als Prop entgegen
}

const LEARNING_MODES = ['Klassisch', 'Schreiben'] as const;
const LEARNING_DIRECTIONS = ['Vorderseite → Rückseite', 'Rückseite → Vorderseite'] as const;

export const StackSettings: React.FC<StackSettingsProps> = ({ stack }) => {
  const { updateStackSettings } = useStackStore();

  const handleModeChange = (newMode: string) => {
    updateStackSettings(stack.id, { learningMode: newMode as typeof LEARNING_MODES[number] });
  };

  const handleDirectionChange = (newDirection: string) => {
    updateStackSettings(stack.id, { direction: newDirection as typeof LEARNING_DIRECTIONS[number] });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Einstellungen</h2>

      <div className={styles.settingRow}>
        <span className={styles.label}>Lernmodus</span>
        <SettingsToggle
          options={LEARNING_MODES}
          selectedValue={stack.settings.learningMode}
          onSelect={handleModeChange}
        />
      </div>

      <div className={styles.settingRow}>
        <span className={styles.label}>Lernrichtung</span>
        <SettingsToggle
          options={LEARNING_DIRECTIONS}
          selectedValue={stack.settings.direction}
          onSelect={handleDirectionChange}
        />
      </div>
    </div>
  );
};