import React, { useEffect } from 'react';
import { Grid, Typography, FormControl, Input, InputLabel, Select, MenuItem, CircularProgress } from '@material-ui/core';
import { useStyles } from './individualCountry.styles';
// import Map from '../Map/Map';
import { getGlobalMapMobilityByDate, getSelectedCountryCode, getMobilitySubregionNames, getSelectedSubregion, getCovidSubData, getMobilitySubData, getSelectedCountryName } from '../../selectors/selectors';
import { useParams } from 'react-router-dom';
import StackGraph from '../StackGraph/StackGraph';
import { getCovidChartData } from '../../selectors/selectors';
import { useSelector, useDispatch } from 'react-redux';
import MiniChartsContainer from '../MiniChart/MiniChartsContainer';
import { setSelectedSubregion, setMobilitySubregionNames, setCovidSubData, setMobilitySubData, resetCovidSubData, setSelectedCountryCode, setSelectedCountry, setSelectedCountryName } from '../../actions/actions';

export const individualCountry = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // const globalMapMobilityData = useSelector(getGlobalMapMobilityByDate);
  const { countryCode: countryCodeParam } = useParams();
  const countryCode = useSelector(getSelectedCountryCode);
  const countryName = useSelector(getSelectedCountryName);
  const subregion = useSelector(getSelectedSubregion);
  const subRegionNames = useSelector(getMobilitySubregionNames);
  const chartDataSet = useSelector(getCovidChartData);
  const stackGraphSubData = useSelector(getCovidSubData);


  
  useEffect(() => {
    if(!countryCode.length) dispatch(setSelectedCountryCode(countryCodeParam));
  }, []);

  
  useEffect(() => {
    if(countryCode === '') return;
    console.log(chartDataSet);
    if(countryName === 'Worldwide' || chartDataSet.countryName !== 'Worldwide') {
      dispatch(setSelectedCountryName(chartDataSet.countryName));
    }  
    dispatch(setMobilitySubregionNames(countryCode));
  }, [countryCode, chartDataSet]);

  useEffect(() => {
    if(subregion === '') return dispatch(resetCovidSubData());
    dispatch(setCovidSubData(countryCode, subregion));
    dispatch(setMobilitySubData(countryCode, subregion));
  }, [subregion]);

  const selectOptions = subRegionNames
    ?.sort()
    .map((item) => (<MenuItem  key={item} value={item}>{item}</MenuItem>));

  const stackGraphDataSet = stackGraphSubData.date ? stackGraphSubData : chartDataSet;

  return (
    <Grid container justify="center" className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h3" className={classes.title}>{countryName}</Typography>
        {subregion && <Typography variant="h4" className={classes.title}>{subregion}</Typography>}
        
        {/* <Map mapData={globalMapMobilityData} countryCode={countryCodeParam || countryCode}/> */}
      </Grid>

      <Grid item xs={12}>
        { !selectOptions.length 
          ? <Typography variant="body1">No Subregions Found</Typography>
          : <FormControl variant="filled" className={classes.formControl}>
            <InputLabel id="subregion-select-label">Subregion</InputLabel>
            <Select
              labelId="subregion-select-label"
              id="subregion-select"
              value={subregion}
              onChange={({ target }) => dispatch(setSelectedSubregion(target.value))}
            >
              <MenuItem value="">Choose a Subregion</MenuItem>
              {selectOptions}
            </Select>
          </FormControl>}
      </Grid>
      
      <Grid item xs={12} lg={10} className={classes.graph}>

        { stackGraphDataSet && <StackGraph data={stackGraphDataSet} />}

      </Grid>

      <Grid item xs={12} lg={10} className={classes.graph}>
        <MiniChartsContainer />
      </Grid>

    </Grid>
  );
};
