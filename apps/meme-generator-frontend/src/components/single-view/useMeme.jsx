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

    const fetchMemes = async ({ filters, sorting, append = false }) => {
        setLoading(true);

        if (JSON.stringify(filters) !==
            JSON.stringify(lastParams.filters) ||
            JSON.stringify(sorting) !==
            JSON.stringify(lastParams.sorting) ||
            !append
        ) {
            setPageIndex(0);
            setMemeIndex(0);
            setLastParams({ filters: filters, sorting: sorting });
            setImages([])
        }

        if(images.length !== 0 && images.length % ApiController.PAGE_LIMIT !== 0) {
            setLoading(false);
            return;
        }
        
        try {
            const { results } = await ApiController.fetchAllMemes({
                page: pageIndex,
                filter: filters,
                sortedBy: sorting,
            });
            setImages(append
            ? [...images, ...results.map(formatMeme)]
            : results.map(formatMeme));

            setPageIndex(pageIndex + 1)
            setMemeIndex(0)
        } catch (error) {
            setError('Failed to fetch new memes');
        } finally {
            setLoading(false);
        }
    };

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

    return { image, images, loading, error, setImage, setImages, setPageIndex, fetchMemes, fetchMemeById, handleUpvote, handleComment, handleNext, handlePrev };
};

export default useMeme;
