import { useState, useEffect, useCallback } from 'react';

const useTextToSpeech = () => {
    const [utterance, setUtterance] = useState(new SpeechSynthesisUtterance());

    const speak = useCallback((text) => {
        if (text && utterance && window.speechSynthesis) {
            utterance.text = text;
            window.speechSynthesis.speak(utterance);
        }
    }, [utterance]);

    const cancel = useCallback(() => {
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
    }, []);

    useEffect(() => {
        utterance.voice = window.speechSynthesis.getVoices().find(voice => voice.lang === 'en-US'); // Example: selecting a voice
        utterance.pitch = 1; // Normal pitch
        utterance.rate = 1; // Normal rate

        return () => {
            cancel();
        };
    }, [cancel, utterance]);

    return {
        speak,
        cancel
    };
};

export default useTextToSpeech;
