import React, { useState } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import ApiController from '../data/ApiController';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = ApiController.API_BASE_URL;

const UploadTemplate = () => {
    const [template, setTemplate] = useState(null);
    const [templateName, setTemplateName] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // To store the image URL
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toSrcPath = (suffix) => {
        return `${API_BASE_URL}/${suffix}`;
    };

    const handleTemplateNameChange = (event) => {
        setTemplateName(event.target.value);
    };

    const handleFileChange = async (event) => {
        setLoading(true);
        const uploadedFile = event.target.files[0];
        if (!uploadedFile || !['image/jpeg', 'image/png', 'image/gif'].includes(uploadedFile.type)) {
            setLoading(false);
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result); // Set the preview URL to the file content
        };
        fileReader.readAsDataURL(uploadedFile);
        setFile(uploadedFile);
        setLoading(false);
    };

    const handleUpload = async () => {
        if (!file || !templateName) {
            alert("Please provide both a file and a template name.");
            return;
        }
        setLoading(true);
        try {
            const response = await ApiController.saveNewImage(file);
            console.log('File saved successfully');
            const newTemplate = {
                id: response['template']._id,
                name: response['template'].name,
                url: toSrcPath(response['template'].imagePath),
            };
            await setTemplate(newTemplate);
            navigate('/create-meme', { state: { selectedTemplate: newTemplate } });
        } catch (error) {
            console.error('Error saving file:', error);
        }
        setLoading(false);
    };

    return (
        <BaseLayout showFooter={false} className="pt-0">
            <div className="container min-h-screen w-full px-6 flex flex-col align-top justify-left md:align-middle md:px-12 mx-auto">
                <div className="mb-10 mt-24">
                    <h1 className="text-5xl font-bold pb-5">Upload Template</h1>
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                    <input
                        type="text"
                        placeholder="Template Name"
                        className="input input-bordered w-full mb-12 max-w-xl mx-auto"
                        value={templateName}
                        onChange={handleTemplateNameChange}
                    />
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full min-h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Uploaded Image" className="h-full w-full object-cover rounded-lg" />
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                        )}
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange}/>
                    </label>
                </div> 
                <button
                    className={`btn btn-primary  max-w-lg mx-auto my-12 ${!file || !templateName ? 'btn-disabled' : ''}`}
                    onClick={handleUpload}
                    disabled={!file || !templateName}
                >
                Upload Template
                </button>
            </div>
        </BaseLayout>
    );
};

export default UploadTemplate;
