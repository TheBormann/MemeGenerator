import React, { useState, useRef } from "react";
import ApiController from "../../data/ApiController";
import SessionManager from "../../data/SessionManager";
import {
  createNewImage,
  getFileSizeFromBase64,
} from "../../utils/imageUtils";

const useMemeGenerator = ({ template, textAreas, imageContainerRef, name, description, fileSizeLimit, isFileSizeLimited }) => {
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [memeId, setMemeId] = useState(null);
    const memeRef = useRef(null);

    const generateMeme = async () => {
        setIsGenerating(true);
        const img = await tryDifferentQualities(imageContainerRef.current, fileSizeLimit, isFileSizeLimited);
        setGeneratedImage(img);
        setIsGenerating(false);
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
      formData.append("memeObject", JSON.stringify(constructMemeObject()));
  
      try {
        const response = await ApiController.createMeme(formData);
        console.log("Meme posted successfully:", response.meme);
        setMemeId(response.meme._id);
        return response.meme._id;
      } catch (error) {
        console.error("Error posting meme:", error);
      }
    };

    const updateMeme = async () => {
      const blob = convertDataURLToBlob(generatedImage);
      const formData = new FormData();
      formData.append("title", name);
      formData.append("description", description);
      formData.append("image", blob, `${name}.png`);

      try {
        const response = await ApiController.updateMeme(memeId, formData);
        console.log("Meme updated successfully:", response.data);
      } catch (error) {
        console.error("Error updating meme:", error);
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
        const array = new Uint8Array(binary.length).map((_, i) => binary.charCodeAt(i));
        return new Blob([array], { type: contentType });
    };

    const constructMemeObject = () => ({
        ...template,
        textAreas,
        name,
        description,
        size: {
          width: imageContainerRef.current.getBoundingClientRect().width,
          height: imageContainerRef.current.getBoundingClientRect().height,
        },
        author: SessionManager.getUserName(),
        template: "Used template",
        targetFileSize: 2_000_000,
        publishMode: "public",
        fileType: "image",
    });

    return { generateMeme, updateMeme, downloadImage, shareMeme, memeId, generatedImage, isGenerating, memeRef };
};

export default useMemeGenerator;
