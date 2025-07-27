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
          label="Klassisch"
          primary={learnMode === 'classic'}
        />
        <Button
          onClick={() => setLearnMode('write')}
          label="Schreiben"
          primary={learnMode === 'write'}
        />
      </div>
      <div className="settings-group">
        <label>Richtung:</label>
        <Button
          onClick={() => setQueryDirection('q_to_a')}
          label="F → A"
          primary={queryDirection === 'q_to_a'}
        />
        <Button
          onClick={() => setQueryDirection('a_to_q')}
          label="A → F"
          primary={queryDirection === 'a_to_q'}
        />
        <Button
          onClick={() => setQueryDirection('mixed')}
          label="Gemischt"
          primary={queryDirection === 'mixed'}
        />
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
