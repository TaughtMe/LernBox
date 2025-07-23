import { useState, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const loadVoices = useCallback(() => {
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      setVoices(availableVoices);
    }
  }, []);

  useEffect(() => {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [loadVoices]);

  const speak = (text: string, lang: string) => {
    if (!text || !window.speechSynthesis) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    let bestVoice = voices.find(voice => voice.lang.startsWith(lang));
    if (!bestVoice) {
      bestVoice = voices.find(voice => voice.lang.split('-')[0] === lang);
    }
    if (bestVoice) {
      utterance.voice = bestVoice;
    } else {
      console.warn(`No voice found for language: ${lang}. Using default.`);
    }
    utterance.lang = lang;
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  // NEU: cancel-Funktion
  const cancel = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // NEU: cancel wird jetzt exportiert
  return { speak, cancel };
};