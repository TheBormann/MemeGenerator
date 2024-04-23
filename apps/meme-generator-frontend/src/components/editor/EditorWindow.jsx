import React, { useState, useEffect, useRef } from "react";
import TextBox from "./Textbox";
import { useTextAreas } from "./useTextField";
import { useSpeech } from "./useSpeechToText";
import ListeningButton from "./ListeningButton";
import useMemeGenerator from "./useMemeGenerator";
import TextArea from "./TextArea";
import GeneratedMemeDialog from "./generateMemeDialog";
import { useNavigate } from "react-router-dom";
import ApiController from "../../data/ApiController";
import useTemplate from "./useTemplate";

// TODO upload memes privately
function EditorWindow({
  template: initialTemplate, meme, editing = false
}) {
  const navigate = useNavigate();
  const generate_modal_ref = useRef();
  const [template, setTemplate] = useState(initialTemplate);
  const {
    textAreas,
    addTextArea,
    insertTextArea,
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
  const { toSrcPath } = useTemplate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const imageContainerRef = useRef(null);
  const [isFileSizeLimited, setIsFileSizeLimited] = useState(false);
  const [fileSizeLimit, setFileSizeLimit] = useState(1000); // KB
  const { generateMeme, updateMeme, downloadImage, shareMeme, memeId, generatedImage, isGenerating, memeRef } = useMemeGenerator({
    template, textAreas, imageContainerRef, name, description, fileSizeLimit, isFileSizeLimited});
  const { toggleListening, listening, browserSupportsSpeechRecognition, transcript,
  } = useSpeech(addTextArea, updateTextArea, removeTextArea, setName, textAreas);
  
  useEffect(() => {
    async function fetchData() {
      console.log(meme)
      if (editing && meme) {
        const temp = await ApiController.fetchTemplateById(meme.templateId);
        setTemplate({url: toSrcPath(temp.imagePath)});
        setName(meme.title);
        setDescription(meme.description);
        setFileSizeLimit(meme.fileSizeLimit);
        if(meme.textFields){
           meme.textFields.forEach(textArea => {
           insertTextArea(textArea);
          });
        }
      }
    }
    fetchData();
  }, [editing, meme]);



  const minimumSize = {
    width: 50,
    height: 50,
  };

  const fonts = ["Arial", "Impact", "Comic Sans MS", "Montserrat"];

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
    setName("");
    //TODO clear useMemeGenerator
    setFileSizeLimit(1000);
    setIsFileSizeLimited(false);
    clearTextAreas();
  };

  const onGenerateMeme = async () => {
    try {
      generate_modal_ref.current.showModal();
      await generateMeme();
    } catch (error) {
      console.error("Error generating meme:", error);
    }
  };

  const onShareMeme = async () => {
    try {
      if (editing) {
        navigate(`/Single-View/${await updateMeme()}`);
      } else {
        navigate(`/Single-View/${await shareMeme()}`);
      }
    } catch {

    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col w-full">
        <div className="basis-5/12 flex flex-col m-2 ">
          <input
            type="text"
            placeholder="Meme name"
            className="input input-bordered w-full mb-6 max-w-xl mx-auto"
            value={name || ''}
            onChange={(event) => handleMemeNameChange(event)}
          />
          <div className="meme-editor-container flex justify-center h-full relative group/imgContainer px-3">
          {template ? (
            <div className="my-auto">
              <div className="relative" id="editing-container" ref={imageContainerRef}>
                <img
                  crossOrigin="anonymous"
                  src={template.url}  // Use template URL when not editing
                  alt="template"
                  draggable="false"
                  className="object-scale-down h-full lg:max-h-[70vh]"
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
            <div className="h-80 flex justify-center align-middle">
              <span className="loading loading-ring"></span>
            </div>
          )}
          </div>
        </div>

        {/* Editing options */}
        <input
          type="text"
          placeholder="Meme Description"
          className="input input-bordered w-full mt-4 max-w-xl mx-auto"
          value={description}
          onChange={(event) => handleMemeDescriptionChange(event)}
        />
        <div className=" flex flex-col justify-between p-3 m-2 gap-4 ">
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
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              <div className="flex gap-4 align-middle">
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
                {isFileSizeLimited ? (
                  <div>
                    <input
                      type="number"
                      min="10"
                      value={fileSizeLimit}
                      onChange={(event) => setFileSizeLimit(event.target.value)}
                      className="input input-bordered w-full max-w-xs"
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className=" fixed bottom-0 left-0 right-0 justify-center mx-auto m-4 flex gap-4">
          <button
            className="btn btn-outline btn-error w-fit"
            disabled={!textAreas.length}
            onClick={() => document.getElementById("delete_modal").showModal()}
          >
            Clear
          </button>
          <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
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
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
          <button
            className="btn btn-primary"
            disabled={!name}
            onClick={onGenerateMeme}
          >
            {editing ? "Update Meme" : "Create Meme"}
          </button>
          <GeneratedMemeDialog
            generate_modal_ref={generate_modal_ref}
            name={name}
            generatedImage={generatedImage}
            memeId={memeId}
            memeRef={memeRef}
            downloadImage={downloadImage}
            shareMeme={onShareMeme}
            clear={() => {
              clear();
              generate_modal_ref.current.showModal();
            }}
          />
          <ListeningButton
            toggleListening={toggleListening}
            listening={listening}
            transcript={transcript}
            browserSupportsSpeechRecognition={
              browserSupportsSpeechRecognition
            }
          />
        </div>
    </div>
  );
}

export default EditorWindow;
