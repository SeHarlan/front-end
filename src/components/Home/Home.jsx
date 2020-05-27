import React, { useState, useEffect } from 'react';
import Map from '../Map/Map';
import LineGraph from '../LineGraph/LineGraph';
// import { useWorldMobilityData } from '../../hooks/mobilityHooks';
import { useDispatch, useSelector } from 'react-redux';
import { getGlobalMapMobilityByDate } from '../../selectors/selectors';

import { getCovidChartData, getSelectedCountryCode } from '../../selectors/selectors';
import { setCovidChartData, setSelectedCountryCode, setSelectedCountryName } from '../../actions/actions';
import { Grid, Typography } from '@material-ui/core';
import styles from './Home.css';



export const Home = () => {
  
  const dispatch = useDispatch();
  const globalMapMobilityData = useSelector(getGlobalMapMobilityByDate);
  const countryCode = useSelector(getSelectedCountryCode);
  const chartDataSet = useSelector(getCovidChartData);

  useEffect(() => {
    dispatch(setCovidChartData(countryCode));
  }, [countryCode]);
  useEffect(() => {
    dispatch(setSelectedCountryName('Worldwide'));
    dispatch(setSelectedCountryCode(''));
  }, []);

  return (
    <>
      <Grid container justify="center" className={styles.Home}>
        <Grid item xs={12}>
          {/* <Typography variant="h4" align="center">Change in Mobility</Typography> */}
          <Map mapData={globalMapMobilityData} />
        </Grid>
      </Grid>
      <Grid container justify="center" className={styles.fullWidthLightBlue}>
        <Grid item xs={12} sm={10}>
          <Typography variant="h4" align="center" className={styles.subhead}>COVID Statistics {countryCode ? `for ${countryCode}` : 'Worldwide' }</Typography>
          <LineGraph dataset={chartDataSet} />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
