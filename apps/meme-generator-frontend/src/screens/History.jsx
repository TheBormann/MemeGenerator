import React, { useEffect, useRef, useState, useMemo } from "react";
import BaseLayout from "../components/layout/BaseLayout";
import MemeGallery from "../components/explore/MemeGallery.jsx";
import SessionManager from "../data/SessionManager.js";
import { useMemeContext } from "../contexts/memeContext.jsx";

const History = () => {
  const { images, loading, error, fetchMemes, handleUpvote } = useMemeContext();

  const filter = useMemo(() => ({
    author: SessionManager.getUserName(),
  }), [SessionManager.getUserName()]);

  useEffect(() => {
    fetchMemes({filters: filter});
  }, [filter]);

  const onFetchMemes = () => {
    fetchMemes({filters: filter, append: true});
  }

  return (
    <BaseLayout showFooter={false} className="pt-0">
        <MemeGallery images={images} title="History" showFilter={false} loading={loading} fetchMemes={onFetchMemes}  error={error} handleUpvote={handleUpvote}  />
    </BaseLayout>
  );
};

export default History;
