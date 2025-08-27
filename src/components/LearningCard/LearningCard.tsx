import React from 'react'
import SpeakerIcon from '../../assets/speaker.svg'
import './LearningCard.css'

import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'

type CardContent = {
  front: string
  back: string
}

// Die Props-Definition wird hier korrigiert
type LearningCardProps = {
  cardContent: CardContent
  isFlipped: boolean
  onCardClick: () => void
  langFront: string
  langBack: string
  displayQuestion: boolean
  queryDirection: string // KORREKTUR: Diese Zeile wird wieder hinzugefügt
}

const SpeakButton = ({ onSpeak }: { onSpeak: () => void }) => (
  <button
    className="speak-button"
    onClick={(e) => {
      e.stopPropagation() // Verhindert, dass der Klick die Karte umdreht
      onSpeak()
    }}
    aria-label="Text vorlesen"
  >
    <img src={SpeakerIcon} alt="Vorlesen" />
  </button>
)

export const LearningCard: React.FC<LearningCardProps> = ({
  cardContent,
  isFlipped,
  onCardClick,
  langFront,
  langBack,
  displayQuestion,
  // queryDirection wird hier zwar empfangen, aber für die Logik nicht benötigt
}) => {
  const { speak } = useSpeechSynthesis()

  const handleSpeakFront = () => {
    const lang = displayQuestion ? langFront : langBack
    speak(cardContent.front, lang)
  }

  const handleSpeakBack = () => {
    const lang = displayQuestion ? langBack : langFront
    speak(cardContent.back, lang)
  }

  return (
    <div className="card-area" onClick={onCardClick}>
      {/* VORDERSEITE */}
      <div className="flashcard-panel">
        <div className="panel-header">
          <SpeakButton onSpeak={handleSpeakFront} />
        </div>
        <p className="panel-content">{cardContent.front}</p>
      </div>

      {/* RÜCKSEITE */}
      <div className="flashcard-panel">
        <div className="panel-header">
          {isFlipped && (
            <SpeakButton onSpeak={handleSpeakBack} />
          )}
        </div>
        <p className={`panel-content ${!isFlipped ? 'blurred' : ''}`}>
          {cardContent.back}
        </p>
      </div>
    </div>
  )
}