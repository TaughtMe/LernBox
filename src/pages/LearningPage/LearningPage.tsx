// src/pages/LearningPage/LearningPage.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useDecks } from '../../context/DeckContext'
import type { Card as CardType } from '../../context/DeckContext'
import { selectNextCard } from '../../services/leitnerService'
import { LearningCard } from '../../components/LearningCard/LearningCard'
import { SessionControls } from '../../components/SessionControls/SessionControls'
import { Button } from '../../components/Button/Button'
import { MdExitToApp } from 'react-icons/md'

type Direction = 'V→R' | 'R→V' | 'Gemischt'

const stripHtml = (html: string) => {
  const div = document.createElement('div')
  div.innerHTML = html ?? ''
  return (div.textContent || '').replace(/\s+/g, ' ').trim()
}
const normalize = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase()

const LearningPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { decks, answerCard } = useDecks()

  const modeFromURL =
    searchParams.get('mode') === 'Schreiben' ? 'write' : 'classic'
  const directionFromURL = (searchParams.get('direction') as Direction) || 'V→R'
  const levelFromURL = searchParams.get('level')

  const [currentCard, setCurrentCard] = useState<CardType | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [learnMode] = useState<'classic' | 'write'>(modeFromURL)
  const [displayQuestion, setDisplayQuestion] = useState(true)
  const [userAnswer, setUserAnswer] = useState('')
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'none'>(
    'none'
  )

  // Session-Zähler (stabil)
  const [sessionTotal, setSessionTotal] = useState(0) // konstante Startmenge N
  const [step, setStep] = useState(0) // 1..N
  const [sessionMastered, setSessionMastered] = useState(0) // korrekt beantwortet

  const deck = useMemo(
    () => decks.find((d) => d.id === deckId),
    [decks, deckId]
  )

  const filteredCards = useMemo(() => {
    if (!deck) return []
    if (!levelFromURL) return deck.cards
    const level = parseInt(levelFromURL, 10)
    return deck.cards.filter((card) => card.level === level)
  }, [deck, levelFromURL])

  // Start/Wechsel der Session → Startmenge und Zähler EINMAL setzen
  useEffect(() => {
    setSessionTotal(filteredCards.length)
    setStep(0)
    setSessionMastered(0)
    // absichtlich KEIN filteredCards.length in deps (N bleibt stabil)
  }, [deckId, levelFromURL, directionFromURL])

  // Nächste Karte laden
  const loadNextCard = useCallback(() => {
    if (filteredCards.length > 0) {
      const nextCard = selectNextCard(filteredCards)
      setCurrentCard(nextCard)

      switch (directionFromURL) {
        case 'R→V':
          setDisplayQuestion(false)
          break
        case 'Gemischt':
          setDisplayQuestion(Math.random() < 0.5)
          break
        default:
          setDisplayQuestion(true)
          break
      }

      setIsFlipped(false)
      setUserAnswer('')
      setIsAnswerChecked(false)
      setFeedback('none')

      // Schritt hochzählen (erster Aufruf sicher auf 1)
      setStep((s) => (s === 0 ? 1 : s + 1))
    } else {
      setCurrentCard(null)
    }
  }, [filteredCards, directionFromURL])

  // Nur beim Session-Start initial laden (kein Double-Trigger bei Kartenwechsel)
  useEffect(() => {
    loadNextCard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId, levelFromURL, directionFromURL])

  const handleAnswer = (wasCorrect: boolean) => {
    if (!deck || !currentCard) return

    if (wasCorrect) setSessionMastered((m) => m + 1)
    answerCard(deck.id, currentCard.id, wasCorrect)

    // ⬇️ Session automatisch beenden, sobald N Karten gezeigt wurden
    const plannedTotal = sessionTotal || filteredCards.length
    if (step >= plannedTotal) {
      setCurrentCard(null) // beendet die Abfrage; Abschlussansicht wird gezeigt
      return
    }

    loadNextCard()
  }

  const handleCheckAnswer = () => {
    if (!currentCard) return
    const correctAnswerHtml = displayQuestion
      ? (currentCard.answerHtml ?? (currentCard as any).answer ?? '')
      : (currentCard.questionHtml ?? (currentCard as any).question ?? '')
    const isCorrect =
      normalize(userAnswer) === normalize(stripHtml(correctAnswerHtml))
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    setIsAnswerChecked(true)
    setIsFlipped(true)
  }

  const handleNextCardClick = () => {
    if (feedback === 'none') return
    handleAnswer(feedback === 'correct')
  }

  // HTML-Inhalt für VS/RS
  const cardContent = useMemo(() => {
    if (!currentCard) return null
    const qHtml =
      currentCard.questionHtml ?? (currentCard as any).question ?? ''
    const aHtml = currentCard.answerHtml ?? (currentCard as any).answer ?? ''
    return {
      front: displayQuestion ? qHtml : aHtml,
      back: displayQuestion ? aHtml : qHtml,
    }
  }, [currentCard, displayQuestion])

  // Fortschritt für SessionControls
  const progress = useMemo(() => {
    return { mastered: sessionMastered, total: sessionTotal }
  }, [sessionMastered, sessionTotal])

  if (!deck) return <div>Deck nicht gefunden.</div>

  // Anzeige: Total sofort sinnvoll (falls sessionTotal noch 0 ist, nimm aktuelle Filtermenge)
  const displayedTotal = useMemo(() => {
    return sessionTotal || filteredCards.length || 0
  }, [sessionTotal, filteredCards.length])

  // Anzeige-Zähler: startet bei 1, sobald eine Karte sichtbar ist; klemmt oben auf Total
  const displayedStep = useMemo(() => {
    if (!currentCard) return 0
    const s = step === 0 ? 1 : step
    return Math.min(s, displayedTotal)
  }, [currentCard, step, displayedTotal])

  const renderFinished = () => (
    <div
      className="learning-finished page-section"
      style={{ textAlign: 'center' }}
    >
      <h2>Abfrage beendet</h2>
      <p>
        Du bist {displayedTotal} Karten durchgegangen. Davon korrekt:{' '}
        <strong>{sessionMastered}</strong>.
      </p>
      <div style={{ marginTop: '1rem' }}>
        <Button
          onClick={() => navigate(`/deck/${deckId}`)}
          variant="primary"
          aria-label="Zurück zum Deck"
        >
          Zurück zum Deck
        </Button>
      </div>
    </div>
  )

  return (
    <div className="learning-session-page">
      <header className="learning-session-header">
        <h1>
          Lernmodus: {deck.title} {levelFromURL && `(Level ${levelFromURL})`}
        </h1>
      </header>

      {currentCard && cardContent ? (
        <>
          <div className="learning-card">
            <LearningCard
              cardContent={cardContent}
              isFlipped={isFlipped}
              onCardClick={() =>
                learnMode === 'classic' && setIsFlipped((f) => !f)
              }
              langFront={deck.langFront}
              langBack={deck.langBack}
              queryDirection={directionFromURL}
              displayQuestion={displayQuestion}
            />
          </div>

          <div className="learning-session-controls">
            <SessionControls
              learnMode={learnMode}
              isFlipped={isFlipped}
              isAnswerChecked={isAnswerChecked}
              feedback={feedback}
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              onShowAnswer={() => setIsFlipped(true)}
              onEvaluate={handleAnswer}
              onCheckAnswer={handleCheckAnswer}
              onNextCardClick={handleNextCardClick}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (
                  e.key === 'Enter' &&
                  learnMode === 'write' &&
                  !isAnswerChecked
                )
                  handleCheckAnswer()
              }}
              progress={progress}
            />
          </div>
        </>
      ) : (
        renderFinished()
      )}

      <footer className="learning-session-footer">
        <Button
          onClick={() => navigate(`/deck/${deckId}`)}
          variant="secondary"
          isIconOnly
          aria-label="Session beenden"
        >
          <MdExitToApp />
        </Button>
        {currentCard && (
          <span>
            Karte {displayedStep} von {displayedTotal}
          </span>
        )}
      </footer>
    </div>
  )
}

export default LearningPage
