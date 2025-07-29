import React from 'react'
import { Button } from '../Button/Button'
import { Input } from '../Input/Input'
import './SessionControls.css'
import { MdCheck, MdClose } from 'react-icons/md'

type SessionControlsProps = {
  // Zustände
  learnMode: 'classic' | 'write'
  isFlipped: boolean
  isAnswerChecked: boolean
  feedback: 'correct' | 'incorrect' | 'none'
  userAnswer: string
  onNextCardClick: () => void

  // Funktionen
  setUserAnswer: (value: string) => void
  onShowAnswer: () => void
  onEvaluate: (wasCorrect: boolean) => void
  onCheckAnswer: () => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void

  // Daten für die Anzeige
  progress: {
    mastered: number
    total: number
  }
  backTitle?: string
}

export const SessionControls: React.FC<SessionControlsProps> = ({
  learnMode,
  isFlipped,
  isAnswerChecked,
  feedback,
  userAnswer,
  setUserAnswer,
  onShowAnswer,
  onEvaluate,
  onCheckAnswer,
  onNextCardClick,
  onKeyDown,
  progress,
  backTitle,
}) => {
  return (
    <div className="session-controls-container">
      <p className="card-counter">
        Fortschritt: {progress.mastered} von {progress.total} gemeistert
      </p>

      {learnMode === 'classic' && (
        <div className="navigation-buttons">
          {!isFlipped ? (
            <Button
              onClick={onShowAnswer}
              variant="primary"
              fullWidth
              aria-label="Antwort aufdecken"
            >
              Antwort aufdecken
            </Button>
          ) : (
            <div className="evaluation-buttons">
              <Button
                onClick={() => onEvaluate(false)}
                variant="danger"
                aria-label="Falsch"
                isIconOnly // <-- Wichtig
              >
                <MdClose />
              </Button>
              <Button
                onClick={() => onEvaluate(true)}
                variant="success"
                aria-label="Richtig"
                isIconOnly // <-- Wichtig
              >
                <MdCheck />
              </Button>
            </div>
          )}
        </div>
      )}

      {learnMode === 'write' && (
        <>
          {/* Der 'write'-Modus bleibt unverändert */}
          <div className="write-mode-input-area">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={`Antwort eingeben...`}
              className={`write-input ${feedback !== 'none' ? `input-${feedback}` : ''}`}
              disabled={isAnswerChecked}
              onKeyDown={onKeyDown}
            />
          </div>
          <div className="navigation-buttons">
            {!isAnswerChecked ? (
              <Button
                onClick={onCheckAnswer}
                variant="primary"
                fullWidth
                disabled={userAnswer.trim() === ''}
                aria-label="Prüfen"
              >
                Prüfen
              </Button>
            ) : (
              <>
                <div className="evaluation-feedback" style={{ marginBottom: '1rem' }}>
                  {feedback === 'correct'
                    ? 'Richtig! ✨'
                    : 'Falsch. Die korrekte Antwort wird angezeigt.'}
                </div>
                <Button
                  onClick={onNextCardClick}
                  variant="success"
                  fullWidth
                  aria-label="Weiter"
                >
                  Weiter
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}