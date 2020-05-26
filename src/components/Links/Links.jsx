import React from 'react';

import { Grid, Link } from '@material-ui/core';

import { useStyles } from './Links.styles';
import { setSelectedCountryCode } from '../../actions/actions';
import { getGlobalMapMobilityByDate, getSelectedCountryCode } from '../../selectors/selectors';
import { useDispatch, useSelector } from 'react-redux';

export const Links = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedCountryCode = useSelector(getSelectedCountryCode);
  const globalMapMobilityData = useSelector(getGlobalMapMobilityByDate);
  
  const selectOptions = () => globalMapMobilityData.features
    .filter(item => item.mobilityData.countryName != null)
    .sort((a, b) => (a.mobilityData.countryName > b.mobilityData.countryName) ? 1 : -1)
    .map((item, i) => <option key={i} value={item.mobilityData.countryCode}>{item.mobilityData.countryName}</option>);

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.links}>
        { globalMapMobilityData.features &&
        <select value={selectedCountryCode} onChange={({ target }) => dispatch(setSelectedCountryCode(target.value))}>
          <option>Choose a country</option>
          {selectOptions()}
        </select>
        }
        <Link className={classes.link} href="/highscore">High Score</Link>
        <Link className={classes.link} href="/">Home</Link>
        <Link className={classes.link} href="/country">Individual Country</Link>
      </Grid>
    </Grid>
  );
};
