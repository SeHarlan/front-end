import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedCountryCode, getGlobalMapMobilityByDate } from '../../selectors/selectors';
import { setSelectedCountryCode } from '../../actions/actions';
import { Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useStyles } from './Header.styles';
import { Links } from '../Links/Links';
import { Link } from 'react-router-dom';

export const Header = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const selectedCountryCode = useSelector(getSelectedCountryCode);
  const globalMapMobilityData = useSelector(getGlobalMapMobilityByDate);
  
  const selectOptions = globalMapMobilityData?.features
    ?.filter(item => item.mobilityData.countryName != null)
    .sort((a, b) => (a.mobilityData.countryName > b.mobilityData.countryName) ? 1 : -1)
    .map((item, i) => <MenuItem key={i} value={item.mobilityData.countryCode}>{item.mobilityData.countryName}</MenuItem>);

  return (
    <Grid container className={classes.root}>
      {/* <img alt="logo" src={logo} className={classes.image}/> */}

      <Grid item xs={12} sm={9}>
        <Link to='/'><Typography variant="h3">Going Viral</Typography></Link>
        <Typography variant="h4">Mobility in Times of Quarantine</Typography>
      </Grid>

      <Grid item xs={12} sm={3}>
        { globalMapMobilityData.features &&
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="country-select-label">Choose a Country</InputLabel>
          <Select
            labelId="country-select-label"
            id="country-select"
            value={selectedCountryCode}
            onChange={({ target }) => dispatch(setSelectedCountryCode(target.value))}
          >
            <MenuItem value=""><em>Choose a Country</em></MenuItem>
            {selectOptions}          
          </Select>
        </FormControl>
        }        
      </Grid>

    </Grid>
  );
};
