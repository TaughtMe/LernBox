import SpeakerIcon from '../../assets/speaker.svg'
import './LearningCard.css'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'
import SafeHtmlRenderer from '../common/SafeHtmlRenderer'

type CardContent = {
  front?: string
  back?: string
  // Fallbacks für sehr alte Backups:
  questionHtml?: string
  answerHtml?: string
}

type LearningCardProps = {
  cardContent: CardContent
  isFlipped: boolean
  onCardClick: () => void
  langFront: string
  langBack: string
  displayQuestion: boolean
  queryDirection: string
}

// HTML → Plaintext für TTS, robust
const htmlToText = (html?: string) => {
  const div = document.createElement('div')
  div.innerHTML = html ?? ''
  return (div.textContent || '').replace(/\s+/g, ' ').trim()
}

const SpeakButton = ({ onSpeak }: { onSpeak: () => void }) => (
  <button
    className="speak-button"
    onClick={(e) => {
      e.stopPropagation()
      onSpeak()
    }}
    aria-label="Text vorlesen"
    type="button"
  >
    <img src={SpeakerIcon} alt="Vorlesen" />
  </button>
)

const LearningCard: React.FC<LearningCardProps> = ({
  cardContent,
  isFlipped,
  onCardClick,
  langFront,
  langBack,
  displayQuestion,
}) => {
  const { speak } = useSpeechSynthesis()

  // Immer HTML liefern (Fallbacks für alte Felder)
  const frontHtml = cardContent.front ?? cardContent.questionHtml ?? ''
  const backHtml = cardContent.back ?? cardContent.answerHtml ?? ''

  const handleSpeakFront = () => {
    const lang = displayQuestion ? langFront : langBack
    const text = displayQuestion ? htmlToText(frontHtml) : htmlToText(backHtml)
    if (text) speak(text, lang)
  }

  const handleSpeakBack = () => {
    const lang = displayQuestion ? langBack : langFront
    const text = displayQuestion ? htmlToText(backHtml) : htmlToText(frontHtml)
    if (text) speak(text, lang)
  }

  return (
    <div className="card-area" onClick={onCardClick}>
      {/* Vorderseite */}
      <div className="flashcard-panel">
        <div className="panel-header">
          <SpeakButton onSpeak={handleSpeakFront} />
        </div>
        <SafeHtmlRenderer htmlContent={frontHtml} className="panel-content" />
      </div>

      {/* Rückseite */}
      <div className="flashcard-panel">
        <div className="panel-header">
          {isFlipped && <SpeakButton onSpeak={handleSpeakBack} />}
        </div>
        <SafeHtmlRenderer
          htmlContent={backHtml}
          className={`panel-content ${!isFlipped ? 'blurred' : ''}`}
        />
      </div>
    </div>
  )
}

export default LearningCard
export { LearningCard }
