import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import useTextToSpeech from "../editor/useTextToSpeech";
import Skeleton from 'react-loading-skeleton'; 
import SessionManager from "../../data/SessionManager";

const MemeCard = ({ meme, handleUpvote }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const { speak, cancel } = useTextToSpeech();

  const handleRedirection = () => {
    navigate(`/Single-View/${meme.id}`);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && SessionManager.getSpeechSettings().read_feed) {
            const newData = { title: meme.title, caption: meme.caption };
            speak(JSON.stringify(newData));
          } else {
            // Deactivate speech
            cancel();
          }
        });
      },
      {
        root: null, // observing in viewport
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the item is visible, adjust as needed
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
      cancel();
    };
  }, [meme, speak, cancel]);

  if (!meme) {
    return <div className="skeleton-loader"><Skeleton width={200} height={200}/></div>;
  }

  return (
      <div className="card select-none lg:card-side bg-base-100 h-screen pt-48 lg:pt-24">
        <Link to={`/Single-View/${meme.id}`}
          ref={cardRef}
          className={`backdrop-blur-3xl lg:h-[85vh] h-[60vh] max-w-screen-lg w-full flex justify-center relative cursor-pointer my-auto`}
        >
          <img
            src={meme.url}
            alt={`${meme.title} background blur`}
            className={`object-cover w-[90%] h-[90%] md:w-[60%] md:h-[60%] lg:w-[80%] lg:h-[80%] mt-[10%] md:mt-[0%] absolute blur-2xl`}
          />
          <img
            src={meme.url}
            alt={`${meme.title}`}
            className={`max-h-[75vh] m-4 object-scale-down  h-full absolute`}
          />
        </Link>
        <div className="card-body max-w-xl mx-auto mb-auto lg:mt-auto w-full grid grid-rows-[auto-auto-1fr] lg:w-[35%]">
          <h2
            className="col-start-1 row-start-1 card-title items-start text-lg font-bold hover:underline underline-offset-2 cursor-pointer"
            onClick={handleRedirection}
          >
            {meme.title}
          </h2>
          <span className="col-start-2 row-start-1 justify-self-end text-xs text-right font-semibold mt-1">
            {"@" + meme.author}
          </span>
          <p className="col-start-1 row-start-2 col-span-2">{meme.caption}</p>
          
          <div className="col-start-1 row-start-3 col-span-2 flex gap-4 align-middle justify-center">
              <button
                  className={`btn btn-rounded btn-outline`}
                  onClick={handleRedirection}
                >
                Comment
              </button>
              <button className={`col-start-1 row-start-4 flex flex-col`} onClick={() => handleUpvote(meme.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-6 h-6 ${meme.isLikedByUser ? "fill-error" : ""}`}>
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                        </svg>
                        <div className='mx-auto'>{meme.likes}</div>
                </button>
              </div>
        </div>
      </div>
  );
};
export default MemeCard;
