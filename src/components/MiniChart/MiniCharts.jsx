import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedCountryCode, getMobilityChartData } from '../../selectors/selectors';
import { setMobilityChartDataByCountryCode } from '../../actions/actions';
import { MiniChart } from './MiniChart';
import { useStyles } from './MiniCharts.styles';


export const MiniCharts = () => {

  const selectedCountryCode = 'US'; // Placeholder for now
  const mobilityData = useSelector(getMobilityChartData);
  const dispatch = useDispatch();
  const styles = useStyles();


  useEffect(() => {
    dispatch(setMobilityChartDataByCountryCode(selectedCountryCode));
  }, [selectedCountryCode]);


  return (
    <>
      {console.log('in MiniCharts, mobilityData is', mobilityData)}
      <Grid container spacing={3} className={styles.root}>
        {/* Placeholders; Individualized charts incoming! */}
        <Grid item xs={6} sm={4}>
          <MiniChart dataSet={mobilityData} />
        </Grid>
        <Grid item xs={6} sm={4}>
          <MiniChart dataSet={mobilityData} />
        </Grid>
        <Grid item xs={6} sm={4}>
          <MiniChart dataSet={mobilityData} />
        </Grid>
        <Grid item xs={6} sm={4}>
          <MiniChart dataSet={mobilityData} />
        </Grid>
        <Grid item xs={6} sm={4}>
          <MiniChart dataSet={mobilityData} />
        </Grid>
        <Grid item xs={6} sm={4}>
          <MiniChart dataSet={mobilityData} />
        </Grid>
      </Grid>
    </>
  );
};

export default MiniCharts;
