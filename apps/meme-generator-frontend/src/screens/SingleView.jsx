import React, { useEffect, useState } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Statistics from '../components/single-view/statistics.jsx';
import useMeme from '../components/single-view/useMeme.jsx';
import CommentsSection from '../components/single-view/CommentSection.jsx';

//TODO: extra get request for single meme with id needed


const SingleView = () => {
    const { id } = useParams();
    const { image, loading, handleUpvote, handleComment, handleNext, handlePrev } = useMeme(id);

    return (
        <BaseLayout className='p-0 flex justify-center'>
            <div className="mx-2 w-full min-h-screen  max-w-3xl flex flex-col align-middle justify-center md:px-12">
                <div className="w-full flex justify-center">
                    {loading ? (
                        <Skeleton />
                    ) : (
                        <img src={image.url} alt={`Meme ${image.id}`} className="flex object-contain max-h-[70vh] justify-center" />
                    )}
                    {console.log(image.url)}
                </div>
                {loading ? (
                    <Skeleton count={5} />
                ) : (
                    <div className='grid gap-4 mt-8'>
                        <h1 className="text-2xl font-bold col-start-1 row-start-1">{image.title}</h1>
                        <p className='col-start-1 row-start-2'>{image.caption}</p>
                        <p className='col-start-2 row-start-1  justify-self-end'>@{image.author}</p>
                        <p className='col-start-2 row-start-2 justify-self-end'>{new Date(image.createdAt).toLocaleString('en-US', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                    </div>
                )}

                <div class="fixed bottom-0 left-0 right-0 flex gap-4 z-10 p-4 justify-center align-middle">
                    <button className="btn btn-primary" onClick={handlePrev}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V8.69c0-1.44-1.555-2.343-2.805-1.628L12 11.029v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z" />
                    </svg>
                    </button>
                    <button className={`col-start-1 row-start-4 flex flex-col align-middle justify-center`} onClick={() => handleUpvote()}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-6 h-6 ${image.isLikedByUser ? "fill-error" : ""}`}>
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                        </svg>
                        <div className='mx-auto'>{image.likes}</div>
                    </button>
                    <button className="btn btn-primary" onClick={handleNext}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z" />
                    </svg>
                    </button>
                </div>



                <CommentsSection meme={image} loading={loading} handleComment={handleComment}/>
                <Statistics commentsLength={image.comments.length} likes={image?.likes} loading={loading}/>
            </div>
        </BaseLayout>
    );
};

export default SingleView;
