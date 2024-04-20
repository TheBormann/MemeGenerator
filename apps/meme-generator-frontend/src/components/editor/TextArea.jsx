import React from 'react';

function TextArea({
  index,
  textArea,
  handleTextChange,
  handleColorChange,
  handleSecondaryColorChange,
  handleFontChange,
  handleTextEffectChange,
  handleSizeChange,
  handleCapitalizeChange,
  handleBoldChange,
  handleItalicChange,
  removeTextArea,
  fonts
}) {
  return (
    <div
    className="flex flex-col space-x-2 mb-2 rounded-lg p-2"
    key={index}
    >
    <label className="lael-text text-xs px-2">
        Textbox #{index + 1}
    </label>
    <div className="flex items-center gap-1">
        <textarea
        className="textarea textarea-bordered rounded-2xl w-full"
        value={textArea.text}
        onChange={(event) => handleTextChange(event, index)}
        placeholder="Enter text here"
        />
        <div className="flex-flex-col">
        <input
            type="color"
            value={textArea.color}
            onChange={(event) => handleColorChange(event, index)}
        />
        <input
            type="color"
            value={textArea.textOutlineColor}
            onChange={(event) =>
            handleSecondaryColorChange(event, index)
            }
        />
        </div>

        <div className="dropdown dropdown-bottom dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-circle">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            >
            <path d="M 10.490234 2 C 10.011234 2 9.6017656 2.3385938 9.5097656 2.8085938 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 5.2851562 5.2480469 C 4.8321563 5.0920469 4.33375 5.2793594 4.09375 5.6933594 L 2.5859375 8.3066406 C 2.3469375 8.7216406 2.4339219 9.2485 2.7949219 9.5625 L 4.1132812 10.708984 C 4.0447181 11.130337 4 11.559284 4 12 C 4 12.440716 4.0447181 12.869663 4.1132812 13.291016 L 2.7949219 14.4375 C 2.4339219 14.7515 2.3469375 15.278359 2.5859375 15.693359 L 4.09375 18.306641 C 4.33275 18.721641 4.8321562 18.908906 5.2851562 18.753906 L 6.9296875 18.1875 C 7.5958842 18.734206 8.3553934 19.166339 9.1757812 19.476562 L 9.5097656 21.191406 C 9.6017656 21.661406 10.011234 22 10.490234 22 L 13.509766 22 C 13.988766 22 14.398234 21.661406 14.490234 21.191406 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 18.714844 18.751953 C 19.167844 18.907953 19.66625 18.721641 19.90625 18.306641 L 21.414062 15.691406 C 21.653063 15.276406 21.566078 14.7515 21.205078 14.4375 L 19.886719 13.291016 C 19.955282 12.869663 20 12.440716 20 12 C 20 11.559284 19.955282 11.130337 19.886719 10.708984 L 21.205078 9.5625 C 21.566078 9.2485 21.653063 8.7216406 21.414062 8.3066406 L 19.90625 5.6933594 C 19.66725 5.2783594 19.167844 5.0910937 18.714844 5.2460938 L 17.070312 5.8125 C 16.404116 5.2657937 15.644607 4.8336609 14.824219 4.5234375 L 14.490234 2.8085938 C 14.398234 2.3385937 13.988766 2 13.509766 2 L 10.490234 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z"></path>
            </svg>
        </div>
        <div
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box"
        >
            <label className="label">
            <span className="label-text pr-2">Font: </span>
            <select
                className="select max-w-xs rounded-none"
                value={textArea.font}
                onChange={(event) => handleFontChange(event, index)}
            >
                {fonts.map((font, index) => (
                <option key={index} value={font}>
                    {font}
                </option>
                ))}
            </select>
            </label>

            <label className="flex flex-col px-1 py-2">
            <span className="label-text basis-full">
                Outline options:
            </span>

            <div className="flex flex-row gap-1 justify-between">
                <label className="flex flex-col items-center">
                <input
                    className="radio"
                    type="radio"
                    value="outline"
                    checked={textArea.textEffect === "outline"}
                    onChange={(event) =>
                    handleTextEffectChange(event, index)
                    }
                />
                <span className="label-text">Outline</span>
                </label>
                <label className="flex flex-col items-center">
                <input
                    className="radio"
                    type="radio"
                    value="shadow"
                    checked={textArea.textEffect === "shadow"}
                    onChange={(event) =>
                    handleTextEffectChange(event, index)
                    }
                />
                <span className="label-text">Shadow</span>
                </label>
                <label className="flex flex-col items-center">
                <input
                    className="radio"
                    type="radio"
                    value="none"
                    checked={textArea.textEffect === "none"}
                    onChange={(event) =>
                    handleTextEffectChange(event, index)
                    }
                />
                <span className="label-text">None</span>
                </label>
            </div>
            </label>
            <div className="form-control">
            <label className="label cursor-pointer">
                <span className="label-text">Capitalize</span>
                <input
                type="checkbox"
                checked={textArea.isCapitalized}
                className="checkbox"
                onChange={(event) =>
                    handleCapitalizeChange(event, index)
                }
                />
            </label>
            </div>
            <div className="form-control">
            <label className="label cursor-pointer">
                <span className="label-text">Bold</span>
                <input
                type="checkbox"
                checked={textArea.isBold}
                className="checkbox"
                onChange={(event) => handleBoldChange(event, index)}
                />
            </label>
            </div>
            <div className="form-control">
            <label className="label cursor-pointer">
                <span className="label-text">Italic</span>
                <input
                type="checkbox"
                checked={textArea.isItalic}
                className="checkbox"
                onChange={(event) =>
                    handleItalicChange(event, index)
                }
                />
            </label>
            </div>

            <label className="label cursor-pointer">
            <span className="label-text">Font size:</span>
            <input
                type="number"
                value={textArea.fontSize}
                onChange={(event) => handleSizeChange(event, index)}
                placeholder="Font size"
            />
            </label>
        </div>
        </div>

        <button
        className="btn btn-circle btn-outline"
        onClick={() => removeTextArea(index)}
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
            />
        </svg>
        </button>
    </div>
    </div>
  );
}

export default TextArea;
