import React, { useEffect, useState, useCallback } from 'react';
import ApiController from '../../data/ApiController';
import SessionManager from "../../data/SessionManager";

const useMeme = (id) => {
    const username = SessionManager.getUserName();
    const [image, setImage] = useState({
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
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
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
        let isMounted = true; // Track if the component is mounted

        const fetchMemeById = async () => {
            setLoading(true);
            try {
                const meme = await ApiController.fetchMemeById(id);
                if (isMounted) {
                    setImage(formatImage(meme));
                }
            } catch (error) {
                console.error('Error fetching meme by ID:', error);
                if (isMounted) {
                    setError('Failed to fetch meme details');
                }
            } finally {
                if (isMounted) {
                    setLoading(false); // Ensure we only set state if component is still mounted
                }
            }
        };

        fetchMemeById();

        return () => {
            isMounted = false; // Cleanup function to negate any further state updates on unmounted component
        };
    }, [id]);

    const fetchNewData = async (pageNum, startIndex) => {
        try {
            setLoading(true);
            if (pageNum !== pageNumber) {
                const { results } = await ApiController.fetchAllMemes(pageNum);
                const formattedImages = results.map(formatImage);
                setImages(formattedImages);
            }

            setPageNumber(pageNum);
            setMemeIndex(startIndex);
            setImage(images[startIndex]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching new memes:', error);
            setError('Failed to fetch new memes');
            setLoading(false);
        }
    };

    const handleUpvote = () => {
        ApiController.like(image.id, username);
        setImage((prevImage) => ({
            ...prevImage,
            likes: prevImage.isLikedByUser ? prevImage.likes - 1 : prevImage.likes + 1,
            isLikedByUser: !prevImage.isLikedByUser,
        }));
      };

      const handleComment = async (commentText) => {
        if (!commentText.trim()) return;
    
        await ApiController.addComment(image.id, commentText, username);
        setImage((prevImage) => ({
            ...prevImage,
            comments: [...prevImage.comments, { author: username, comment: commentText }],
        }));
      };

    const handleNext = () => {
        if (memeIndex + 1 >= ApiController.PAGE_LIMIT) {
            if (images.length <= memeIndex + 1) {
                console.log('Already at the last meme');
                return;
            }
            fetchNewData(pageNumber + 1, 0);
        }else {
            fetchNewData(pageNumber, memeIndex + 1);
        }
    };

    const handlePrev = () => {
        if (memeIndex - 1 < 0) {
            if (pageNumber <= 0) {
                console.log('Already at the first meme');
                return;
            }
            fetchNewData(pageNumber - 1, 9);
        } else {
            fetchNewData(pageNumber, memeIndex - 1);
        }
    };

    return { image, images, loading, error, setImage, setImages, setPageNumber,
        handleUpvote, handleComment, handleNext, handlePrev };
};

export default useMeme;
