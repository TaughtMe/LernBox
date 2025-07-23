import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDecks } from '../../context/DeckContext';
import type { Card as CardType } from '../../context/DeckContext';
import { selectNextCard } from '../../services/leitnerService';
import { LearningCard } from '../../components/LearningCard/LearningCard';
import { SessionControls } from '../../components/SessionControls/SessionControls';

const LearningPage: React.FC = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { decks, answerCard } = useDecks();

    // Einstellungen aus der URL lesen
    const modeFromURL = searchParams.get('mode') === 'Schreiben' ? 'write' : 'classic';
    const directionFromURL = searchParams.get('direction') || 'V→R';
    const levelFromURL = searchParams.get('level'); // NEU: Level auslesen

    const [currentCard, setCurrentCard] = useState<CardType | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [learnMode] = useState<'classic' | 'write'>(modeFromURL);
    const [displayQuestion, setDisplayQuestion] = useState(true);
    const [userAnswer, setUserAnswer] = useState('');
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'none'>('none');

    const deck = useMemo(() => decks.find(d => d.id === deckId), [decks, deckId]);

    // NEU: Kartenliste basierend auf dem Level aus der URL filtern
    const filteredCards = useMemo(() => {
        if (!deck) return [];
        // Wenn kein Level übergeben wurde, alle Karten nehmen (Fallback)
        if (!levelFromURL) return deck.cards;
        
        const level = parseInt(levelFromURL, 10);
        return deck.cards.filter(card => card.level === level);
    }, [deck, levelFromURL]);

    const loadNextCard = useCallback(() => {
        // KORREKTUR: Die gefilterte Liste verwenden
        if (filteredCards.length > 0) {
            const nextCard = selectNextCard(filteredCards);
            setCurrentCard(nextCard);

            switch (directionFromURL) {
                case 'R→V': setDisplayQuestion(false); break;
                case 'Gemischt': setDisplayQuestion(Math.random() < 0.5); break;
                default: setDisplayQuestion(true); break;
            }

            setIsFlipped(false);
            setUserAnswer('');
            setIsAnswerChecked(false);
            setFeedback('none');
        } else {
            setCurrentCard(null); // Keine Karten mehr in diesem Level
        }
    }, [filteredCards, directionFromURL]); // Abhängigkeit geändert

    useEffect(() => {
        loadNextCard();
    }, [loadNextCard]);

    const handleAnswer = (wasCorrect: boolean) => {
        if (!deck || !currentCard) return;
        answerCard(deck.id, currentCard.id, wasCorrect);
        loadNextCard();
    };

    const handleCheckAnswer = () => {
        if (!currentCard) return;
        const correctAnswer = displayQuestion ? currentCard.answer : currentCard.question;
        const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        setFeedback(isCorrect ? 'correct' : 'incorrect');
        setIsAnswerChecked(true);
        setIsFlipped(true);
        setTimeout(() => handleAnswer(isCorrect), 1500);
    };

    const cardContent = useMemo(() => {
        if (!currentCard) return null;
        return {
            front: displayQuestion ? currentCard.question : currentCard.answer,
            back: displayQuestion ? currentCard.answer : currentCard.question,
        };
    }, [currentCard, displayQuestion]);

    // KORREKTUR: Fortschritt basiert auf der gefilterten Liste
    const progress = useMemo(() => {
        if (!deck) return { mastered: 0, total: 0 };
        const masteredCount = filteredCards.filter(c => c.level === 5).length;
        return { mastered: masteredCount, total: filteredCards.length };
    }, [deck, filteredCards]);

    if (!deck) return <div>Deck nicht gefunden.</div>;

    return (
        <div className="learning-session-page">
            <header className="learning-session-header">
                {/* Titel zeigt jetzt das Level an, falls vorhanden */}
                <h1>Lernmodus: {deck.title} {levelFromURL && `(Level ${levelFromURL})`}</h1>
            </header>

            {currentCard && cardContent ? (
                <>
                    <div className="learning-card">
                        <LearningCard
                            cardContent={cardContent}
                            isFlipped={isFlipped}
                            onCardClick={() => learnMode === 'classic' && setIsFlipped(f => !f)}
                        />
                    </div>
                    <div className="learning-session-controls">
                        <SessionControls
                            learnMode={learnMode}
                            isFlipped={isFlipped}
                            isAnswerChecked={isAnswerChecked}
                            feedback={feedback}
                            userAnswer={userAnswer}
                            setUserAnswer={setUserAnswer}
                            onShowAnswer={() => setIsFlipped(true)}
                            onEvaluate={handleAnswer}
                            onCheckAnswer={handleCheckAnswer}
                            onKeyDown={(e: React.KeyboardEvent) => {
                                if (e.key === 'Enter' && learnMode === 'write' && !isAnswerChecked) handleCheckAnswer();
                            }}
                            progress={progress}
                        />
                    </div>
                </>
            ) : (
                <div>Glückwunsch! Alle Karten in diesem Level sind gelernt.</div>
            )}

            <footer className="learning-session-footer">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/deck/${deckId}`); }}>
                    Session beenden
                </a>
                {/* KORREKTUR: Zähler basiert auf der gefilterten Liste */}
                <span>Karte {filteredCards.findIndex(c => c.id === currentCard?.id) + 1} von {filteredCards.length}</span>
            </footer>
        </div>
    );
};

export default LearningPage;