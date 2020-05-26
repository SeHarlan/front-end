import React, { useState } from 'react';

import { Grid, Link } from '@material-ui/core';

import { useStyles } from './Links.styles';
import { setSelectedCountryCode } from '../../actions/actions';
import { getGlobalMapMobilityByDate, getSelectedCountryCode } from '../../selectors/selectors';
import { useDispatch, useSelector } from 'react-redux';

export const Links = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [searchedCountry, setSearchedCountry] = useState('');
  const selectedCountryCode = useSelector(getSelectedCountryCode);
  const globalMapMobilityData = useSelector(getGlobalMapMobilityByDate);
  
  const selectOptions = () => globalMapMobilityData.features.map((item, i) => <option key={i} value={item.mobilityData.countryCode}>{item.mobilityData.countryName}</option>);

  // const handleChange = ({ target }) => {
  //   setSearchedCountry(target.value);
  // };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   dispatch(setSelectedCountryCode(searchedCountry));
  //   setCovidChartData(fetchCountryNameCovidData(searchedCountry));
  // };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.links}>
        {/* <form name="country" onSubmit={handleSubmit}> */}
        {/* <input type="text" value={searchedCountry} onChange={handleChange} className={classes.search} placeholder="Search for country"/> */}
        { console.log({ globalMapMobilityData })}
        { globalMapMobilityData.features &&
        <select value={selectedCountryCode} onChange={({ target }) => dispatch(setSelectedCountryCode(target.value))}>
          {/* Or do this */}
          {/* {globalMapMobilityData.features.map((item, i) => (
            <option key={i} value={item.mobilityData.countryCode}>
              {item.mobilityData.countryName}
            </option>
          ))} */}
          {selectOptions()}
        </select>
        }

        {/* </form>       */}
        <Link className={classes.link} href="/highscore">High Score</Link>
        <Link className={classes.link} href="/">Home</Link>
        <Link className={classes.link} href="/country">Individual Country</Link>
      </Grid>
    </Grid>
  );
};
