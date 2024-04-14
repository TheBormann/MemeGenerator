import React, { useEffect, useState, useRef } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import MemeGallery from "../components/explore/MemeGallery.jsx";

import useMeme from '../components/single-view/useMeme.jsx';
import useTextToSpeech from "../components/editor/useTextToSpeech";

const Home = () => {
  const { loading, images, fetchNextPage, handleUpvote, error } = useMeme();

  const [sortedBy, setSortedBy] = useState("creationDateDesc");
  const [filter, setFilter] = useState({
    creationDateBefore: "",
    creationDateAfter: "",
    votes: 0,
    keyword: "",
  });
  //TODO: fetch data with initial sorting and filter

  const onSortChange = (value) => {
    setSortedBy(value);
    //TODO: fetch data with new sorting
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

  return (
    <BaseLayout showFooter={false} className='p-0'>
      <MemeGallery images={images} showFilter={true} loading={loading} error={error} handleUpvote={handleUpvote}  />
    </BaseLayout>
  );
};

export default Home;
