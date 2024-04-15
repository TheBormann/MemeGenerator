import React, { useState, useEffect, useRef } from "react";
import ApiController from "../../data/ApiController";
import SessionManager from "../../data/SessionManager";
import {
  createNewImage,
  formatBytes,
  getFileSizeFromBase64,
} from "../../utils/imageUtils";

const useMemeGenerator = ({ template, textAreas, imageContainerRef, name, description, fileSizeLimit, isFileSizeLimited }) => {
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [uploadedLink, setUploadedLink] = useState();
    const memeRef = useRef(null);

    const API_BASE_URL = ApiController.API_BASE_URL;

    const toSrcPath = (suffix) => {
      return `${API_BASE_URL}/${suffix}`;
    }
  
    const generateMeme = async () => {
      setIsGenerating(true);
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
      setGeneratedImage(generatedImage);
      setIsGenerating(false);
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
        ...template,
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
  
        setUploadedLink(toSrcPath(newImageURL));
        console.log("Post successfull");
      } catch (error) {
        console.log(error);
      }
    };

    return { generateMeme, downloadImage, shareMeme, uploadedLink, generatedImage, isGenerating, memeRef };
  };
  
  export default useMemeGenerator;