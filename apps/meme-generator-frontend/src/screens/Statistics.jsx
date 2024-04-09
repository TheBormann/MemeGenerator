import React, { useEffect, useState } from 'react';
import ApiController from '../data/ApiController';
import BaseLayout from '../components/layout/BaseLayout';
import { XYPlot, VerticalBarSeries, XAxis, YAxis, HorizontalGridLines, VerticalGridLines } from 'react-vis';
import Skeleton from 'react-loading-skeleton';

const Statistics = () => {
  const [uploadData, setUploadData] = useState(null);
  const [maxYValue, setMaxYValue] = useState(0); // State to hold the maximum y value
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await ApiController.fetchAllMemes();
        const memes = response.results;

        if (memes.length === 0) {
          setUploadData([]);
        } else {
          const uploadCounts = memes.reduce((acc, meme) => {
            const date = new Date(meme.createdAt);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const key = `${year}-${month}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});

          const sortedUploadData = Object.entries(uploadCounts)
              .map(([key, value]) => ({ x: key, y: value }))
              .sort((a, b) => {
                const [aYear, aMonth] = a.x.split('-');
                const [bYear, bMonth] = b.x.split('-');
                return new Date(`${aYear}-${aMonth}-01`) - new Date(`${bYear}-${bMonth}-01`);
              });

          setUploadData(sortedUploadData);

          // Calculate the maximum y value dynamically
          const max = Math.max(...Object.values(uploadCounts));
          setMaxYValue(max);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <BaseLayout>
    <div className="container mx-auto flex flex-col min-h-screen px-6 md:px-12">
      <div className="h-fit">
        <h1 className="text-5xl font-bold">Statistics</h1>
        <p className="py-6 text-xl">Get more insight into our platform</p>
      </div>
      <div className="mt-8 w-full">
        <h2 className="text-lg font-bold mb-4">Monthly Uploads</h2>
        {isLoading ? (
          <Skeleton height={400} width={800} />
        ) : uploadData && uploadData.length > 0 ? (
          <XYPlot
              xType="ordinal"
              width={800}
              height={400}
              xDistance={50}
              margin={{ bottom: 70, left: 70, right: 70, top: 50 }}
              style={{  }}
          >
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis style={{ line: { stroke: '#777' } }} />
            <YAxis style={{ line: { stroke: '#777' } }} tickFormat={v => Math.floor(v)} tickValues={[0, maxYValue / 2, maxYValue]} />
            <VerticalBarSeries data={uploadData} barWidth={0.3} />
          </XYPlot>
        ) : (
          <div>No data available.</div>
        )}
      </div>
    </div>
  </BaseLayout>
  );
};

export default Statistics;
