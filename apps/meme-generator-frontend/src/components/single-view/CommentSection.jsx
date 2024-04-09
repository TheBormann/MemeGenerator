import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CommentsSection = ({meme, loading, handleComment }) => {
  const [commentText, setCommentText] = useState('');

  const onCommentAdded = async () => {
    await handleComment(commentText);
    setCommentText('');
  };

  const changeCommentText = (event) => {
    setCommentText(event.target.value);
  };

  return (
    <div className="mt-4 h-full relative">
      <h3 className="text-2xl font-bold mb-2">Comments</h3>
      {loading ? (
        <Skeleton count={5} />
      ) : (
        <div className="overflow-y-scroll">
          <ul className="">
            {meme.comments.map((comment, index) => (
              <li key={index} className="py-2 px-4 my-2 bg-base-200 rounded-box">
                <button className="mb-2 text">@{comment.author}</button>
                <p className="">
                    {comment.comment}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4 flex gap-2 items-end">
        <textarea
          className="textarea textarea-bordered rounded-lg w-full"
          placeholder="Add comment ..."
          onChange={changeCommentText}
          value={commentText}
        ></textarea>
        <button
          className="btn btn-primary"
          disabled={commentText === ""}
          onClick={onCommentAdded}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        
        </button>
      </div>
    </div>
  );
};

export default CommentsSection;
