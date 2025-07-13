// src/components/LearningDashboard/LearningDashboard.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { VocabularyCard } from '../../types/stack.types';
import { LevelBox } from '../LevelBox/LevelBox';
import styles from './LearningDashboard.module.css';

interface LearningDashboardProps {
  cards: VocabularyCard[];
  stackId: string;
}

export const LearningDashboard: React.FC<LearningDashboardProps> = ({ cards, stackId }) => {
  // Zählt die Karten für jedes Level
  const navigate = useNavigate();
  const levelCounts = cards.reduce(
    (acc, card) => {
      acc[card.level] = (acc[card.level] || 0) + 1;
      return acc;
    },
    {} as { [key: number]: number }
  );

    const handleStartLearning = (level: number) => {
    navigate(`/learn/${stackId}/${level}`);
    };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Deine Lernlevel</h2>
      <div className={styles.grid}>
        {[1, 2, 3, 4, 5].map((level) => (
          <LevelBox
            key={level}
            level={level}
            count={levelCounts[level] || 0}
            onStartLearning={handleStartLearning}
          />
        ))}
      </div>
    </div>
  );
};