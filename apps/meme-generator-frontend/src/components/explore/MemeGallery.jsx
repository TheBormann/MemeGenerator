import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { throttle } from 'lodash';
import MemeFilter from "./MemeFilter";
import MemeCard from "./MemeCard";
import { useMemeContext } from '../../contexts/memeContext';

const MemeGallery = ({ title, showFilter = true }) => {
  const [showFab, setShowFab] = useState(false);
  const contentRef = useRef(null);
  const { images, fetchMemes, loading, error, handleUpvote } = useMemeContext();
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);

  const handleScroll = throttle(() => {
    const content = contentRef.current;
    if (content) {
      const isBottom = content.scrollHeight - content.scrollTop <= (content.clientHeight + 10);
      if (isBottom && !loading) {
        console.log("Fetching more memes");
        setSavedScrollPosition(content.scrollTop - (content.clientHeight / 2));
        fetchMemes({ append: true });
      }

      setShowFab(content.scrollTop > 200);
    }
  }, 200);

  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      content.addEventListener("scroll", handleScroll);
      return () => {
        handleScroll.cancel();
        content.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  useLayoutEffect(() => {
    if (contentRef.current && savedScrollPosition !== 0) {
      contentRef.current.scrollTop = savedScrollPosition;  // Restore scroll position after DOM updates
    }
  }, [images]);  // This effect depends on the images array

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Early return for error state
  if (error) {
    return <div className="text-red-500 text-center h-full w-full">Failed to load memes: {error}</div>;
  }

  // Early return for loading state
  if (loading) {
    return (
      <div className="flex justify-center align-middle h-screen w-screen">
        <span className="loading loading-ring loading-lg m-auto"></span>
      </div>
    );
  }

  // Handling no images found
  if (images.length === 0) {
    return (
      <div className='h-screen w-screen flex flex-col justify-center align-middle'>
        <MemeFilter
          visible={showFilter && !showFab}
          className="fixed"
        />
        <h1 className="text-5xl font-bold text-center mb-8">{title}</h1>
        <div className="text-center">No memes found.</div>
      </div>
    );
  }

  return (
    <>
      <MemeFilter
        visible={showFilter && !showFab}
        className="fixed"
      />
      <div ref={contentRef} className="h-screen w-full flex flex-col snap-mandatory snap-y px-4 md:px-8 overflow-auto">
        <h1 className={`container mx-auto text-5xl font-bold text-center -mb-64 lg:-mb-48 pt-28 px-6 md:px-12 z-20 snap-start`}>{title}</h1>
        {images.map((meme, index) => (
          <div key={index} className={`snap-start meme-card ${index === 0 ? 'mt-24' : ''}`}>
            <MemeCard meme={meme} handleUpvote={handleUpvote}/>
          </div>
        ))}
        <div className="flex justify-center align-middle h-screen w-screen">
          <span className="loading loading-ring loading-lg mx-auto my-24"></span>
        </div>
      </div>
      {showFab && (
        <button
          className="btn btn-outline btn-secondary fixed bottom-8 right-8 p-3 shadow-2xl"
          onClick={scrollToTop}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </>
  );
};

export default MemeGallery;
