import React from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import './SessionControls.css';

type SessionControlsProps = {
  // Zustände
  learnMode: 'classic' | 'write';
  isFlipped: boolean;
  isAnswerChecked: boolean;
  feedback: 'correct' | 'incorrect' | 'none';
  userAnswer: string;
  
  // Funktionen
  setUserAnswer: (value: string) => void;
  onShowAnswer: () => void;
  onEvaluate: (wasCorrect: boolean) => void;
  onCheckAnswer: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  // Daten für die Anzeige
  progress: {
    mastered: number;
    total: number;
  };
  backTitle?: string;
};

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
  onKeyDown,
  progress,
  backTitle
}) => {
  return (
    <div className="session-controls-container">
       <p className="card-counter">
        Fortschritt: {progress.mastered} von {progress.total} gemeistert
      </p>

      {learnMode === 'classic' && (
        <div className="navigation-buttons">
          {!isFlipped ? (
            <Button onClick={onShowAnswer} label="Antwort aufdecken" primary fullWidth />
          ) : (
            <div className="evaluation-buttons">
              <Button onClick={() => onEvaluate(false)} label="Falsch" />
              <Button onClick={() => onEvaluate(true)} label="Richtig" primary />
            </div>
          )}
        </div>
      )}

      {learnMode === 'write' && (
        <>
          <div className="write-mode-input-area">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={`${backTitle} eingeben...`}
              className={`write-input ${feedback !== 'none' ? `input-${feedback}` : ''}`}
              disabled={isAnswerChecked}
              onKeyDown={onKeyDown}
            />
          </div>
          
          <div className="navigation-buttons">
            {!isAnswerChecked ? (
              <Button onClick={onCheckAnswer} label="Prüfen" primary fullWidth disabled={userAnswer.trim() === ''} />
            ) : (
              <div className="evaluation-feedback">
                {feedback === 'correct' ? 'Richtig! ✨' : 'Falsch. Die korrekte Antwort wird angezeigt.'}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};