import React, { useEffect } from 'react';

const ListeningButton = ({ toggleListening, listening, transcript, browserSupportsSpeechRecognition }) => {
    // Commands list
    const commands = [
        'insert "text"',
        'delete "number"',
        'change "number" to "text"',
        'title "Title name"'
    ];

    useEffect(() => {
        const modal = document.getElementById('speech_modal');
        if (listening) {
            modal.showModal();
        } else {
            modal.close();
        }
    }, [listening]);

    const handleClose = () => {
        if (listening) {
            toggleListening();
        }
    };

    return (
        <div>
            <button 
                className="btn btn-outline listening-button" 
                onClick={toggleListening}
                aria-label={listening ? 'Stop Listening' : 'Start Listening'}
                type="button"
                disabled={!browserSupportsSpeechRecognition}
            >
                {listening ? 'Stop Listening' : 'Start Listening'}
            </button>
            <dialog id="speech_modal" className="modal" onClose={handleClose}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Listening...</h3>
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
        </div>
    );
};

export default ListeningButton;
