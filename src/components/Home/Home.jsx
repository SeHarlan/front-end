import React, { useState, useEffect } from 'react';
import Map from '../Map/Map';
import LineGraph from '../LineGraph/LineGraph';
// import { useWorldMobilityData } from '../../hooks/mobilityHooks';
import { useDispatch, useSelector } from 'react-redux';
import { getGlobalMapMobilityByDate } from '../../selectors/selectors';

import { getCovidChartData, getSelectedCountryCode } from '../../selectors/selectors';
import { setCovidChartData } from '../../actions/actions';
import { Grid } from '@material-ui/core';



export const Home = () => {
  
  const dispatch = useDispatch();
  const globalMapMobilityData = useSelector(getGlobalMapMobilityByDate);
  const countryCode = useSelector(getSelectedCountryCode);
  const chartDataSet = useSelector(getCovidChartData);

  useEffect(() => {
    dispatch(setCovidChartData(countryCode));
  }, [countryCode]);

  return (
    <Grid container alignItems="center">
      <Grid item xs={12}>
        <Map mapData={globalMapMobilityData} />
      </Grid>
      <Grid item sm={1}></Grid>
      <Grid item xs={12} sm={10}>
        <LineGraph dataset={chartDataSet} />
      </Grid>
      <Grid item sm={1}></Grid>
    </Grid>
  );
};

export default Home;
