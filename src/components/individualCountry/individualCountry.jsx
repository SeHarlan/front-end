import React, { useEffect } from 'react';
import { Grid, Typography, FormControl, Input, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useStyles } from './individualCountry.styles';
// import Map from '../Map/Map';
import { getSelectedCountryCode, getMobilitySubregionNames, getSelectedSubregion } from '../../selectors/selectors';
import { useParams } from 'react-router-dom';
import StackGraph from '../StackGraph/StackGraph';
import { getCovidChartData } from '../../selectors/selectors';
import { useSelector, useDispatch } from 'react-redux';

import MiniChartsContainer from '../MiniChart/MiniChartsContainer';
import { setSelectedSubregion, setMobilitySubregionNames } from '../../actions/actions';


export const individualCountry = () => {
  const classes = useStyles();

  const { countryCode: countryCodeParam } = useParams();
  const countryCode = useSelector(getSelectedCountryCode) || countryCodeParam;
  const subregion = useSelector(getSelectedSubregion);
  const subRegionNames = useSelector(getMobilitySubregionNames);
  const chartDataSet = useSelector(getCovidChartData);
  const dispatch = useDispatch();

  useEffect(() => {
    if(countryCode === '') return;
    dispatch(setMobilitySubregionNames(countryCode));
  }, [countryCode]);

  const selectOptions = subRegionNames
    ?.sort()
    .map((item) => (<MenuItem  key={item} value={item}>{item}</MenuItem>));

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.header}>
        <Typography variant="h3" className={classes.title}>{countryCode}</Typography>
        {/* <Map mapData={globalMapMobilityData} countryCode={countryCodeParam || countryCode}/> */}
      </Grid>

      <Grid item xs={12}>
        { selectOptions.length &&
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="subregion-select-label">Subregion</InputLabel>
        <Select
          labelId="subregion-select-label"
          id="subregion-select"
          value={subregion}
          nChange={({ target }) => dispatch(setSelectedSubregion(target.value))}
        >
          <MenuItem value="">Choose a Subregion</MenuItem>
          {selectOptions}
        </Select>
      </FormControl>}
      </Grid>
      

      <Grid item xs={12} lg={10} className={classes.graph}>
        { chartDataSet.date && <StackGraph data={chartDataSet} /> }
      </Grid>

      <Grid item xs={12} lg={6} className={classes.graph}>
        <MiniChartsContainer />
      </Grid>

    </Grid>
  );
};

