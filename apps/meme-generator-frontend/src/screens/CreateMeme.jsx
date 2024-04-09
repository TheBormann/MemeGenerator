import React, { useState, useRef, useEffect } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import { Link } from "react-router-dom";
import EditorWindow from '../components/editor/EditorWindow';
import ImageService from '../data/services/imageService';
import ApiController from '../data/ApiController';
import SessionManager from '../data/SessionManager';

const CreateMemePage = () => {
    const [templates, setTemplates] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [filterOptions, setFilterOptions] = useState({
        showPublic: true,
        showUploaded: false
    });

    const [draft, setDraft] = useState({
        imageUrl: "",
        templateId: ""
    });
    const [templateIndex, setTemplateIndex] = useState(0);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {

        // Randomize the initial draft
        randomizeTemplate();

        // Fetch templates when the component mounts
        fetchTemplates();

    }, []); // Empty dependency array to run the effect only once

    const fetchTemplates = async (authors) => {
        try {
            setLoading(true); // Start loading

            const templates = await ApiController.fetchAllTemplates(authors);

            const newTemplates = templates.map(item => ({
                id: item._id,
                name: item.name,
                url: ImageService.toSrcPath(item.imagePath),
            }));
    
            setTemplates(newTemplates);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Stop loading
        }
        
    };

    const randomizeTemplate = async () => {
        const [randomTemplate, index] = await ImageService.getRandomTemplate();

        setDraft({
            templateId: randomTemplate.name,
            imageUrl: ImageService.toSrcPath(randomTemplate.imagePath),
        });
        setTemplateIndex(index);
    }

    const updateSelectedTemplate = (image) => {

        const imageURL = image.url;
        const imageName = image.id;
        const imageIdx = templates.indexOf(image);

        setDraft({
            imageUrl: imageURL,
            templateId: imageName
        });

        setTemplateIndex(imageIdx);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const selectNextTemplate = () => {
        const idx = (templateIndex + 1) % templates.length;
        setDraft({
            templateId: templates[idx].id,
            imageUrl: templates[idx].url,
        });
        setTemplateIndex(idx);
    }

    const selectPrevTemplate = () => {
        const idx = (templateIndex + templates.length - 1) % templates.length;
        setDraft({
            templateId: templates[idx].id,
            imageUrl: templates[idx].url,
        });
        setTemplateIndex(idx)
    }

    const onFilterChange = async (option) => {
        let willShowPublic = filterOptions.showPublic;
        let willShowUploaded = filterOptions.showUploaded;

        if (option == "public") {
            willShowPublic = !willShowPublic;
            setFilterOptions({...filterOptions, showPublic: willShowPublic})
        } else {
            willShowUploaded = !willShowUploaded
            setFilterOptions({...filterOptions, showUploaded: willShowUploaded})
        }
        let authors = [];
        if (willShowPublic) {
            authors.push("public");
        }
        if (willShowUploaded) {
            authors.push(SessionManager.getUserName());
        }
        await fetchTemplates(authors);
    }

    return (
        <BaseLayout>
            <div className="justify-left grid min-h-screen max-w-full px-6 align-top md:justify-center md:px-12 mx-auto w-[1070px]">
                <div className="h-fit ">
                    <h1 className="text-5xl font-bold pb-5">Create Your Meme</h1>
                </div>
                <EditorWindow draft={draft} isLoading={loading} onSelectNextTemplate={selectNextTemplate} onSelectPrevTemplate={selectPrevTemplate} onRandomizeTemplate={randomizeTemplate}></EditorWindow>
                <div className="flex flew-row justify-between mt-8 mb-2">
                    <h2 className="text-xl pl-3 font-bold py-2">Uploaded Templates:</h2>
                    <Link to="/Add-Method" className="link link-accent flex items-center justify-center font-bold py-2 px-4 rounded">
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

export default CreateMemePage;
