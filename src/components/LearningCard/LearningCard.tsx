import SpeakerIcon from '../../assets/speaker.svg';
import './LearningCard.css';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import SafeHtmlRenderer from '../common/SafeHtmlRenderer';

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

// HTML → Plaintext für TTS
const stripHtml = (html: string) =>
  html.replace(/<[^>]*>?/gm, "") || "";

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
    speak(stripHtml(cardContent.front), lang);
  };

  const handleSpeakBack = () => {
    const lang = displayQuestion ? langBack : langFront;
    speak(stripHtml(cardContent.back), lang);
  };

  return (
    <div className="card-area" onClick={onCardClick}>
      {/* Vorderseite */}
      <div className="flashcard-panel">
        <div className="panel-header">
          <SpeakButton onSpeak={handleSpeakFront} />
        </div>
        <SafeHtmlRenderer
          htmlContent={cardContent.front}
          className="panel-content"
        />
      </div>

      {/* Rückseite */}
      <div className="flashcard-panel">
        <div className="panel-header">
          {isFlipped && <SpeakButton onSpeak={handleSpeakBack} />}
        </div>
        <SafeHtmlRenderer
          htmlContent={cardContent.back}
          className={`panel-content ${!isFlipped ? 'blurred' : ''}`}
        />
      </div>
    </div>
  );
};
