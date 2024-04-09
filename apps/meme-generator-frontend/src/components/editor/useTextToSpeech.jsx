import { useState, useEffect } from 'react';

const useTextToSpeech = (json) => {
    const [utterance, setUtterance] = useState(null);

    useEffect(() => {
        // Create a new instance of SpeechSynthesisUtterance
        const newUtterance = new SpeechSynthesisUtterance();
        setUtterance(newUtterance);

        return () => {
            // Clean up
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    useEffect(() => {
        if (json && utterance) {
            // Convert JSON object to string
            const text = JSON.stringify(json, null, 2);
            
            utterance.text = text;
            window.speechSynthesis.speak(utterance);
        }
    }, [json, utterance]);

    return {
    };
};

export default useTextToSpeech;
