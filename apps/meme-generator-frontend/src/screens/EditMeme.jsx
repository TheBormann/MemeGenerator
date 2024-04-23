import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import BaseLayout from '../components/layout/BaseLayout';
import EditorWindow from '../components/editor/EditorWindow';
import ApiController from '../data/ApiController';

const EditMemePage = () => {
    const { id } = useParams();

    return (
        <BaseLayout>
            <div className="container w-full mx-auto min-h-screen px-6 md:px-12 align-top justify-left md:justify-center ">
                <EditorWindow memeId={id} editing={true}></EditorWindow>
            </div>
        </BaseLayout>
    );
};

export default EditMemePage;
