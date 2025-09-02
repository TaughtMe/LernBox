import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { MdEdit } from 'react-icons/md' // Icon für ein Beispiel importieren

const meta = {
  title: 'Design-System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'danger', 'text'],
    },
    children: {
      control: 'text', // Erlaubt die Bearbeitung des Inhalts in Storybook
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// --- Stories für jede Variante ---

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
    'aria-label': 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
    'aria-label': 'Secondary Button',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success Button',
    'aria-label': 'Success Button',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
    'aria-label': 'Danger Button',
  },
}

export const IconOnly: Story = {
  args: {
    variant: 'success',
    isIconOnly: true,
    children: <MdEdit />,
    'aria-label': 'Edit',
  },
}
