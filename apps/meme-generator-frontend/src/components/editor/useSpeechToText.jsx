import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export function useSpeech(addTextArea, updateTextArea, deleteTextArea, setName, textAreas) {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition( { continuous: true });

    const [wasListening, setWasListening] = useState(false);

    const toggleListening = () => {
        if (browserSupportsSpeechRecognition) {
            if (listening) {
                SpeechRecognition.stopListening();
            } else {
                SpeechRecognition.startListening();
            }
        }
    };

    const writtenNumberToInt = (numberString) => {
        numberString = numberString ?? 'one';
        const numberMap = {
            'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
            'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
            'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
            'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20
        };
        return numberMap[numberString.toLowerCase()] || -1;
    };

    useEffect(() => {
        if (wasListening && !listening && transcript) {
            const commands = transcript.split(' ');
            const firstCommand = commands[0].toLowerCase();

            console.log(commands);

            if ((firstCommand === 'delete' || firstCommand === 'remove') && commands[1]?.toLowerCase() === 'text') {
                const index = writtenNumberToInt(commands[2]) - 1;
                if (!isNaN(index) && index >= 0 && index < textAreas.length) {
                    deleteTextArea(index);
                }
            } else if ((firstCommand === 'update' || firstCommand === 'change' || firstCommand === 'alter') && commands[1]?.toLowerCase() === 'text') {
                const index = writtenNumberToInt(commands[2]) - 1;
                if (!isNaN(index) && index >= 0 && index < textAreas.length) {
                    updateTextArea(index);
                }
            } else if (firstCommand === 'add' || firstCommand === 'create' || firstCommand === 'insert') {
                const newText = commands.slice(1).join(' '); // Remove "add"
                addTextArea(newText);
            } else if (firstCommand === 'title') {
                const newTitle = commands.slice(1).join(' '); // Remove "title"
                setName(newTitle);
            }

            resetTranscript();
        }
        setWasListening(listening);
    }, [listening, transcript, resetTranscript, addTextArea, deleteTextArea, setName, textAreas]);


    return {
        toggleListening,
        listening,
        browserSupportsSpeechRecognition,
        transcript
    };
}
