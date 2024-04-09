import React, { useEffect, useState, useRef } from 'react';
import ApiController from '../data/ApiController';
import BaseLayout from '../components/layout/BaseLayout';
import MemeCard from "../components/explore/MemeCard";
import useTextToSpeech from "../components/editor/useTextToSpeech";
import MemeFilter from "../components/explore/MemeFilter";

const Home = () => {
  const [memes, setMemes] = useState([]);
  let page = 0;
  const [loading, setLoading] = useState(false);
  const [showFab, setShowFab] = useState(false);

  const [jsonData, setJsonData] = useState(null);
  useTextToSpeech(jsonData);

  const contentRef = useRef(null);
  const observer = useRef(null);

  const [sortedBy, setSortedBy] = useState("creationDateDesc");
  const [filter, setFilter] = useState({
    creationDateBefore: "",
    creationDateAfter: "",
    votes: 0,
    keyword: "",
  });

  const fetchData = async (filter, sortedBy) => {
    setLoading(true);
    try {
      const data = await ApiController.fetchAllMemes(
        page,
        10,
        filter,
        sortedBy
      );

      const newMemes = data.results;
      setMemes((prevMemes) => [...prevMemes, ...newMemes]);

      if (newMemes.length > 0) {
        if (data.next && typeof data.next.page !== "undefined") {
          page = data.next.page;
        } else {
          page++;
        }
      }
    } catch (error) {
      console.error("Error fetching meme list:", error);
    }
    setLoading(false);
  };

  const handleScroll = () => {
    const content = contentRef.current;

    const bottom =
      content.scrollHeight - content.scrollTop === content.clientHeight;
    if (bottom) {
      fetchData(filter, sortedBy); // Updated to include filter and sortedBy as parameters
    }

    if (content.scrollTop > 200) {
      setShowFab(true);
    } else {
      setShowFab(false);
    }
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const content = contentRef.current;
    content.addEventListener("scroll", handleScroll);
    return () => content.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchData(filter, sortedBy);
  }, []);

  useEffect(() => {
    const memeElements = document.querySelectorAll(".meme-card");

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const title = entry.target.querySelector("h2").innerHTML;
            const caption = entry.target.querySelector("p").innerHTML;
            const author = entry.target.querySelector("span").innerHTML;

            setJsonData({ title: title, caption: caption, author: author });
          }
        });
      },
      { threshold: 0.5 }
    );

    memeElements.forEach((elem) => observer.current.observe(elem));

    return () => {
      observer.current.disconnect();
    };
  }, [memes]);

  const onSortChange = (value) => {
    setSortedBy(value);
    setMemes([]);
    fetchData(filter, value);
  };

  const onFilterChange = (name, value) => {
    let newFilter;
    switch (name) {
      case "creationDateAfter":
        newFilter = { ...filter, creationDateAfter: value };
        setFilter(newFilter);
        break;
      case "creationDateBefore":
        newFilter = { ...filter, creationDateBefore: value };
        setFilter(newFilter);
        break;
      case "votes":
        newFilter = { ...filter, votes: value };
        setFilter(newFilter);
        break;
      case "keyword":
        newFilter = { ...filter, keyword: value };
        setFilter(newFilter);
        break;

      default:
        break;
    }
    setMemes([]);

    fetchData(newFilter, sortedBy);
  };

  return (
    <BaseLayout showFooter={false} className='p-0'>
      <MemeFilter
        onSortChange={onSortChange}
        onFilterChange={onFilterChange}
      ></MemeFilter>
      <div
        ref={contentRef}
        className="gap-4  overflow-x-hidden overflow-scroll snap-mandatory snap-y h-[85vh]"
      >
        <div className="p-5 flex flex-col lg:mx-32">
          {memes.length > 0 ? (
            memes.map((meme, index) => (
              <div
                key={index}
                className="flex-none w-full snap-start meme-card"
                data-id={meme.id}
              >
                <MemeCard meme={meme} />
              </div>
            ))
          ) : !loading && (
            <div className="text-center py-10">No memes</div>
          )}
          {loading && (
            <span className="loading loading-spinner loading-lg mx-auto"></span>
          )}
        </div>
      </div>
      {showFab && (
        <button
          className="btn btn-outline btn-accent fixed bottom-8 right-8 p-3  shadow-2xl"
          onClick={scrollToTop}
        >
          Go To Top
        </button>
      )}
    </BaseLayout>
  );
};

export default Home;
