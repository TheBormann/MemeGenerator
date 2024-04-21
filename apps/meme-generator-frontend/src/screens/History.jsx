import React, { useEffect, useMemo } from "react";
import BaseLayout from "../components/layout/BaseLayout";
import MemeGallery from "../components/explore/MemeGallery.jsx";
import SessionManager from "../data/SessionManager.js";
import { useMemeContext } from "../contexts/memeContext.jsx";

const History = () => {
  const { fetchMemes } = useMemeContext();

  const filter = useMemo(() => ({
    author: SessionManager.getUserName(),
  }), [SessionManager.getUserName()]);

  useEffect(() => {
    fetchMemes({filters: filter});
  }, [filter]);

  return (
    <BaseLayout showFooter={false} className="pt-0">
        <MemeGallery title="History" showFilter={false} />
    </BaseLayout>
  );
};

export default History;
