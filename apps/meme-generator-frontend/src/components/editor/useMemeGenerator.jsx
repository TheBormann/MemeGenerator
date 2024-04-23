import React, { useState, useRef } from "react";
import { useTextAreas } from "./useTextField";
import ApiController from "../../data/ApiController";
import SessionManager from "../../data/SessionManager";
import {
  createNewImage,
  getFileSizeFromBase64,
} from "../../utils/imageUtils";

const API_BASE_URL = ApiController.API_BASE_URL;

const useMemeGenerator = ({ initialTemplate, initialMemeId, memeRef, imageContainerRef }) => {
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isFileSizeLimited, setIsFileSizeLimited] = useState(false);
  const [fileSizeLimit, setFileSizeLimit] = useState(1000); // KB

    const [generatedImage, setGeneratedImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [memeId, setMemeId] = useState(initialMemeId);

    const toSrcPath = (suffix) => {
      return `${API_BASE_URL}/${suffix}`;
    }

    const generateMeme = async () => {
        setIsGenerating(true);
        const img = await tryDifferentQualities(imageContainerRef.current, fileSizeLimit, isFileSizeLimited);
        setGeneratedImage(img);
        setIsGenerating(false);
    };

    const updateMeme = async (id) => {
      const blob = convertDataURLToBlob(generatedImage);
      const formData = new FormData();
      formData.append("image", blob, `${name}.${template.url.split('.')[1]}`);
      formData.append("memeObject", serializeMemeObject());

      try {
        const response = await ApiController.updateMeme(id, formData);
        return response.meme._id;
      } catch (error) {
        console.error("Error updating meme:", error);
      }
    };

    const fetchMemeData = async (memeId) => {
        const temp = deserializeMemeObject(await ApiController.fetchMemeById(memeId));
        const freshTemplate = await ApiController.fetchTemplateById(temp.templateId);
        console.log("Fetched meme data:", temp);
        setTemplate({ url: toSrcPath(freshTemplate.imagePath) });
        setName(temp.title);
        setDescription(temp.description);
        setFileSizeLimit(temp.fileSizeLimit);
        if (temp.textFields) {
          temp.textFields.forEach(textArea => {
            insertTextArea(textArea);
          });
        }
    };

    const downloadImage = async () => {
      if (generatedImage) {
        const imageBlog = await fetch(generatedImage).then(res => res.blob());
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
      const blob = convertDataURLToBlob(memeRef.current.src);
      const formData = new FormData();
      formData.append("image", blob, `${name}.png`);
      formData.append("memeObject", serializeMemeObject());
  
      try {
        const response = await ApiController.createMeme(formData);
        console.log("Meme posted successfully:", response.meme);
        setMemeId(response.meme._id);
        return response.meme._id;
      } catch (error) {
        console.error("Error posting meme:", error);
      }
    };

    const tryDifferentQualities = async (imageNode, limit, isLimited) => {
        let qualityList = [1, 0.8, 0.6, 0.4, 0.2, 0.1, 0.01];
        for (const quality of qualityList) {
            const img = await createNewImage(imageNode, quality);
            const fileSize = getFileSizeFromBase64(img);
            if (fileSize < limit * 1024 || !isLimited) {
                return img;
            }
        }
        return null;
    };

    const convertDataURLToBlob = (dataURL) => {
      const [header, base64Data] = dataURL.split(";base64,");
      const contentType = header.split(":")[1];
      const binary = window.atob(base64Data);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
      }
      return new Blob([array], { type: contentType });
  };

  const serializeMemeObject = () => (JSON.stringify({
      ...template,
      textAreas: textAreas.map(textArea => ({
        ...textArea,
        position: JSON.stringify(textArea.position),
        size: JSON.stringify(textArea.size), 
      })),
      name,
      description,
      size: {
        width: imageContainerRef.current.getBoundingClientRect().width,
        height: imageContainerRef.current.getBoundingClientRect().height,
      },
      author: SessionManager.getUserName(),
      templateId: template.id,
      targetFileSize: 2_000_000,
      publishMode: "public",
      fileType: "image",
  }));

    const deserializeMemeObject = (memeJson) => {
      const memeObject = typeof memeJson === 'string' ? JSON.parse(memeJson) : memeJson;

      const updatedTextAreas = memeObject.textFields.map(textField => {
          return {
              ...textField,
              position: JSON.parse(textField.position),
              size: JSON.parse(textField.size),
          };
      });

      return {
          ...memeObject,
          textFields: updatedTextAreas
      };
    };

  const clear = () => {
    setName("");
    setFileSizeLimit(1000);
    setIsFileSizeLimited(false);
    clearTextAreas();
  };

  return { template, name, setName, generateMeme, description, setDescription, isFileSizeLimited, setIsFileSizeLimited, fileSizeLimit, setFileSizeLimit, updateMeme, fetchMemeData, downloadImage, shareMeme, memeId, generatedImage, isGenerating, clear,
    textAreas, addTextArea, insertTextArea, updateTextArea, handleTextChange, handleFontChange, handleColorChange, handleSecondaryColorChange, handleTextEffectChange, handleSizeChange,
    handleItalicChange, handleBoldChange, handleCapitalizeChange, removeTextArea, handleDragAndResize, clearTextAreas, 
    };
};

export default useMemeGenerator;
