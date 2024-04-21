import React, { useEffect, useState, useRef } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import MemeGallery from "../components/explore/MemeGallery.jsx";
import  { useMemeContext } from "../contexts/memeContext.jsx";

const Home = () => {
  const { fetchMemes } = useMemeContext();

  useEffect(() => {
    fetchMemes({});
  }, []);

  return (
    <BaseLayout showFooter={false} className='p-0'>
        <MemeGallery showFilter={true} />
    </BaseLayout>
  );
};

export default Home;
