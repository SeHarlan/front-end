import React, { useState, useEffect } from 'react';
import Map from '../Map/Map';
import LineGraph from '../LineGraph/LineGraph';
// import { useWorldMobilityData } from '../../hooks/mobilityHooks';
import { useDispatch, useSelector } from 'react-redux';
import { getGlobalMapMobilityByDate } from '../../selectors/selectors';
import style from './Home.css';
import { getCovidChartData, getSelectedCountryCode } from '../../selectors/selectors';
import { setCovidChartData } from '../../actions/actions';



const Home = () => {
  
  const dispatch = useDispatch();
  const globalMapMobilityData = useSelector(getGlobalMapMobilityByDate);
  const countryCode = useSelector(getSelectedCountryCode);
  const chartDataSet = useSelector(getCovidChartData);

  useEffect(() => {
    dispatch(setCovidChartData(countryCode));
  }, [countryCode]);

  return (
    <section className={style.Home}>
      <Map mapData={globalMapMobilityData} />
      <LineGraph dataSet={chartDataSet} />
    </section>
  );
};

export default Home;
