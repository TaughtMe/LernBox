export interface Card {
  id: string
  question: string
  answer: string
}

export interface Deck {
  id: string
  title: string
  description: string
  cards: Card[]
}

export const mockDecks: Deck[] = [
  {
    id: '1',
    title: 'React Grundlagen',
    description: 'Die wichtigsten Konzepte von React.',
    cards: [
      {
        id: 'c1-1',
        question: 'Was ist JSX?',
        answer: 'Eine Syntaxerweiterung für JavaScript.',
      },
      {
        id: 'c1-2',
        question: 'Was ist ein Hook?',
        answer: 'Eine Funktion, um sich in React-Features "einzuklinken".',
      },
      {
        id: 'c1-3',
        question: 'Wofür wird `useState` verwendet?',
        answer: 'Um einer Komponente einen Zustands-State hinzuzufügen.',
      },
      {
        id: 'c1-4',
        question: 'Was ist der Unterschied zwischen `let` und `const`?',
        answer:
          '`let` deklariert eine veränderbare Variable, `const` eine unveränderbare Konstante.',
      },
    ],
  },
  {
    id: '2',
    title: 'JavaScript ES6',
    description: 'Neue Features in ECMAScript 2015.',
    cards: [
      {
        id: 'c2-1',
        question: 'Was ist eine Arrow-Function?',
        answer: 'Eine kompaktere Syntax für eine Funktions-Expression.',
      },
      {
        id: 'c2-2',
        question: 'Was machen Promises?',
        answer:
          'Sie repräsentieren den eventuellen Abschluss (oder Misserfolg) einer asynchronen Operation.',
      },
      {
        id: 'c2-3',
        question: 'Was ist Destructuring?',
        answer:
          'Eine Syntax, um Werte aus Arrays oder Eigenschaften aus Objekten in Variablen zu extrahieren.',
      },
    ],
  },
]
