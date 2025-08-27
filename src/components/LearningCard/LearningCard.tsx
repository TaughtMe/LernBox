import React from 'react';
import SpeakerIcon from '../../assets/speaker.svg';
import './LearningCard.css';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import SafeHtmlRenderer from '../common/SafeHtmlRenderer'; // NEUER IMPORT

type CardContent = {
  front: string;
  back: string;
};

type LearningCardProps = {
  cardContent: CardContent;
  isFlipped: boolean;
  onCardClick: () => void;
  langFront: string;
  langBack: string;
  displayQuestion: boolean;
  queryDirection: string;
};

// Hilfsfunktion, um HTML in reinen Text umzuwandeln
const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const SpeakButton = ({ onSpeak }: { onSpeak: () => void }) => (
  <button
    className="speak-button"
    onClick={(e) => {
      e.stopPropagation();
      onSpeak();
    }}
    aria-label="Text vorlesen"
  >
    <img src={SpeakerIcon} alt="Vorlesen" />
  </button>
);

export const LearningCard: React.FC<LearningCardProps> = ({
  cardContent,
  isFlipped,
  onCardClick,
  langFront,
  langBack,
  displayQuestion,
}) => {
  const { speak } = useSpeechSynthesis();

  const handleSpeakFront = () => {
    const lang = displayQuestion ? langFront : langBack;
    // ANGEPASST: HTML wird vor dem Sprechen in Text umgewandelt
    speak(stripHtml(cardContent.front), lang);
  };

  const handleSpeakBack = () => {
    const lang = displayQuestion ? langBack : langFront;
    // ANGEPASST: HTML wird vor dem Sprechen in Text umgewandelt
    speak(stripHtml(cardContent.back), lang);
  };

  return (
    <div className="card-area" onClick={onCardClick}>
      {/* VORDERSEITE */}
      <div className="flashcard-panel">
        <div className="panel-header">
          <SpeakButton onSpeak={handleSpeakFront} />
        </div>
        {/* ERSETZT durch SafeHtmlRenderer */}
        <SafeHtmlRenderer
          htmlContent={cardContent.front}
          className="panel-content"
        />
      </div>

      {/* RÜCKSEITE */}
      <div className="flashcard-panel">
        <div className="panel-header">
          {isFlipped && <SpeakButton onSpeak={handleSpeakBack} />}
        </div>
        {/* ERSETZT durch SafeHtmlRenderer */}
        <SafeHtmlRenderer
          htmlContent={cardContent.back}
          className={`panel-content ${!isFlipped ? 'blurred' : ''}`}
        />
      </div>
    </div>
  );
};