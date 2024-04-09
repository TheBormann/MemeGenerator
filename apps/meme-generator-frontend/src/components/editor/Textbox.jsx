import React from 'react';

function TextBox({ textArea, index, handleDragStart, handleResize, removeTextArea, }) {
    return (
        <div
            className="absolute border-dashed border-transparent border-2 group-hover/imgContainer:border-[#4286f4]"
            style={{
                left: textArea.position.x,
                top: textArea.position.y,
                width: textArea.size.width,
                height: textArea.size.height,
            }}
        >
            <label className='invisible group-hover/imgContainer:visible absolute label-text text-blue text-xs left-1 -top-4'>
                #{index + 1}
            </label>

            <div className="absolute w-full h-full cursor-move"
                onMouseDown={(event) => handleDragStart(event, index)}>
            </div>
            <div
                key={index}
                style={{
                    fontFamily: textArea.font,
                    fontSize: `${textArea.fontSize}px`,
                    fontWeight: textArea.isBold ? 'bold' : 'normal',
                    fontStyle: textArea.isItalic ? 'italic' : 'normal',
                    color: textArea.color,
                    textTransform: textArea.isCapitalized ? 'uppercase' : 'none',
                    textShadow:
                        textArea.textEffect === 'outline'
                            ? `-1px -1px 0 ${textArea.secondaryColor}, 1px -1px 0 ${textArea.secondaryColor}, -1px 1px 0 ${textArea.secondaryColor}, 1px 1px 0 ${textArea.secondaryColor}`
                            : textArea.textEffect === 'shadow'
                                ? `2px 2px 4px ${textArea.secondaryColor}, 2px 2px 4px ${textArea.secondaryColor}, 2px 2px 4px ${textArea.secondaryColor}`
                                : 'none',
                    maxWidth: '100%',
                    wordWrap: 'break-word',
                }}
            >
                {textArea.text}
            </div>

            <div className='w-4 h-4 -translate-x-2 left-1/2 -top-2  absolute rounded-xl border-2 border-transparent group-hover/imgContainer:border-blue group-hover/imgContainer:bg-blue-500 cursor-ns-resize' onMouseDown={(event) => handleResize(event, 'top', index)}></div>
            <div className='w-4 h-4 -translate-y-2 -right-2 top-1/2 absolute rounded-xl  border-2 border-transparent group-hover/imgContainer:border-blue group-hover/imgContainer:bg-blue-500 cursor-ew-resize ' onMouseDown={(event) => handleResize(event, 'right', index)}></div>
            <div className='w-4 h-4 -translate-x-2 left-1/2 -bottom-2 absolute rounded-xl  border-2 border-transparent group-hover/imgContainer:border-blue group-hover/imgContainer:bg-blue-500 cursor-ns-resize' onMouseDown={(event) => handleResize(event, 'bottom', index)}></div>
            <div className='w-4 h-4 -translate-y-2 -left-2 top-1/2 absolute rounded-xl  border-2 hover:border-red border-transparent group-hover/imgContainer:border-blue group-hover/imgContainer:bg-blue-500 cursor-ew-resize' onMouseDown={(event) => handleResize(event, 'left', index)}></div>
            <button className='hidden group-hover/imgContainer:block absolute right-0 top-0' onClick={() => removeTextArea(index)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

export default TextBox;
