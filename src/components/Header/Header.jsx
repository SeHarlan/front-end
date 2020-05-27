import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedCountryCode, getGlobalMapMobilityByDate } from '../../selectors/selectors';
import { setSelectedCountryCode } from '../../actions/actions';
import { Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import { useStyles } from './Header.styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    backgroundColor: theme.palette.common.dust.main, 
    width: 'calc(100% + 48px)',
    margin: '0 -24px',
    padding: '18px 24px',
  },
  h1Title: {
    color: theme.palette.common.charcoal.main,
    fontWeight: 'bold',
  },
  h1TitleLink: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  h3Subtitle: {
    color: theme.palette.common.charcoal.main, 
  },
}));

export const Header = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const selectedCountryCode = useSelector(getSelectedCountryCode);
  const globalMapMobilityData = useSelector(getGlobalMapMobilityByDate);
  // const theme = useTheme();
  
  const selectOptions = globalMapMobilityData?.features
    ?.filter(item => item.mobilityData.countryName != null)
    .sort((a, b) => (a.mobilityData.countryName > b.mobilityData.countryName) ? 1 : -1)
    .map((item, i) => <MenuItem key={i} value={item.mobilityData.countryCode}>{item.mobilityData.countryName}</MenuItem>);

  return (
    <Grid container alignItems='center' className={classes.fullWidth}>
      {/* <img alt="logo" src={logo} className={classes.image}/> */}

      <Grid item xs={12} sm={9}>
        <Typography variant="h1" className={classes.h1Title}><Link to='/' className={classes.h1TitleLink}>Going Viral</Link></Typography>
        <Typography variant="h3" className={classes.h3Subtitle}>Mobility in Times of Quarantine</Typography>
      </Grid>

      <Grid item xs={12} sm={3}>
        { globalMapMobilityData.features &&
        <FormControl variant="outlined" size="small" fullWidth className={classes.formControl}>
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
