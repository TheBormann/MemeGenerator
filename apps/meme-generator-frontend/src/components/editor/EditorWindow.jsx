import React, { useState, useEffect, useRef } from "react";
import TextBox from "./Textbox";
import { useTextAreas } from "./useTextField";
import { useSpeech } from "./useSpeechToText";
import ApiController from "../../data/ApiController";
import SessionManager from "../../data/SessionManager";
import ListeningButton from "./ListeningButton";
import {
  createNewImage,
  formatBytes,
  getFileSizeFromBase64,
} from "../../utils/imageUtils";
const API_BASE_URL = ApiController.API_BASE_URL;

function EditorWindow({
  draft,
  isLoading,
  onSelectNextTemplate,
  onSelectPrevTemplate,
  onRandomizeTemplate,
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
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [hasUploadedMeme, setHasUploadedMeme] = useState(false);
  const [singleViewURL, setSingleViewURL] = useState("the URLK");
  const [isFileSizeLimited, setIsFileSizeLimited] = useState(false);
  const [fileSizeLimit, setFileSizeLimit] = useState(1000); // KB

  const {
    toggleListening,
    listening,
    browserSupportsSpeechRecognition,
    transcript,
  } = useSpeech(
    addTextArea,
    updateTextArea,
    removeTextArea,
    setName,
    textAreas
  );
  const imageContainerRef = useRef(null);
  const memeRef = useRef(null);

  const minimumSize = {
    width: 50,
    height: 50,
  };

  const fonts = ["Arial", "Impact", "Comic Sans MS", "Montserrat"];

  useEffect(() => {
    if (draft) {
      setEditingState("edit");
    }
  }, [draft]);

  const toSrcPath = (suffix) => {
    return `${API_BASE_URL}/${suffix}`;
}


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
    setHasUploadedMeme(false);
    setFileSizeLimit(1000);
    setIsFileSizeLimited(false);
    clearTextAreas();
  };

  const generateMeme = async () => {
    const imageContainerNode = imageContainerRef.current;
    let qualityList = [1, 0.8, 0.6, 0.4, 0.2, 0.1, 0.01]; // Add more values as needed

    let generatedImage;

    for (let i = 0; i < qualityList.length; i++) {
      const img = await createNewImage(imageContainerNode, qualityList[i]);
      const fileSize = getFileSizeFromBase64(img);
      console.log(qualityList[i]);
      console.log(formatBytes(fileSize));
      console.log(formatBytes(fileSizeLimit * 1024));

      generatedImage = img;

      // 1. If the generated file is small enough, return it
      // 2. If option is set to false; just return it
      if (fileSize < fileSizeLimit * 1024 || !isFileSizeLimited) {
        break;
      }
    }

    return generatedImage;
  };

  const onGenerateMeme = async () => {
    // open modal
    document.getElementById("generated_meme_modal").showModal();

    setIsGenerating(true);

    try {
      const generatedImage = await generateMeme(); // Your asynchronous meme generation function

      setGeneratedImage(generatedImage);
    } catch (error) {
      console.error("Error generating meme:", error);
      // Handle error if necessary
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (generatedImage) {
      const image = await fetch(generatedImage);
      const imageBlog = await image.blob();
      const imageURL = URL.createObjectURL(imageBlog);

      const link = document.createElement("a");
      link.href = imageURL;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareMeme = async () => {
    const dataURLtoBlob = (dataURL) => {
      const parts = dataURL.split(";base64,");
      const contentType = parts[0].split(":")[1];
      const raw = window.atob(parts[1]);
      const array = new Uint8Array(raw.length);

      for (let i = 0; i < raw.length; i++) {
        array[i] = raw.charCodeAt(i);
      }

      return new Blob([array], { type: contentType });
    };

    setEditingState("save");

    // TODO: use true description field
    //const description = description;

    // TODO: add UI query for publish mode
    const PublishMode = {
      Public: "public",
      Private: "private",
      Archived: "archived",
    };
    const defaultPublishMode = PublishMode.Public;

    // TODO: add different media types
    const FileType = {
      Image: "image",
      Video: "video",
      Gif: "gif",
    };

    const defaulFileType = FileType.Image;

    const width = imageContainerRef.current.getBoundingClientRect().width;
    const height = imageContainerRef.current.getBoundingClientRect().height;
    const memeObject = {
      ...draft,
      textAreas: textAreas,
      name: name,
      description: description,
      size: {
        width: width,
        height: height,
      },
      author: SessionManager.getUserName(),
      template: "Used template",
      targetFileSize: 2_000_000,
      publishMode: defaultPublishMode,
      fileType: defaulFileType,
    };

    console.log(memeObject);

    // Get the img element from the ref
    const base64Image = memeRef.current.src;
    const blob = dataURLtoBlob(base64Image);

    const formData = new FormData();

    formData.append("image", blob, `${name}.png`);
    const memeJsonObject = JSON.stringify(memeObject);

    formData.append("memeObject", memeJsonObject);

    try {
      const response = await ApiController.createMeme(formData);
      const newImageURL = response.imageURL;
      setSingleViewURL(toSrcPath(newImageURL));

      setHasUploadedMeme(true);
      console.log("Post successfull");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col w-full outline rounded-xl ">
      <div className="h-full flex flex-row">
        <div className="basis-5/12 flex flex-col m-2 ">
          <div className="meme-editor-container flex justify-center h-full relative group/imgContainer px-3">
            {draft && !isLoading ? (
              <div className="my-auto max-[500px]">
                <div
                  className=" relative"
                  id="editing-container"
                  ref={imageContainerRef}
                >
                  <img
                    crossOrigin="anonymous"
                    src={draft.imageUrl}
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
          <ul className="steps px-5 pb-5">
            <li
              className={`step ${
                editingState === "select" ||
                editingState === "edit" ||
                editingState === "save"
                  ? "step-primary"
                  : ""
              }`}
            >
              Select template
            </li>
            <li
              className={`step ${
                editingState === "edit" || editingState === "save"
                  ? "step-primary"
                  : ""
              }`}
            >
              Edit template
            </li>
            <li
              className={`step ${
                editingState === "save" ? "step-primary" : ""
              }`}
            >
              Save template
            </li>
            <li className="step">Share your Meme!</li>
          </ul>
        </div>

        {/* Editing options */}
        <div className="basis-7/12 flex flex-col justify-between p-3 m-2 ">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold">Edit your template</p>
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
              <div
                className="flex flex-col space-x-2 mb-2 bg-gray-light rounded-lg p-1"
                key={index}
              >
                <label className="lael-text text-xs px-2">
                  Textbox #{index + 1}
                </label>
                <div className="flex items-center gap-1">
                  <textarea
                    className="textarea rounded-sm w-full"
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
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
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
            ))}
          </div>
          <div className="flex flex-col items-end gap-2">
            <ListeningButton
              toggleListening={toggleListening}
              listening={listening}
              transcript={transcript}
              browserSupportsSpeechRecognition={
                browserSupportsSpeechRecognition
              }
            />

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
                <input
                type="text"
                placeholder="Meme Description"
                className="input input-bordered w-full max-w-ws"
                value={description}
                // Add an onChange handler to capture the meme name input value
                onChange={(event) => handleMemeDescriptionChange(event)}
              />
              </div>
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                placeholder="Meme name"
                className="input input-bordered w-full max-w-ws"
                value={name}
                // Add an onChange handler to capture the meme name input value
                onChange={(event) => handleMemeNameChange(event)}
              />
              <button
                className="btn btn-primary"
                disabled={!name}
                onClick={onGenerateMeme}
              >
                Generate Meme
              </button>
              <dialog id="generated_meme_modal" className="modal">
                <div className="modal-box">
                  <h2 className="font-bold text-2xl mb-3">New Meme: {name}</h2>
                  {generatedImage == null ? (
                    <span className="loading loading-spinner m-auto w-1/4 relative left-1/2 -translate-x-1/2  "></span>
                  ) : (
                    <>
                      <img
                        ref={memeRef}
                        src={generatedImage}
                        alt="Generated Meme"
                      />
                      <div className="pt-2"></div>
                    </>
                  )}
                  <div className="modal-action">
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex justify-between">
                        <button
                          type="btn"
                          className="btn mx-2"
                          onClick={downloadImage}
                          disabled={generatedImage == null}
                        >
                          Download
                        </button>
                        <button
                          type="btn"
                          className="btn btn-accent"
                          onClick={shareMeme}
                          disabled={generatedImage == null || hasUploadedMeme}
                        >
                          Share
                        </button>
                      </div>
                      {hasUploadedMeme ? (
                        <div className="join">
                          <div>
                            <div>
                              <span className="label text-label input input-bordered join-item">
                                {singleViewURL}
                              </span>
                            </div>
                          </div>
                          <div className="indicator">
                            <button
                              className="btn join-item "
                              onClick={() => {
                                navigator.clipboard.writeText(singleViewURL);
                              }}
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    <form method="dialog">
                      <button
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={() => {
                          clear();
                        }}
                      >
                        ✕
                      </button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="basis-9/12 flex flex-col">
          <div className="divider px-5"> Switch Template </div>
          <div className="flex justify-around m-5">
            <button className="btn btn-circle" onClick={onSelectPrevTemplate}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H6M12 5l-7 7 7 7"></path>
              </svg>
            </button>
            <button className="btn btn-circle" onClick={onSelectNextTemplate}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h13M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="basis-3/12 flex flex-col">
          <div className="divider px-5"> Random Template </div>
          <div className="flex justify-around m-5">
            <button className="btn btn-circle" onClick={onRandomizeTemplate}>
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                fillRule="evenodd"
                clipRule="evenodd"
              >
                <path d="M21.67 3.955l-2.825-2.202.665-.753 4.478 3.497-4.474 3.503-.665-.753 2.942-2.292h-4.162c-3.547.043-5.202 3.405-6.913 7.023 1.711 3.617 3.366 6.979 6.913 7.022h4.099l-2.883-2.247.665-.753 4.478 3.497-4.474 3.503-.665-.753 2.884-2.247h-4.11c-3.896-.048-5.784-3.369-7.461-6.858-1.687 3.51-3.592 6.842-7.539 6.858h-2.623v-1h2.621c3.6-.014 5.268-3.387 6.988-7.022-1.72-3.636-3.388-7.009-6.988-7.023h-2.621v-1h2.623c3.947.016 5.852 3.348 7.539 6.858 1.677-3.489 3.565-6.81 7.461-6.858h4.047z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorWindow;
