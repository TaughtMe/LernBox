import React from 'react'
import SpeakerIcon from '../../assets/speaker.svg'
import './LearningCard.css'

import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'

type CardContent = {
  front: string
  back: string
}

type LearningCardProps = {
  cardContent: CardContent
  isFlipped: boolean
  onCardClick: () => void
  langFront: string // NEU
  langBack: string  // NEU
}

const SpeakButton = ({ onSpeak }: { onSpeak: () => void }) => (
  <button
    className="speak-button"
    onClick={(e) => {
      e.stopPropagation()
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
  langFront, // NEU
  langBack,   // NEU
}) => {
  const { speak } = useSpeechSynthesis()

  // Die alte handleSpeak Funktion mit Spracherkennung wird nicht mehr benötigt.

  return (
    <div className="card-area" onClick={onCardClick}>
      {/* VORDERSEITE */}
      <div className="flashcard-panel">
        <div className="panel-header">
          {/* NEU: Die definierte Sprache 'langFront' wird direkt verwendet */}
          <SpeakButton onSpeak={() => speak(cardContent.front, langFront)} />
        </div>
        <p className="panel-content">{cardContent.front}</p>
      </div>

      {/* RÜCKSEITE */}
      <div className="flashcard-panel">
        <div className="panel-header">
          {isFlipped && (
            // NEU: Die definierte Sprache 'langBack' wird direkt verwendet
            <SpeakButton onSpeak={() => speak(cardContent.back, langBack)} />
          )}
        </div>
        <p className={`panel-content ${!isFlipped ? 'blurred' : ''}`}>
          {cardContent.back}
        </p>
      </div>
    </div>
  )
}