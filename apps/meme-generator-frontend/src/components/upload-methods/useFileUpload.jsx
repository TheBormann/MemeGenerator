import { useState } from 'react';
import ApiController from '../../data/ApiController';
import { useNavigate } from 'react-router-dom'; 

export const useFileUpload = () => {
    const [template, setTemplate] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = async (event) => {
        setLoading(true);
        const uploadedFile = event.target.files[0];
        if (!uploadedFile || !['image/jpeg', 'image/png', 'image/gif'].includes(uploadedFile.type)) {
            setLoading(false);
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            setFile(uploadedFile); // This stores the image data URL
            await saveDataIntoDatabase(uploadedFile);
            setLoading(false);
            handleUploaded();
        };
        reader.readAsDataURL(uploadedFile);
    };

    const saveDataIntoDatabase = async (fileData) => {
        try {
            const response = await ApiController.saveNewImage(fileData);
            console.log('File saved successfully');
            setTemplate(response['template']);
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };

    const handleUploaded = () => {
        console.log(template)
        navigate('/create-meme', { state: { selectedTemplate: template } });
    }

    return {
        template,
        file,
        handleFileChange,
        loading
    };
};
