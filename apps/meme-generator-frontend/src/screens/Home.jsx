import React, { useEffect, useState, useRef } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import MemeGallery from "../components/explore/MemeGallery.jsx";
import  { useMemeContext } from "../contexts/memeContext.jsx";

const Home = () => {
  const { images, loading, error, fetchMemes, handleUpvote } = useMemeContext();

  const [sortedBy, setSortedBy] = useState("creationDateDesc");
  const [filter, setFilter] = useState({
    creationDateBefore: "",
    creationDateAfter: "",
    votes: 0,
    keyword: "",
  });

  const onSortChange = (value) => {
    setSortedBy(value);
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
    //TODO: fetch data with new filter
  };

  useEffect(() => {
    fetchMemes({ filters: filter, sorting: sortedBy});
  }, [filter, sortedBy]);

  const onFetchMemes = () => {
    console.log("fetching memes")
    fetchMemes({ filters: filter, sorting: sortedBy, append: true});
  }

  return (
    <BaseLayout showFooter={false} className='p-0'>
        <MemeGallery images={images} showFilter={true} loading={loading} error={error} fetchMemes={onFetchMemes} handleUpvote={handleUpvote} onFilterChange={onFilterChange} onSortChange={onSortChange} />
    </BaseLayout>
  );
};

export default Home;
