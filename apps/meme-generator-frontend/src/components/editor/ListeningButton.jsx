import React, { useEffect } from 'react';

const ListeningButton = ({ toggleListening, listening, transcript, browserSupportsSpeechRecognition }) => {
    // Commands list
    const commands = [
        'insert "your text"',
        'delete text "number"',
        'change text "number" "text"',
        'title "Title name"'
    ];

    // useEffect hook to show/hide the modal based on the 'listening' state
    useEffect(() => {
        const modal = document.getElementById('speech_modal');
        if (listening) {
            modal.showModal();
        } else {
            modal.close();
        }
    }, [listening]);

    // Function to handle modal close and stop listening
    const handleClose = () => {
        if (listening) {
            toggleListening();
        }
    };

    return (
        <>
            <button 
                className="btn listening-button" 
                onClick={toggleListening}
                aria-label={listening ? 'Stop Listening' : 'Start Listening'}
                type="button"
                disabled={!browserSupportsSpeechRecognition}
            >
                {listening ? 'Stop Listening' : 'Start Listening'}
            </button>
            <dialog id="speech_modal" className="modal" onClose={handleClose}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Listening...</h3>
                    <div className="flex flex-col w-full border-opacity-50">
                            <ul className="">
                                {commands.map((command, index) => (
                                    <li key={index}>{command}</li>
                                ))}
                            </ul>
                        <div className="divider">Transcript</div>
                        <p className="py-4">{transcript}</p>
                    </div>
                    <div className="modal-action">
                        <button className="btn" onClick={handleClose}>Close</button>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default ListeningButton;
