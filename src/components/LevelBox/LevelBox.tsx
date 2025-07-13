// src/components/LevelBox/LevelBox.tsx

import React from 'react';
import styles from './LevelBox.module.css';

interface LevelBoxProps {
  level: number;
  count: number;
  onStartLearning: (level: number) => void;
}

const levelColorClasses: { [key: number]: string } = {
  1: styles.level1,
  2: styles.level2,
  3: styles.level3,
  4: styles.level4,
  5: styles.level5,
};

export const LevelBox: React.FC<LevelBoxProps> = ({
  level,
  count,
  onStartLearning,
}) => {
  const colorClass = levelColorClasses[level] || styles.level1;

  return (
    <div className={`${styles.box} ${colorClass}`}>
      <div>
        <div className={styles.levelTitle}>Level {level}</div>
      </div>
      <div>
        <div className={styles.count}>{count}</div>
        <div className={styles.unit}>Karten</div>
      </div>
      <button
        className={styles.button}
        onClick={() => onStartLearning(level)}
        disabled={count === 0}
      >
        Lernen
      </button>
    </div>
  );
};