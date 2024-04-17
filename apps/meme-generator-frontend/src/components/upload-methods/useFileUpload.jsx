import { useState, useRef } from 'react';
import UploadFile from "./UploadFile";
import ImageURLUpload from "./ImageURLUpload";
import CameraImage from "./CameraImage";
import HandDrawnImage from "./HandDrawnImage";
import ApiController from '../../data/ApiController';

export const useFileUpload = (handleUploaded) => {
    const [selectedMethod, setSelectedMethod] = useState();
    const [currentDisplayedPicture, setCurrentDisplayedPicture] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState({
        file: null,
        urlImage: null,
        camera: null,
        screenshot: null,
        gif: null,
    });

    // Generic function to update state based on type
    const updateUploadedFiles = (type, file, pictureUrl = null) => {
        setUploadedFiles(prev => ({ ...prev, [type]: file }));
        if (pictureUrl) setCurrentDisplayedPicture(pictureUrl);
    };

    const handleFileChange = (type) => async (event) => {
        switch (type) {
            case 'file':
                const file = event.target.files[0];
                UploadFile.handleFileUpload(event, (url) => updateUploadedFiles('file', file, url));
                break;
            case 'urlImage':
                ImageURLUpload.handleImageURLUpload(event, (url) => updateUploadedFiles('urlImage', event.target.value, url));
                break;
            case 'camera':
                await CameraImage.handleCameraImage((file, url) => updateUploadedFiles('camera', file, url));
                break;
            case 'screenshot':
                // Handle screenshot upload logic here
                break;
            case 'gif':
                // Handle GIF upload logic here
                break;
            default:
                console.error('Unsupported file type');
        }
    };

    const saveDataIntoDatabase = async () => {
        const fileToSave = Object.values(uploadedFiles).find(file => file !== null);
        if (fileToSave) {
            try {
                await ApiController.saveNewImage(fileToSave);
                console.log('File saved successfully');
                setCurrentDisplayedPicture(null);
                // Clear state
                setUploadedFiles({
                    file: null,
                    urlImage: null,
                    camera: null,
                    screenshot: null,
                    gif: null,
                    video: null,
                });
            } catch (error) {
                console.error('Error saving file:', error);
            }
        } else {
            console.log('No file to save');
        }
    };

    return {
        selectedMethod,
        setSelectedMethod,
        currentDisplayedPicture,
        uploadedFiles,
        handleFileChange,
        saveDataIntoDatabase,
    };
};
