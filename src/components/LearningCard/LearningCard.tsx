import React from 'react';
import SpeakerIcon from '../../assets/speaker.svg';
import './LearningCard.css';

// NEUE IMPORTS
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { detectLanguage } from '../../services/languageService';

type CardContent = {
  front: string;
  back: string; 
  
};

// PROPS ANGEPASST: Die 'speak' Prop wird entfernt
type LearningCardProps = {
  cardContent: CardContent;
  isFlipped: boolean;
  onCardClick: () => void;
};

// Der SpeakButton wird leicht angepasst, um eine generische onSpeak Funktion zu erhalten
const SpeakButton = ({ onSpeak }: { onSpeak: () => void }) => (
  <button
    className="speak-button"
    onClick={(e) => {
      e.stopPropagation(); // Verhindert, dass der Klick die Karte umdreht
      onSpeak();
    }}
    aria-label="Text vorlesen"
  >
    <img src={SpeakerIcon} alt="Vorlesen" />
  </button>
);

export const LearningCard: React.FC<LearningCardProps> = ({ cardContent, isFlipped, onCardClick }) => {
  // HIER WERDEN HOOK & SERVICE INTEGRIERT
  const { speak } = useSpeechSynthesis();

  // Diese Handler-Funktion kombiniert Spracherkennung und -ausgabe
  const handleSpeak = (text: string) => {
    const lang = detectLanguage(text);
    speak(text, lang);
  };

  return (
    <div className="card-area" onClick={onCardClick}>
      {/* VORDERSEITE */}
      <div className="flashcard-panel">
        <div className="panel-header">
  
          <SpeakButton onSpeak={() => handleSpeak(cardContent.front)} />
        </div>
        <p className="panel-content">{cardContent.front}</p>
      </div>

      {/* RÜCKSEITE */}
      <div className="flashcard-panel">
        <div className="panel-header">
          
          {/* REGEL: Der Button für die Rückseite ist nur sichtbar, wenn die Karte umgedreht ist */}
          {isFlipped && (
            <SpeakButton onSpeak={() => handleSpeak(cardContent.back)} />
          )}
        </div>
        <p className={`panel-content ${!isFlipped ? 'blurred' : ''}`}>
          {cardContent.back}
        </p>
      </div>
    </div>
  );
};