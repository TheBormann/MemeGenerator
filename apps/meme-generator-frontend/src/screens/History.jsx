import React, { useEffect, useRef, useState } from "react";
import BaseLayout from "../components/layout/BaseLayout";
import useMeme from '../components/single-view/useMeme.jsx';
import MemeGallery from "../components/explore/MemeGallery.jsx";

const History = () => {
  const { loading, images, fetchNextPage, handleUpvote, error } = useMeme();

  return (
    <BaseLayout showFooter={false} className="pt-0">
      <MemeGallery images={images} title="History" showFilter={false} loading={loading} error={error} handleUpvote={handleUpvote}  />
    </BaseLayout>
  );
};

export default History;
