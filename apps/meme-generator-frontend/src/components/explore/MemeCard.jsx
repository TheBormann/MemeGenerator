import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import ImageService from "../../data/services/imageService";
import useMeme from '../../components/single-view/useMeme.jsx';
import ApiController from "../../data/ApiController.js";
import SessionManager from "../../data/SessionManager";
import CommentsSection from '../../components/single-view/CommentSection.jsx';

const MemeCard = ({ meme }) => {
  const { image, loading, handleUpvote, handleComment, handleNext, handlePrev } = useMeme(meme._id);

  const handleRedirection = () => {
    window.location.href = `/Single-View/${meme._id}`;
  };

  return (
    <div className={``}>
      <div className="card lg:card-side bg-base-100 ">
        <div
          className={`backdrop-blur-3xl lg:h-[78vh] h-[50vh] max-w-screen-lg w-full flex justify-center relative cursor-pointer`}
          onClick={handleRedirection}
        >
          <img
            src={image.url}
            alt={`${image.title} background blur`}
            className={`object-cover w-[80%] h-[80%] absolute blur-2xl`}
          />
          <img
            src={image.url}
            alt={`${image.title}`}
            className={`max-h-[75vh] m-4 object-scale-down h-full absolute rounded-lg`}
          />
        </div>
        <div className="card-body grid grid-rows-[auto-auto-1fr] lg:w-[35%]">
          <h2
            className="col-start-1 row-start-1 card-title items-start text-lg font-bold hover:underline underline-offset-2 cursor-pointer"
            onClick={handleRedirection}
          >
            {image.title}
          </h2>
          <span className="col-start-2 row-start-1 justify-self-end text-xs text-right font-semibold">
            {"@" + image.author}
          </span>
          <p className="col-start-1 row-start-2 col-span-2">{image.caption}</p>
          
          <div className="col-start-1 row-start-3 col-span-2 mt-4 place-items-end justify-items-end align-bottom">
            <div className="flex gap-4">
              <button
                  className={`btn btn-rounded btn-outline`}
                  onClick={handleRedirection}
                >
                Comment
              </button>
              <button className={`col-start-1 row-start-4 flex flex-col align-middle justify-center`} onClick={handleUpvote}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-6 h-6 ${image.isLikedByUser ? "fill-error" : ""}`}>
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                        </svg>
                        <div className='mx-auto'>{image.likes}</div>
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MemeCard;
