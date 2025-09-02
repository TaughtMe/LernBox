import React from 'react'
import { Button } from '../Button/Button'
import './SessionSettings.css'

type SessionSettingsProps = {
  learnMode: 'classic' | 'write'
  setLearnMode: (mode: 'classic' | 'write') => void
  queryDirection: 'q_to_a' | 'a_to_q' | 'mixed'
  setQueryDirection: (direction: 'q_to_a' | 'a_to_q' | 'mixed') => void
  isAutoSpeakEnabled: boolean
  setIsAutoSpeakEnabled: (update: React.SetStateAction<boolean>) => void
}

export const SessionSettings: React.FC<SessionSettingsProps> = ({
  learnMode,
  setLearnMode,
  queryDirection,
  setQueryDirection,
  isAutoSpeakEnabled,
  setIsAutoSpeakEnabled,
}) => {
  return (
    <div className="learn-settings">
      <div className="settings-group">
        <label>Modus:</label>
        <Button
          onClick={() => setLearnMode('classic')}
          variant={learnMode === 'classic' ? 'primary' : 'secondary'}
          aria-label="Klassisch"
        >
          Klassisch
        </Button>
        <Button
          onClick={() => setLearnMode('write')}
          variant={learnMode === 'write' ? 'primary' : 'secondary'}
          aria-label="Schreiben"
        >
          Schreiben
        </Button>
      </div>
      <div className="settings-group">
        <label>Richtung:</label>
        <Button
          onClick={() => setQueryDirection('q_to_a')}
          variant={queryDirection === 'q_to_a' ? 'primary' : 'secondary'}
          aria-label="Frage zu Antwort"
        >
          F → A
        </Button>
        <Button
          onClick={() => setQueryDirection('a_to_q')}
          variant={queryDirection === 'a_to_q' ? 'primary' : 'secondary'}
          aria-label="Antwort zu Frage"
        >
          A → F
        </Button>
        <Button
          onClick={() => setQueryDirection('mixed')}
          variant={queryDirection === 'mixed' ? 'primary' : 'secondary'}
          aria-label="Gemischt"
        >
          Gemischt
        </Button>
      </div>
      <div className="settings-group settings-group-toggle">
        <label htmlFor="auto-speak-toggle">Automatisch vorlesen:</label>
        <input
          type="checkbox"
          id="auto-speak-toggle"
          className="toggle-switch"
          checked={isAutoSpeakEnabled}
          onChange={() => setIsAutoSpeakEnabled((e) => !e)}
        />
      </div>
    </div>
  )
}
