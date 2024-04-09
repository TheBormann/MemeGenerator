import React, { useState, useEffect, useRef } from "react";
import MemeCard from "../components/explore/MemeCard";
import BaseLayout from "../components/layout/BaseLayout";
import ApiController from "../data/ApiController";

const History = () => {
  const [userMemes, setUserMemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 10;

  const contentRef = useRef(null);

  const fetchUserMemes = async () => {
    setLoading(true);
    try {
      const data = await ApiController.fetchUserMemes(page, limit);
      setUserMemes((prevUserMemes) => [...prevUserMemes, ...data.results]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error("Error fetching user memes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const content = contentRef.current;
    const isBottom = content.scrollHeight - content.scrollTop === content.clientHeight;
    if (isBottom) fetchUserMemes();
    setIsScrolled(window.scrollY || window.pageYOffSet > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchUserMemes();
  }, []);

  return (
    <BaseLayout showFooter={false}>
      <div className={`h-fit w-full transition-transform ease-in-out duration-300 ${isScrolled ? 'translate-y-[-100vh]' : ''}`}>
        <h1 className="text-5xl font-bold">My History</h1>
        <p className="py-6 text-xl">Here you can see what memes you created and how you interacted with other memes</p>
      </div>
      <div className={`justify-left grid min-h-screen w-full px-6 align-top md:justify-center md:px-12 overflow-x-hidden ${isScrolled ? 'overflow-scroll' : 'overflow-hidden'} snap-mandatory snap-y h-[85vh] pt-32 transition-all ease-in-out duration-300 ${isScrolled ? 'mt-0' : 'mt-32'}`}>
        <div ref={contentRef} className="gap-4">
          <div className="p-5 flex flex-col lg:mx-32">
            {userMemes.length > 0 ? (
              userMemes.map((meme, index) => (
                <div key={index} className="flex-none w-full snap-start">
                  <MemeCard meme={meme} />
                </div>
              ))
            ) : (
              <div>No memes</div>
            )}
            {loading && (
              <span className="loading loading-spinner loading-lg mx-auto"></span>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default History;