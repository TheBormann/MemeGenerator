import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import BaseLayout from '../components/layout/BaseLayout';
import { Link } from "react-router-dom";
import { useFileUpload } from '../components/upload-methods/useFileUpload';

const UploadTemplate = () => {
    const navigate = useNavigate();

    const handleUploaded = (template) => {
        navigate('/create-meme', { state: { selectedTemplate: template } });
    }

    const { template, handleFileChange } = useFileUpload(handleUploaded);


    return (
        <BaseLayout showFooter={false} className="pt-0">
            <div className="container h-screen overflow-hidden w-full px-6 flex flex-col align-top justify-left md:align-middle md:px-12 mx-auto">
                <div className="mb-10 mt-24">
                    <h1 className="text-5xl font-bold pb-5">Upload Template</h1>
                </div>

                <div role="tablist" className="tabs tabs-lifted">
                    <input type="radio" name="upload_tabs" role="tab" className="tab" aria-label="File" defaultChecked/>
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                        <div class="flex items-center justify-center w-full">
                            <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" type="file" class="hidden" onChange={handleFileChange}/>
                            </label>
                        </div> 
                    </div>

                    <input type="radio" name="upload_tabs" role="tab" className="tab" aria-label="URL"/>
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                        Tab content 2
                    </div>

                    <input type="radio" name="upload_tabs" role="tab" className="tab" aria-label="Draw" />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                        Tab content 3
                    </div>

                    <input type="radio" name="upload_tabs" role="tab" className="tab" aria-label="Camera" />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                        Tab content 4
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
};

export default UploadTemplate;
