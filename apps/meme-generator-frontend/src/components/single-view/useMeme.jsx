import { useEffect, useState, useCallback } from 'react';
import ApiController from '../../data/ApiController';
import SessionManager from "../../data/SessionManager";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

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

const useMeme = () => {
    const username = SessionManager.getUserName();
    const [image, setImage] = useState(defaultImageState);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [pageIndex, setPageIndex] = useState(0);
    const [memeIndex, setMemeIndex] = useState(0);
    const [lastParams, setLastParams] = useState({filters: null, sorting: null});

    const formatMeme = (img) => ({
        id: img._id,
        title: img.title,
        author: img.author,
        caption: img.description,
        createdAt: img.createdAt,
        url: `${API_BASE_URL}/${img.imageURL}`,
        likes: Array.isArray(img.likes) ? img.likes.length : 0,
        isLikedByUser: img.likes.includes(username),
        comments: img.comments || [],
    });

    const fetchMemes = useCallback(async ({ filters = lastParams.filters, sorting = lastParams.sorting, append = false }) => {
        setLoading(true);
        setError(null);
    
        // If we are not appending, reset the page index and other related state.
        if (!append) {
            setPageIndex(0);
            setMemeIndex(0);
            setLastParams({ filters, sorting });
            setImages([]);
        }
    
        try {
            const { results } = await ApiController.fetchAllMemes({
                page: append ? pageIndex + 1 : pageIndex, // Use the next page if appending, otherwise use the current page.
                filter: filters,
                sortedBy: sorting,
            });
            setImages(prev => append ? [...prev, ...results.map(formatMeme)] : results.map(formatMeme));
            if (append && results.length > 0) {
                setPageIndex(prev => prev + 1); // Only increment the page index if appending and results are returned.
            }
        } catch (error) {
            setError('Failed to fetch new memes');
        } finally {
            setLoading(false);
        }
    }, [lastParams.filters, lastParams.sorting, pageIndex]);
    


    const fetchMemeById = async (id) => {
        setLoading(true);
        try {
            const meme = await ApiController.fetchMemeById(id);
            setImage(formatMeme(meme));
        } catch (error) {
            setError('Failed to fetch meme details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpvote = async (memeId = image.id) => {
        await ApiController.like(memeId, username);

        setImages((prevImages) => prevImages.map((img) => {
            if (img.id === memeId) {
                return {
                    ...img,
                    likes: img.isLikedByUser ? img.likes - 1 : img.likes + 1,
                    isLikedByUser: !img.isLikedByUser,
                };
            }
            return img;
        }));

        setImage((prevImage) => {
            if (prevImage.id === memeId) {
                return {
                    ...prevImage,
                    likes: prevImage.isLikedByUser ? prevImage.likes - 1 : prevImage.likes + 1,
                    isLikedByUser: !prevImage.isLikedByUser,
                };
            }
            return prevImage;
        });
    };

    const handleComment = async (commentText) => {
        if (!commentText.trim()) return;
        await ApiController.addComment(image.id, commentText, username);

        setImages((prevImages) => prevImages.map((img) => {
            if (img.id === image.id) {
                return {
                    ...img,
                    likes: img.isLikedByUser ? img.likes - 1 : img.likes + 1,
                    isLikedByUser: !img.isLikedByUser,
                };
            }
            return img;
        }));

        setImage((prevImage) => ({
            ...prevImage,
            comments: [...prevImage.comments, { author: username, comment: commentText }],
        }));
    };

    const handleNextPrevCommon = (direction) => {
        const newIndex = memeIndex + direction;
        if (newIndex < 0 || newIndex >= images.length) {
            setMemeIndex(0);
            const newPageIndex = pageIndex + direction;
            if (newPageIndex >= 0 && (images.length === ApiController.PAGE_LIMIT)) {
                setPageIndex(newPageIndex);
                fetchMemes({filters: lastParams.filters, sorting: lastParams.sorting, append: false});
            }
        } else {
            setMemeIndex(newIndex);
            setImage(images[newIndex]);
        }
    };

    const handleNext = () => handleNextPrevCommon(1);
    const handlePrev = () => handleNextPrevCommon(-1);

    return { image, images, loading, error, setImage, setImages, setPageIndex, fetchMemes, fetchMemeById, lastParams, handleUpvote, handleComment, handleNext, handlePrev };
};

export default useMeme;
