import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card'
import { Button } from '../Button/Button'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Der Titel der Karte' },
    description: {
      control: 'text',
      description: 'Der Beschreibungstext der Karte',
    },
    // Wir deaktivieren die 'children'-Steuerung, da wir sie manuell in einer Story zeigen
    children: {
      control: { disable: true },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// 1. Story: Die Karte mit Titel und Beschreibung (für unser Dashboard)
export const Default: Story = {
  args: {
    title: 'Kartentitel',
    description: 'Dies ist eine Beschreibung für die Standard-Karte.',
  },
}

// 2. Story: Die Karte als Container (für unsere Login-Seite)
export const AsContainer: Story = {
  args: {
    // Hier keine title/description props, nur children
  },
  render: (args) => (
    <Card {...args}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2>Beispiel-Container</h2>
        <p>Dieser Inhalt wird als 'children' übergeben.</p>
        <div style={{ alignSelf: 'flex-end' }}>
          <Button aria-label="Aktion">Aktion</Button>
        </div>
      </div>
    </Card>
  ),
}
