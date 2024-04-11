import { useEffect, useState, useCallback } from 'react';
import ApiController from '../../data/ApiController';
import SessionManager from "../../data/SessionManager";

const defaultImageState = () => ({
    id: "Error",
    title: 'Error - Image not found',
    caption: 'Error',
    author: 'Error',
    createdAt: "Error",
    url: "Error",
    comments: [],
    likes: 0,
    isLikedByUser: false,
});

const useMeme = (id) => {
    const username = SessionManager.getUserName();
    const [image, setImage] = useState(defaultImageState);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pageNumber, setPageNumber] = useState(0);
    const [memeIndex, setMemeIndex] = useState(0);

    const formatImage = (img) => ({
        id: img._id,
        title: img.title,
        author: img.author,
        caption: img.description,
        createdAt: img.createdAt,
        url: `http://localhost:3001/${img.imageURL}`,
        likes: Array.isArray(img.likes) ? img.likes.length : 0,
        isLikedByUser: img.likes.includes(username),
        comments: img.comments || [],
    });

    useEffect(() => {
        if (!id) {
            setLoading(true);
            fetchNewData(0);
            setLoading(false);
            return;
        }

        const fetchMemeById = async () => {
            setLoading(true);
            try {
                const meme = await ApiController.fetchMemeById(id);
                setImage(formatImage(meme));
            } catch (error) {
                console.error('Error fetching meme by ID:', error);
                setError('Failed to fetch meme details');
            } finally {
                setLoading(false);
            }
        };

        fetchMemeById();
    }, [id]);

    const handleUpvote = async (memeId) => {
        const targetId = memeId || image.id;
        await ApiController.like(targetId, username);

        if (memeId !== undefined) {
            setImages((prevImages) => prevImages.map((img) => {
                if (img.id === targetId) {
                    return {
                        ...img,
                        likes: img.isLikedByUser ? img.likes - 1 : img.likes + 1,
                        isLikedByUser: !img.isLikedByUser,
                    };
                }
                return img;
            }));
        } else {
            setImage((prevImage) => ({
                ...prevImage,
                likes: prevImage.isLikedByUser ? prevImage.likes - 1 : prevImage.likes + 1,
                isLikedByUser: !prevImage.isLikedByUser,
            }));
        }
    };

    const handleComment = async (commentText) => {
        if (!commentText.trim()) return;
        await ApiController.addComment(image.id, commentText, username);
        setImage((prevImage) => ({
            ...prevImage,
            comments: [...prevImage.comments, { author: username, comment: commentText }],
        }));
    };

    const fetchNewData = async (pageNum, startIndex = 0, append = false) => {
        setLoading(true);
        try {
            const { results } = await ApiController.fetchAllMemes(pageNum);
            const formattedImages = results.map(formatImage);

            // If pageNum is the next sequential page, append new images to the existing ones
            if (append) {
                setImages(prevImages => [...prevImages, ...formattedImages]);
            } else {
                setImages(formattedImages);
            }

            setPageNumber(pageNum);
            setMemeIndex(startIndex);
            // Set the first image of the new batch if not appending, or maintain the current image if we are
            setImage(pageNum === pageNumber + 1 ? image : formattedImages[startIndex]);
        } catch (error) {
            console.error('Error fetching new memes:', error);
            setError('Failed to fetch new memes');
        } finally {
            setLoading(false);
        }
    };

    const fetchNextPage = () => {
        if(images.length % ApiController.PAGE_LIMIT !== 0) return;
        fetchNewData(pageNumber + 1, 0, true);
    };

    const handleNextPrevCommon = useCallback((direction) => {
        const newIndex = memeIndex + direction;
        if (newIndex < 0 || newIndex >= images.length) {
            const newPageNumber = pageNumber + direction;
            fetchNewData(newPageNumber, direction === 1 ? 0 : ApiController.PAGE_LIMIT - 1);
        } else {
            setMemeIndex(newIndex);
            setImage(images[newIndex]);
        }
    }, [memeIndex, images, pageNumber]);

    const handleNext = () => handleNextPrevCommon(1);
    const handlePrev = () => handleNextPrevCommon(-1);

    return { image, images, loading, error, setImage, setImages, setPageNumber, handleUpvote, handleComment, fetchNextPage, handleNext, handlePrev };
};

export default useMeme;
