import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import BaseLayout from '../components/layout/BaseLayout';
import { Link } from "react-router-dom";
import useTemplate from '../components/editor/useTemplate';

const SelectTemplate = () => {
    const { templates, filterOptions, onFilterChange } = useTemplate();

    const navigate = useNavigate();

    const handleImageClick = (template) => {
        navigate('/create-meme', { state: { selectedTemplate: template } });
    }


    return (
        <BaseLayout showFooter={false} className="pt-0">
            <div className="container h-screen overflow-hidden w-full px-6 flex flex-col align-top justify-left md:align-middle md:px-12 mx-auto">
                <div className="mb-10 mt-24">
                    <h1 className="text-5xl font-bold pb-5">Select Template</h1>
                    <div className="form-control flex flex-row gap-1">
                        <label className="cursor-pointer label badge badge-accent badge-outline p-4">
                            <span className="label-text m-1">Public</span>
                            <input type="checkbox" onChange={() => onFilterChange('public')} checked={filterOptions.public} className="checkbox checkbox-accent" />
                        </label>
                        <label className="cursor-pointer label badge badge-accent badge-outline p-4">
                            <span className="label-text m-1">Uploaded</span>
                            <input type="checkbox" onChange={() => onFilterChange('upload')} checked={filterOptions.upload} className="checkbox checkbox-accent" />
                        </label>
                    </div>
                </div>
                {templates.length > 0 ? (
                    <div className="h-full mb-10 carousel carousel-vertical rounded-box ">
                        {templates.map((image, index) => (
                            <div key={index} className="carousel-item h-full w-full">
                                <img
                                    src={image.url}
                                    alt={`${image.name}`}
                                    onClick={() => handleImageClick(image)}
                                    className='outline outline-white w-full object-contain h-full cursor-pointer'
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center mt-10">
                        <p>No templates available.</p>
                    </div>
                )}

                <div className="fixed bottom-4 left-0 right-0 flex justify-center">
                    <Link to="/upload-template" className="btn btn-outline flex items-center justify-center font-bold py-2 px-4 rounded-badge bg-white">
                        <svg className=" w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fillRule="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add new template
                    </Link>
                </div>
            </div>
        </BaseLayout>
    );
};

export default SelectTemplate;
