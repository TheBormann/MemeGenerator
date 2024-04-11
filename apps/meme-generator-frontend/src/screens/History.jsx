import React, { useEffect, useRef } from "react";
import MemeCard from "../components/explore/MemeCard";
import BaseLayout from "../components/layout/BaseLayout";
import useMeme from '../components/single-view/useMeme.jsx';
import Footer from "../components/base/Footer.jsx";

const History = () => {
  const { loading, images, fetchNextPage, handleUpvote, error } = useMeme();
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
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener("scroll", handleScroll);
      return () => content.removeEventListener("scroll", handleScroll);
    }
  }, [fetchNextPage, loading]);

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
    </BaseLayout>
  );
};

export default History;
