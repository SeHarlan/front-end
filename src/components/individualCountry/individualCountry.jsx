import React, { useEffect } from 'react';
import { Grid, Typography, FormControl, Input, InputLabel, Select, MenuItem, CircularProgress } from '@material-ui/core';
import { useStyles } from './IndividualCountry.styles';
// import Map from '../Map/Map';
import { getGlobalMapMobilityByDate, getSelectedCountryCode, getMobilitySubregionNames, getSelectedSubregion, getCovidSubData, getMobilitySubData, getSelectedCountryName, getUSMobilityMap } from '../../selectors/selectors';
import { useParams, Link } from 'react-router-dom';
import StackGraph from '../StackGraph/StackGraph';
import { getCovidChartData } from '../../selectors/selectors';
import { useSelector, useDispatch } from 'react-redux';
import MiniChartsContainer from '../MiniChart/MiniChartsContainer';
import { setSelectedSubregion, setMobilitySubregionNames, setCovidSubData, setMobilitySubData, resetCovidSubData, setSelectedCountryCode, setSelectedCountryName, resetMobilitySubData } from '../../actions/actions';
import USMap from '../Map/USMap';

export const IndividualCountry = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { countryCode: countryCodeParam } = useParams();
  const countryCode = useSelector(getSelectedCountryCode);
  const countryName = useSelector(getSelectedCountryName);
  const subregion = useSelector(getSelectedSubregion);
  const subRegionNames = useSelector(getMobilitySubregionNames);
  const chartDataSet = useSelector(getCovidChartData);
  const stackGraphSubData = useSelector(getCovidSubData);
  const USMobilityMap = useSelector(getUSMobilityMap); 



  
  useEffect(() => {
    if(!countryCode.length) dispatch(setSelectedCountryCode(countryCodeParam));
  }, []);
  
  useEffect(() => {
    if(countryCode === '') return;
    if(countryName === 'Worldwide' || chartDataSet.countryName !== 'Worldwide') {
      dispatch(setSelectedCountryName(chartDataSet.countryName));
    }  
    dispatch(setMobilitySubregionNames(countryCode));
  }, [countryCode, chartDataSet]);

  useEffect(() => {
    if(subregion === '') {
      dispatch(resetCovidSubData());
      dispatch(resetMobilitySubData());
      return;
    }
    dispatch(setCovidSubData(countryCode, subregion));
    dispatch(setMobilitySubData(countryCode, subregion));

  }, [subregion]);

  const selectOptions = subRegionNames
    ?.sort()
    .map((item) => (<MenuItem  key={item} value={item}>{item}</MenuItem>));

  return (
    <Grid container justify="center" className={classes.root}>
     
      <Grid item xs={12} md={10}>
        <Typography variant="h3" color="primary" className={classes.title}>COVID Statistics for {countryName}</Typography>
        
      </Grid>
      <Grid item xs={12} md={10}>

        { !selectOptions.length 
          ? <Typography variant="body1">No Subregions Found</Typography>
          : <FormControl variant="outlined" size="small" className={classes.formControl}>
            <InputLabel id="subregion-select-label">Subregion</InputLabel>
            <Select
              label="Subregion"
              labelId="subregion-select-label"
              id="subregion-select"
              value={subregion}
              onChange={({ target }) => dispatch(setSelectedSubregion(target.value))}
            >
              <MenuItem value="" key="default">Choose a Subregion</MenuItem>
              {selectOptions}
            </Select>
          </FormControl>}
      </Grid>
      
      <Grid item xs={12} md={10} className={classes.graph}>
        {stackGraphSubData.date 
          ? <StackGraph data={stackGraphSubData} />
          : (subregion 
            ? <Typography variant="h4" color="secondary">No COVID data available for {subregion}.</Typography>
            : <StackGraph data={chartDataSet} />)
        }
      </Grid>

      <Grid item xs={12} sm={10}>
        <Typography variant="h3" color="primary" className={classes.title} style={{ marginBottom: '1rem' }}>Mobility Statistics</Typography>
      </Grid>
      {countryCode === 'US' && 
        <Grid item xs={12} md={10}>
          <USMap mapData={USMobilityMap} selectedSubregion={subregion}/>
        </Grid>
      }
      <Grid item xs={12} className={`${classes.graph} ${classes.backdrop}`}>
        <Link to={`/compare/${countryCode}`}><Typography variant="p" color="secondary" align="right" style={{ marginTop: '.5rem', display: 'inline-block', float: 'right' }}>Compare to another country</Typography></Link>
        <MiniChartsContainer />
      </Grid>

    </Grid>
  );
};

export default IndividualCountry;
