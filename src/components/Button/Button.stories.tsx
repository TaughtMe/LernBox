import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

// Metadaten für die Button-Komponente in Storybook
const meta = {
  title: 'Design-System/Button', // Titel in der Storybook-Seitenleiste
  component: Button,
  parameters: {
    // Zentriert die Komponente auf der Storybook-Leinwand
    layout: 'centered',
  },
  // Erzeugt automatisch einen Dokumentations-Eintrag
  tags: ['autodocs'],
  argTypes: {
    // Definiert, wie die 'primary' Prop in Storybook gesteuert wird
    primary: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story für den primären Button-Zustand
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Primary Button',
  },
};

// Story für den sekundären Button-Zustand
export const Secondary: Story = {
  args: {
    primary: false,
    label: 'Secondary Button',
  },
};
