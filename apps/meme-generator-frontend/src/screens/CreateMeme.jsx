import React, { useState, useRef, useEffect } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import EditorWindow from '../components/editor/EditorWindow';
import { useLocation } from 'react-router-dom';

const CreateMemePage = () => {
    const location = useLocation();
    const { selectedTemplate } = location.state || {}; 
    console.log(selectedTemplate)

    return (
        <BaseLayout>
            <div className="container w-full mx-auto min-h-screen px-6 md:px-12 align-top justify-left md:justify-center ">
                <EditorWindow template={selectedTemplate}></EditorWindow>
            </div>
        </BaseLayout>
    );
};

export default CreateMemePage;
