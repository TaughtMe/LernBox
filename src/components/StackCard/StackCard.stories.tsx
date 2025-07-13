// src/components/StackCard/StackCard.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { StackCard } from './StackCard';
import type { Stack } from '../../../src/types/stack.types';

// Mock-Daten für unsere Stories
const mockStack: Stack = {
  id: '1',
  name: 'Englisch Lektion 5',
  cards: new Array(25).fill(null), // Simuliert 25 Karten
  settings: {
    learningMode: 'Klassisch',
    direction: 'Vorderseite → Rückseite',
    speechLanguage: { front: 'en-US', back: 'de-DE' },
  },
  createdAt: new Date().toISOString(),
};

const mockEmptyStack: Stack = {
    ...mockStack,
    id: '2',
    name: 'Leerer Stapel',
    cards: [], // Simuliert einen leeren Stapel
};

// Metadaten für die Storybook-UI
const meta: Meta<typeof StackCard> = {
  title: 'Components/StackCard',
  component: StackCard,
  tags: ['autodocs'],
  argTypes: {
    stack: {
        control: 'object',
        description: 'Das zu rendernde Stack-Objekt.'
    },
  },
  // Wir mappen die Actions, damit sie im Storybook UI angezeigt werden
  args: {
    onClick: action('onCardClick'),
    onDelete: action('onDeleteClick'),
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Die "Default"-Story mit mehreren Karten
export const Default: Story = {
  args: {
    stack: mockStack,
  },
};

// Eine zweite Story, die einen Stapel mit einer Karte zeigt
export const SingleCard: Story = {
    args: {
      stack: {
        ...mockStack,
        id: '3',
        name: 'Stapel mit einer Karte',
        cards: new Array(1).fill(null),
      }
    },
};

// Eine dritte Story, die einen leeren Stapel zeigt
export const Empty: Story = {
  args: {
    stack: mockEmptyStack,
  },
};