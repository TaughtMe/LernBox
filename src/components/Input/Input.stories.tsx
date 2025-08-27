import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'password', 'email', 'number', 'search'],
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const EmptyWithPlaceholder: Story = {
  name: '1. Leer mit Platzhalter',
  args: {
    placeholder: 'Hier Text eingeben...',
    type: 'text',
  },
}

export const WithDefaultValue: Story = {
  name: '2. Mit vordefiniertem Wert',
  args: {
    value: 'Ein vordefinierter Wert',
    type: 'text',
  },
}
