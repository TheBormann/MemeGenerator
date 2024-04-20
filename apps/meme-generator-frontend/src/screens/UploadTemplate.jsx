import React, { useState, useRef, useEffect } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import ApiController from '../data/ApiController';
import { useNavigate } from 'react-router-dom'; 

const API_BASE_URL = ApiController.API_BASE_URL;

const UploadTemplate = () => {
    const [template, setTemplate] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toSrcPath = (suffix) => {
        return `${API_BASE_URL}/${suffix}`;
      }

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
        };
        reader.readAsDataURL(uploadedFile);

        try {
            const response = await ApiController.saveNewImage(uploadedFile);
            console.log('File saved successfully');
            const newTemplate = {
                id: response['template']._id,
                name: response['template'].name,
                url: toSrcPath(response['template'].imagePath),
            }
            await setTemplate(newTemplate);
            navigate('/create-meme', { state: { selectedTemplate: newTemplate } });
        } catch (error) {
            console.error('Error saving file:', error);
        }
        setLoading(false);
    };

    return (
        <BaseLayout showFooter={false} className="pt-0">
            <div className="container h-screen overflow-hidden w-full px-6 flex flex-col align-top justify-left md:align-middle md:px-12 mx-auto">
                <div className="mb-10 mt-24">
                    <h1 className="text-5xl font-bold pb-5">Upload Template</h1>
                </div>
                <div class="flex flex-col items-center justify-center w-full">
                    <input
                        type="text"
                        placeholder="Template Name"
                        className="input input-bordered w-full mb-6 max-w-xl mx-auto"
                        
                        
                    />
                    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" type="file" class="hidden" onChange={handleFileChange}/>
                    </label>
                </div> 
            </div>
        </BaseLayout>
    );
};

export default UploadTemplate;
