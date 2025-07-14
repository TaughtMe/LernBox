import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button/Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2>Beispielkarte</h2>
        <p>
          Dies ist ein Beispielinhalt für die Card-Komponente. Sie kann beliebige React-Knoten als `children` enthalten.
        </p>
        <div style={{ alignSelf: 'flex-end' }}>
          <Button label="Aktion" />
        </div>
      </div>
    </Card>
  ),
};