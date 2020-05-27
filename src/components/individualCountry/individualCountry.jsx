import React, { useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useStyles } from './individualCountry.styles';
// import Map from '../Map/Map';
import { getGlobalMapMobilityByDate, getSelectedCountryCode, getMobilitySubregionNames, getSelectedSubregion } from '../../selectors/selectors';
import { useParams } from 'react-router-dom';
import StackGraph from '../StackGraph/StackGraph';
import { getCovidChartData } from '../../selectors/selectors';
import { useSelector, useDispatch } from 'react-redux';

import MiniChartsContainer from '../MiniChart/MiniChartsContainer';
import { setSelectedSubregion, setMobilitySubregionNames } from '../../actions/actions';


export const individualCountry = () => {
  const classes = useStyles();
  // const globalMapMobilityData = useSelector(getGlobalMapMobilityByDate);
  const { countryCode: countryCodeParam } = useParams();
  const countryCode = useSelector(getSelectedCountryCode) || countryCodeParam;
  const subregion = useSelector(getSelectedSubregion);
  const subRegionNames = useSelector(getMobilitySubregionNames);
  const chartDataSet = useSelector(getCovidChartData);
  const dispatch = useDispatch();

  console.log(subRegionNames);

  useEffect(() => {
    if(countryCode === '') return;
    dispatch(setMobilitySubregionNames(countryCode));
  }, [countryCode]);

  const selectOptions = subRegionNames
    ?.filter(item => item != null)
    .sort((a, b) => (a > b) ? 1 : -1)
    .map((item, i) => <option key={i} value={item}>{item}</option>);

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.header}>
        <Typography variant="h3" className={classes.title}>{countryCode}</Typography>
        {/* <Map mapData={globalMapMobilityData} countryCode={countryCodeParam || countryCode}/> */}
      </Grid>

      <Grid item xs={12}>
        { subRegionNames &&
          <select value={subregion} onChange={({ target }) => dispatch(setSelectedSubregion(target.value))}>
            <option>Choose a subregion</option>
            {selectOptions}
          </select>}
      </Grid>
      
      <Grid item xs={12} className={classes.graph}>
        <StackGraph dataSet={chartDataSet} />
      </Grid>

      <Grid item xs={12} lg={10} className={classes.graph}>
        { chartDataSet.date && <StackGraph data={chartDataSet} /> }
      </Grid>

      <Grid item xs={12} lg={6} className={classes.graph}>
        <MiniChartsContainer />
      </Grid>

      {/* <Grid item xs={12} className={classes.metrics}>
          <Typography variant="h3" className={classes.title}>Metrics</Typography>
        </Grid> */}

    </Grid>
  );
};

