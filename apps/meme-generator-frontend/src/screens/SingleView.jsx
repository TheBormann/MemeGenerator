import React, { useEffect, useState, useRef } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import { Link, useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Statistics from '../components/single-view/statistics.jsx';
import CommentsSection from '../components/single-view/CommentSection.jsx';
import useTextToSpeech from '../components/editor/useTextToSpeech.jsx';
import SessionManager from "../data/SessionManager";
import  { useMemeContext } from "../contexts/memeContext.jsx";

const SingleView = () => {
    const { id } = useParams();
    const { image, images, loading, error, fetchMemeById, handleUpvote, handleComment, handleNext, handlePrev  } = useMemeContext();
    const { speak, cancel } = useTextToSpeech();
    const hasSpokenRef = useRef(false);

    useEffect(() => {
        fetchMemeById(id);
      }, [id]);

    useEffect(() => {
        if (!loading && image && !hasSpokenRef.current) {
            const settings = SessionManager.getSpeechSettings();
            let newData = {};

            if (settings.read_details && settings.read_comments && image.comments.length > 0) {
                newData = { title: image.title, caption: image.caption, comments: image.comments.map(comment => comment.comment).join('    ') };
            } else if (settings.read_details) {
                newData = { title: image.title, caption: image.caption };
            }

            if (Object.keys(newData).length !== 0) {
                speak(JSON.stringify(newData));
                hasSpokenRef.current = true; 
            }
        }

        return () => {
            cancel();
        };
    }, [image, loading, speak, cancel]);

    return (
        <BaseLayout className='pt-24 flex justify-center'>
            <div className="mx-2 w-full min-h-screen  max-w-3xl flex flex-col align-middle justify-center md:px-12">
                <div className="w-full flex justify-center pb-8">
                    {loading ? (
                        <Skeleton />
                    ) : (
                        <img src={image.url} alt={`Meme ${image.id}`} className="flex object-contain max-h-[70vh] justify-center" />
                    )}
                </div>
                {loading ? (
                    <Skeleton count={5} />
                ) : (
                    <div className='grid gap-4'>
                        <h1 className="text-2xl font-bold col-start-1 row-start-1">{image.title}</h1>
                        <p className='col-start-1 row-start-2'>{image.caption}</p>
                        <p className='col-start-2 row-start-1  justify-self-end'>@{image.author}</p>
                        <p className='col-start-2 row-start-2 justify-self-end'>{new Date(image.createdAt).toLocaleString('en-US', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                    </div>
                )}

                <div class="fixed bottom-0 left-0 right-0 flex gap-4 z-10 p-4 justify-center align-middle">
                    { images.length > 0 && 
                        <button className="btn btn-ghost" onClick={handlePrev}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V8.69c0-1.44-1.555-2.343-2.805-1.628L12 11.029v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z" />
                        </svg>
                        </button>
                    }
                    <button className={`btn btn-ghost btn-circle col-start-1 row-start-4 flex flex-col align-middle justify-center`} onClick={() => handleUpvote()}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-6 h-6 ${image.isLikedByUser ? "fill-error" : ""}`}>
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                        </svg>
                        <div className='mx-auto'>{image.likes}</div>
                    </button>
                    { images.length > 0 && 
                        <button className="btn btn-ghost" onClick={handleNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z" />
                        </svg>
                        </button>
                    }
                </div>
                
                {image.author === SessionManager.getUserName() && (
                    <Link to={`/edit-meme/${image.id}`} className='fixed top-20 right-4 btn  btn-circle'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                        </svg>
                    </Link>
                )}

                <CommentsSection meme={image} loading={loading} handleComment={handleComment}/>
                <Statistics commentsLength={image.comments.length} likes={image?.likes} loading={loading}/>
            </div>
        </BaseLayout>
    );
};

export default SingleView;
