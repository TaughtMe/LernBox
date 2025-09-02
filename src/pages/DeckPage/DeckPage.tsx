// src/pages/DeckPage/DeckPage.tsx
import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDecks } from '../../context/DeckContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { CardListEditor } from '../../components/CardListEditor/CardListEditor'
import { Button } from '../../components/Button/Button'
import { MdQrCode, MdExitToApp } from 'react-icons/md'
import { LanguageSelector } from '../../components/LanguageSelector/LanguageSelector'
import QRScanModal from '../../components/QR/QRScanModal'

type LearnMode = 'Klassisch' | 'Schreiben'
type LearnDirection = 'V→R' | 'R→V' | 'Gemischt'

const DeckPage: React.FC = () => {
  const navigate = useNavigate()
  const { deckId } = useParams<{ deckId: string }>()
  const {
    decks,
    addCardToDeck,
    deleteCardFromDeck,
    updateCardInDeck,
    addMultipleCardsToDeck,
    updateDeckLanguages,
  } = useDecks()

  const [learnMode, setLearnMode] = useLocalStorage<LearnMode>(
    'learnModeSetting',
    'Klassisch'
  )
  const [learnDirection, setLearnDirection] = useLocalStorage<LearnDirection>(
    'learnDirectionSetting',
    'V→R'
  )
  const [sortCriteria, setSortCriteria] = useState('default')

  // QR-Scanner Modal
  const [scanOpen, setScanOpen] = useState(false)

  const currentDeck = useMemo(
    () => decks.find((d) => d.id === deckId),
    [decks, deckId]
  )

  const languageOptions = [
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'Englisch' },
  ]

  const cardsByLevel = useMemo(() => {
    const groups: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    if (currentDeck) {
      currentDeck.cards.forEach((card) => {
        if (groups[card.level] !== undefined) {
          groups[card.level]++
        }
      })
    }
    return groups
  }, [currentDeck])

  // HTML → Plaintext für Sortierung
  const htmlToPlainText = (html?: string) => {
    if (!html) return ''
    const div = document.createElement('div')
    div.innerHTML = html
    return (div.textContent || '').trim()
  }

  const collator = new Intl.Collator(undefined, {
    sensitivity: 'base',
    numeric: true,
  })

  const sortedCards = useMemo(() => {
    if (!currentDeck) return []
    const cardsToSort = [...currentDeck.cards]
    switch (sortCriteria) {
      case 'question-asc':
        return cardsToSort.sort((a, b) =>
          collator.compare(
            htmlToPlainText((a as any).questionHtml ?? (a as any).question),
            htmlToPlainText((b as any).questionHtml ?? (b as any).question)
          )
        )
      case 'answer-asc':
        return cardsToSort.sort((a, b) =>
          collator.compare(
            htmlToPlainText((a as any).answerHtml ?? (a as any).answer),
            htmlToPlainText((b as any).answerHtml ?? (b as any).answer)
          )
        )
      case 'level-asc':
        return cardsToSort.sort((a, b) => (a.level ?? 1) - (b.level ?? 1))
      case 'default':
      default:
        return cardsToSort
    }
  }, [currentDeck, sortCriteria])

  // Scan-Handler
  const handleScanSuccess = (d: {
    questionHtml: string
    answerHtml: string
  }) => {
    if (!deckId) return
    addCardToDeck(deckId, {
      questionHtml: d.questionHtml,
      answerHtml: d.answerHtml,
    })
    alert('Karte aus QR-Code hinzugefügt')
    setScanOpen(false)
  }

  const handleScanManySuccess = (
    items: { questionHtml: string; answerHtml: string }[]
  ) => {
    if (!deckId || !items?.length) return
    addMultipleCardsToDeck(deckId, items)
    alert(`${items.length} Karten aus QR-Codes hinzugefügt`)
    setScanOpen(false)
  }

  const startLearningSession = (level: number) => {
    navigate(
      `/learn/${deckId}?mode=${learnMode}&direction=${learnDirection}&level=${level}`
    )
  }

  if (!deckId || !currentDeck) {
    return (
      <div>
        Deck nicht gefunden. <a href="/">Zurück zur Übersicht</a>
      </div>
    )
  }

  return (
    <>
      <header className="deck-page-header page-section">
        <h1>{currentDeck.title}</h1>
        <Button
          onClick={() => navigate('/dashboard')}
          variant="secondary"
          isIconOnly
          aria-label="Zur Stapel-Übersicht"
        >
          <MdExitToApp />
        </Button>
      </header>

      {/* Sektion 1: Einstellungen */}
      <div className="card page-section">
        <h2 style={{ marginTop: 0 }}>Einstellungen</h2>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* Erste Reihe */}
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div className="control-group" style={{ flex: 1 }}>
              <label className="control-group-label">Lernmodus</label>
              <div className="segmented-control">
                <button
                  className={learnMode === 'Klassisch' ? 'active' : ''}
                  onClick={() => setLearnMode('Klassisch')}
                >
                  Klassisch
                </button>
                <button
                  className={learnMode === 'Schreiben' ? 'active' : ''}
                  onClick={() => setLearnMode('Schreiben')}
                >
                  Schreiben
                </button>
              </div>
            </div>
            <div className="control-group" style={{ flex: 1 }}>
              <label className="control-group-label">Lernrichtung</label>
              <div className="segmented-control">
                <button
                  className={learnDirection === 'V→R' ? 'active' : ''}
                  onClick={() => setLearnDirection('V→R')}
                >
                  VS→RS
                </button>
                <button
                  className={learnDirection === 'R→V' ? 'active' : ''}
                  onClick={() => setLearnDirection('R→V')}
                >
                  RS→VS
                </button>
                <button
                  className={learnDirection === 'Gemischt' ? 'active' : ''}
                  onClick={() => setLearnDirection('Gemischt')}
                >
                  Gemischt
                </button>
              </div>
            </div>
          </div>

          {/* Zweite Reihe */}
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div className="control-group" style={{ flex: 1 }}>
              <LanguageSelector
                label="Sprache Vorderseite"
                options={languageOptions}
                selectedOptionCode={currentDeck.langFront}
                onSelect={(code) =>
                  updateDeckLanguages(deckId, {
                    langFront: code,
                    langBack: currentDeck.langBack,
                  })
                }
              />
            </div>
            <div className="control-group" style={{ flex: 1 }}>
              <LanguageSelector
                label="Sprache Rückseite"
                options={languageOptions}
                selectedOptionCode={currentDeck.langBack}
                onSelect={(code) =>
                  updateDeckLanguages(deckId, {
                    langFront: currentDeck.langFront,
                    langBack: code,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sektion 2: Deine Lernlevel */}
      <section className="page-section">
        <h2 style={{ marginLeft: '1.5rem' }}>Deine Lernlevel</h2>
        <div className="level-grid">
          {Object.entries(cardsByLevel).map(([level, count]) => (
            <div key={level} className={`level-card level-${level}`}>
              <h3>Level {level}</h3>
              <p className="card-count">{count} Karten</p>
              <button
                className="btn btn-secondary"
                disabled={count === 0}
                onClick={() => startLearningSession(parseInt(level))}
              >
                Starten
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Sektion 3: Kartenverwaltung */}
      <section className="card page-section">
        {/* QR-Scan: Karte via QR-Code hinzufügen */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '0.75rem',
          }}
        >
          <Button
            onClick={() => setScanOpen(true)}
            variant="primary"
            aria-label="Mehrere Karten via QR-Code hinzufügen"
          >
            <MdQrCode style={{ marginRight: 6 }} />
            Karten durch QR-Code hinzufügen
          </Button>
        </div>

        <CardListEditor
          deckId={deckId}
          cards={sortedCards}
          onAddCard={addCardToDeck}
          onDeleteCard={deleteCardFromDeck}
          onUpdateCard={updateCardInDeck}
          addMultipleCardsToDeck={addMultipleCardsToDeck}
          sortCriteria={sortCriteria}
          setSortCriteria={setSortCriteria}
        />
      </section>

      {/* Scan-Modal */}
      <QRScanModal
        isOpen={scanOpen}
        onClose={() => setScanOpen(false)}
        mode="multi"
        onSuccess={handleScanSuccess} // falls ein Einzel-QR gescannt wird
        onSuccessMany={handleScanManySuccess}
      />
    </>
  )
}

export default DeckPage
