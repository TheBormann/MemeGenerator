import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import BaseLayout from '../components/layout/BaseLayout';
import EditorWindow from '../components/editor/EditorWindow';
import ApiController from '../data/ApiController';
import useMeme from '../components/single-view/useMeme';
const EditMemePage = () => {
    const { id } = useParams();
    const [meme, setMeme] = useState(null);
    useEffect(() => {
        const fetchMeme = async () => {
            const fetchedMeme = await ApiController.fetchMemeById(id);
            setMeme(fetchedMeme);
            console.log(fetchedMeme);
        }
        fetchMeme();
    }, [id]);

    return (
        <BaseLayout>
            <div className="container w-full mx-auto min-h-screen px-6 md:px-12 align-top justify-left md:justify-center ">
                <EditorWindow meme={meme} editing={true}></EditorWindow>
            </div>
        </BaseLayout>
    );
};

export default EditMemePage;
