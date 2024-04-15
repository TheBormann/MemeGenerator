import React, { useState, useEffect, useRef } from "react";
import TextBox from "./Textbox";
import { useTextAreas } from "./useTextField";
import { useSpeech } from "./useSpeechToText";
import ListeningButton from "./ListeningButton";
import useMemeGenerator from "./useMemeGenerator";
import TextArea from "./TextArea";
import GeneratedMemeDialog from "./generateMemeDialog";

function EditorWindow({
  template
}) {
  const [editingState, setEditingState] = useState("select");
  const {
    textAreas,
    addTextArea,
    updateTextArea,
    handleTextChange,
    handleFontChange,
    handleColorChange,
    handleSecondaryColorChange,
    handleTextEffectChange,
    handleSizeChange,
    handleItalicChange,
    handleBoldChange,
    handleCapitalizeChange,
    removeTextArea,
    handleDragAndResize,
    clearTextAreas,
  } = useTextAreas([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const imageContainerRef = useRef(null);
  const [isFileSizeLimited, setIsFileSizeLimited] = useState(false);
  const [fileSizeLimit, setFileSizeLimit] = useState(1000); // KB
  const { generateMeme, downloadImage, shareMeme, uploadedLink, generatedImage, isGenerating, memeRef } = useMemeGenerator({
    template,
    textAreas,
    imageContainerRef,
    name,
    description,
    fileSizeLimit,
    isFileSizeLimited,
  });

  const { toggleListening, listening, browserSupportsSpeechRecognition, transcript,
  } = useSpeech(addTextArea, updateTextArea, removeTextArea, setName, textAreas);

  const [showModal, setShowModal] = useState(false);
  

  const minimumSize = {
    width: 50,
    height: 50,
  };

  const fonts = ["Arial", "Impact", "Comic Sans MS", "Montserrat"];

  useEffect(() => {
    if (template) {
      setEditingState("edit");
    }
  }, [template]);


  const handleResize = (event, corner, index) => {
    const container = event.target.parentNode;

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = parseFloat(getComputedStyle(container).width);
    const startHeight = parseFloat(getComputedStyle(container).height);
    const startLeft = parseFloat(getComputedStyle(container).left);
    const startTop = parseFloat(getComputedStyle(container).top);

    const imageContainer = imageContainerRef.current;
    const imageRect = imageContainer.getBoundingClientRect();
    const parentWidth = imageRect.width;
    const parentHeight = imageRect.height;

    const handleDrag = (event) => {
      const offsetX = event.clientX - startX;
      const offsetY = event.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      if (corner.includes("right")) {
        newWidth = startWidth + offsetX;
        if (newWidth > parentWidth - newLeft) {
          newWidth = parentWidth - newLeft;
        }
        newWidth = Math.max(minimumSize.width, newWidth);
      } else if (corner.includes("left")) {
        newWidth = startWidth - offsetX;
        newLeft = Math.min(
          Math.max(0, startLeft + offsetX),
          parentWidth - minimumSize.width
        );
        newWidth = Math.min(Math.max(minimumSize.width, newWidth), parentWidth);
      }

      if (corner.includes("bottom")) {
        newHeight = startHeight + offsetY;
        if (newHeight > parentHeight - newTop) {
          newHeight = parentHeight - newTop;
        }
        newHeight = Math.max(minimumSize.height, newHeight);
      } else if (corner.includes("top")) {
        newHeight = startHeight - offsetY;
        newTop = Math.min(
          Math.max(0, startTop + offsetY),
          parentHeight - minimumSize.height
        );
        newHeight = Math.min(
          Math.max(minimumSize.height, newHeight),
          parentHeight
        );
      }

      container.style.width = `${newWidth}px`;
      container.style.height = `${newHeight}px`;
      container.style.left = `${newLeft}px`;
      container.style.top = `${newTop}px`;

      handleDragAndResize(
        index,
        { x: newLeft, y: newTop },
        { width: newWidth, height: newHeight }
      );
    };

    const handleDragEnd = () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    };

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
  };

  const handleDragStart = (event, index) => {
    const offsetX = event.clientX - textAreas[index].position.x;
    const offsetY = event.clientY - textAreas[index].position.y;

    const handleDrag = (event) => {
      const imageContainer = imageContainerRef.current;
      const imageRect = imageContainer.getBoundingClientRect();

      let newX = event.clientX - offsetX;
      let newY = event.clientY - offsetY;

      newX = Math.max(
        0,
        Math.min(newX, imageRect.width - textAreas[index].size.width)
      );
      newY = Math.max(
        0,
        Math.min(newY, imageRect.height - textAreas[index].size.height)
      );

      handleDragAndResize(index, { x: newX, y: newY });
    };

    const handleDragEnd = () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    };

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
  };

  const handleMemeNameChange = (event) => {
    setName(event.target.value);
  };

  const handleMemeDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const clear = () => {
    setEditingState("edit");
    setName("");
    //TODO clear useMemeGenerator
    setFileSizeLimit(1000);
    setIsFileSizeLimited(false);
    clearTextAreas();
  };

  const onGenerateMeme = async () => {
    
    try {
      setShowModal(true);
      await generateMeme();
    } catch (error) {
      console.error("Error generating meme:", error);
    }
  };

  const onShareMeme = async () => {
    try {
      await shareMeme();
      setEditingState("save");
    } catch {

    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col w-full">
        <div className="basis-5/12 flex flex-col m-2 ">
          <input
            type="text"
            placeholder="Meme name"
            className="input input-bordered w-full mb-12 max-w-xl mx-auto"
            value={name}
            onChange={(event) => handleMemeNameChange(event)}
          />
          <div className="meme-editor-container flex justify-center h-full relative group/imgContainer px-3">
            {template ? (
              <div className="my-auto max-[500px]">
                <div
                  className=" relative"
                  id="editing-container"
                  ref={imageContainerRef}
                >
                  <img
                    crossOrigin="anonymous"
                    src={template.url}
                    alt="DraftImage"
                    className="w-[500px] object-scale-down h-full"
                  />
                  {textAreas.map((textArea, index) => (
                    <TextBox
                      key={index}
                      textArea={textArea}
                      index={index}
                      handleDragStart={handleDragStart}
                      removeTextArea={removeTextArea}
                      handleResize={handleResize}
                    ></TextBox>
                  ))}
                </div>
              </div>
            ) : (
              <span className="loading loading-spinner m-auto w-1/4"></span>
            )}
          </div>
        </div>

        {/* Editing options */}
        <input
          type="text"
          placeholder="Meme Description"
          className="input input-bordered w-full mt-8 max-w-xl mx-auto"
          value={description}
          onChange={(event) => handleMemeDescriptionChange(event)}
        />
        <div className=" flex flex-col lg:flex-row justify-between p-3 m-2 gap-4 ">
          <div className="flex flex-col gap-1">
            <button className="btn w-fit mx-auto" onClick={() => addTextArea()}>
              Add Text Area
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"
                ></path>
              </svg>{" "}
            </button>
            {textAreas.map((textArea, index) => (
                <TextArea
                key={index}
                index={index}
                textArea={textArea}
                handleTextChange={handleTextChange}
                handleColorChange={handleColorChange}
                handleSecondaryColorChange={handleSecondaryColorChange}
                handleFontChange={handleFontChange}
                handleTextEffectChange={handleTextEffectChange}
                handleSizeChange={handleSizeChange}
                handleCapitalizeChange={handleCapitalizeChange}
                handleBoldChange={handleBoldChange}
                handleItalicChange={handleItalicChange}
                removeTextArea={removeTextArea}
                fonts={fonts}
              />
            ))}
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex gap-1">
              <div className="flex">
                {isFileSizeLimited ? (
                  <div>
                    <input
                      type="number"
                      min="10"
                      value={fileSizeLimit}
                      onChange={(event) => setFileSizeLimit(event.target.value)}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div className="form-control">
                  <label className="cursor-pointer label">
                    <span className="label-text pr-2">Limit file size? (KB)</span>
                    <input
                      type="checkbox"
                      checked={isFileSizeLimited}
                      className="checkbox checkbox-info"
                      onChange={() => setIsFileSizeLimited(!isFileSizeLimited)}
                    />
                  </label>
                </div>
              </div>
              <button
                className="btn btn-outline btn-error w-fit"
                disabled={!textAreas.length}
                onClick={() => document.getElementById("my_modal_1").showModal()}
              >
                Clear
              </button>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Delete Editing</h3>
                  <p className="py-4">
                    Are you sure that you want to clear your editing progress?
                  </p>
                  <div className="modal-action">
                    <form method="dialog">
                      <button
                        className="btn btn-outline btn-error w-fit mr-2"
                        onClick={clear}
                      >
                        Clear
                      </button>
                      <button className="btn">Cancel</button>
                    </form>
                  </div>
                </div>
              </dialog>
              <button
                className="btn btn-primary"
                disabled={!name}
                onClick={onGenerateMeme}
              >
                Generate Meme
              </button>
                <GeneratedMemeDialog
                isOpen={showModal}
                name={name}
                generatedImage={generatedImage}
                memeRef={memeRef}
                downloadImage={downloadImage}
                shareMeme={shareMeme}
                uploadedLink={uploadedLink}
                clear={() => {
                  clear();
                  setShowModal(false);
                }}
              />
            </div>
          </div>
        </div>
        <ListeningButton
              toggleListening={toggleListening}
              listening={listening}
              transcript={transcript}
              browserSupportsSpeechRecognition={
                browserSupportsSpeechRecognition
              }
        />
    </div>
  );
}

export default EditorWindow;
