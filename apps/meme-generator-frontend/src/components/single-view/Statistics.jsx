// Statistics.js
import React from 'react';
import { XYPlot, VerticalBarSeries, XAxis, YAxis, HorizontalGridLines, VerticalGridLines } from 'react-vis';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Statistics = ({ commentsLength, likes, loading }) => {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold">Statistics</h2>
            {loading ? <Skeleton className="my-8" height={20}/> :
                <XYPlot
                    xType="ordinal"
                    width={400}
                    height={200}
                    xDistance={50}
                    className="my-8"
                >
                    <VerticalGridLines/>
                    <HorizontalGridLines/>
                    <XAxis style={{line: {stroke: '#777'}}}/>
                    <YAxis style={{line: {stroke: '#777'}}} tickFormat={v => Math.floor(v)} tickValues={[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]}/>
                    <VerticalBarSeries
                        data={[{x: 'Comments', y: commentsLength}, {x: 'Likes', y: likes}]} barWidth={0.3} />
                </XYPlot>
            }
        </div>
    );
};

export default Statistics;
