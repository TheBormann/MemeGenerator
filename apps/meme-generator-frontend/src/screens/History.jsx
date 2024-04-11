import React, { useEffect, useRef, useState } from "react";
import MemeCard from "../components/explore/MemeCard";
import BaseLayout from "../components/layout/BaseLayout";
import useMeme from '../components/single-view/useMeme.jsx';
import Footer from "../components/base/Footer.jsx";

const History = () => {
  const { loading, images, fetchNextPage, handleUpvote, error } = useMeme();
  const [showFab, setShowFab] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const content = contentRef.current;
      if (content) {
        // Check if the user has scrolled to the bottom of the content
        const isBottom = content.scrollHeight - content.scrollTop <= content.clientHeight;
        if (isBottom && !loading) {
          fetchNextPage();
        }

        if (content.scrollTop > 200) {
          setShowFab(true);
        } else {
          setShowFab(false);
        }
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener("scroll", handleScroll);
      return () => content.removeEventListener("scroll", handleScroll);
    }
  }, [fetchNextPage, loading]);

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <BaseLayout showFooter={false} className="pt-0">
      <div ref={contentRef} className="h-screen w-full flex flex-col snap-mandatory snap-y px-4 md:px-8 overflow-auto">
        {images.length > 0 ? (
          images.map((meme, index) => (
            <div key={index} className="snap-start meme-card">
              <MemeCard meme={meme} handleUpvote={handleUpvote} className={index === 0 ? `mt-24` : ''}/>
            </div>
          ))
        ) : (
          !loading && <div className="text-center">No memes found.</div>
        )}
        {loading && (
          <div className="flex justify-center">
            <span className="spinner"></span> {/* Ensure you have a spinner styled or use DaisyUI's spinner */}
          </div>
        )}
        {error && <div className="text-red-500 text-center">Failed to load memes: {error}</div>}
      </div>
      {showFab && (
        <button
          className="btn btn-outline btn-secondary fixed bottom-8 right-8 p-3  shadow-2xl"
          onClick={scrollToTop}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </BaseLayout>
  );
};

export default History;
