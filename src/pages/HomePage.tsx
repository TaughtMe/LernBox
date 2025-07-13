// src/pages/HomePage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom'; // HINZUFÜGEN
import { StackCard } from '../components/StackCard/StackCard';
import { AddStackForm } from '../components/AddStackForm/AddStackForm';
import { useStackStore } from '../store/stackStore';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const { stacks, deleteStack, addStack } = useStackStore();
  const navigate = useNavigate(); // HINZUFÜGEN: Hook für die Navigation

  // Diese Funktion wird nun die Navigation auslösen
  const handleSelectStack = (id: string) => {
    navigate(`/stack/${id}`);
  };

  return (
    <main className={styles.pageContainer}>
      <AddStackForm onAdd={addStack} /> 

      <h1 className={styles.title}>Meine Vokabel-Boxen</h1>
      <div className={styles.stackGrid}>
        {stacks.map((stack) => (
          <StackCard
            key={stack.id}
            stack={stack}
            onClick={handleSelectStack} // Bleibt unverändert, löst jetzt aber die neue Funktion aus
            onDelete={deleteStack}
          />
        ))}
      </div>
    </main>
  );
};