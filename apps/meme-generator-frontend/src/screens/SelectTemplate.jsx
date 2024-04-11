import React, { useState, useRef, useEffect } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import { Link } from "react-router-dom";
import EditorWindow from '../components/editor/EditorWindow';
import useTemplate from '../components/editor/useTemplate';

const SelectTemplate = () => {
    const { templates, draft, loading, filterOptions, randomizeTemplate, updateSelectedTemplate, selectNextTemplate, selectPrevTemplate, onFilterChange } = useTemplate();

    useEffect(() => {
        console.log('Draft has been updated', draft);
    }, [draft]);


    return (
        <BaseLayout>
            <div className="justify-left grid min-h-screen max-w-full px-6 align-top md:justify-center md:px-12 mx-auto w-[1070px]">
                <div className="h-fit ">
                    <h1 className="text-5xl font-bold pb-5">Select Template</h1>
                </div>
                <img src={draft.imageUrl} alt={`Meme ${draft.templateId}`} className="flex object-contain max-h-[70vh] justify-center" />
                <div className="flex flew-row justify-between mt-8 mb-2">
                    <h2 className="text-xl pl-3 font-bold py-2">Uploaded Templates:</h2>
                    <Link to="/add-template" className="link link-accent flex items-center justify-center font-bold py-2 px-4 rounded">
                        <svg className=" w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fillRule="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add new template
                    </Link>
                </div>
                <div className='flex flex-row items-center gap-2'>
                    <div className="text-md pl-4">Filter options</div>
                    <div className="form-control flex flex-row gap-1">
                        <label className="cursor-pointer label badge badge-accent badge-outline p-4">
                            <span className="label-text m-1">Public</span>
                            <input type="checkbox" onChange={() => onFilterChange('public')} checked={filterOptions.showPublic} className="checkbox checkbox-accent" />
                        </label>
                        <label className="cursor-pointer label badge badge-accent badge-outline p-4">
                            <span className="label-text m-1">Uploaded</span>
                            <input type="checkbox" onChange={() => onFilterChange('upload')} checked={filterOptions.showUploaded} className="checkbox checkbox-accent" />
                        </label>
                    </div>
                </div>
                <div className="carousel rounded-box m-5">
                    <div className="carousel-item">
                        {templates.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={`Image ${image.name}`}
                                onClick={() => {
                                    updateSelectedTemplate(image);
                                }}
                                className='outline outline-white'
                                style={{ height: '200px' }}
                            />
                        ))}
                    </div> 
                </div>
            </div>
        </BaseLayout>
    );
};

export default SelectTemplate;
