import React from 'react';
import Map from '../../HOC/MapHOC';
import LineGraph from '../LineGraph/LineGraph';
import { useWorldMobilityData } from '../../hooks/mobilityHooks';

const Home = () => {
  const worldMobilityData = useWorldMobilityData('2020-04-01T00:00:00.000+00:00');
  return (
    <>
      <Map mapData={worldMobilityData} />
      <LineGraph />
    </>
  );
};

export default Home;
