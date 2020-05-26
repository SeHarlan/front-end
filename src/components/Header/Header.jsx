import React from 'react';

import { Grid, Typography } from '@material-ui/core';

import { useStyles } from './Header.styles';
// import logo from '';
import { Links } from '../Links/Links';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedCountryCode, getGlobalMapMobilityByDate } from '../../selectors/selectors';
import { setSelectedCountryCode } from '../../actions/actions';

export const Header = () => {
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
      {/* <img alt="logo" src={logo} className={classes.image}/> */}
      <Grid item xs={4} >
        <Typography variant="h3">Pandemic Legacy</Typography>
        <Typography variant="h4">Quarantine Mobility Metrics</Typography>
      </Grid>

      <Grid item xs={4}>
        <Links />
      </Grid>

      <Grid item xs={4}>
        { globalMapMobilityData.features &&
        <select value={selectedCountryCode} onChange={({ target }) => dispatch(setSelectedCountryCode(target.value))}>
          <option>Choose a country</option>
          {selectOptions()}
        </select>
        }

      </Grid>

    </Grid>
  );
};
