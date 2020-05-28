import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedCountryCode, getGlobalMapMobilityByDate, getSelectedCountryName } from '../../selectors/selectors';
import { setSelectedCountryCode, setSelectedCountryName, setSelectedCountry, setSelectedSubregion } from '../../actions/actions';
import { Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

import { Link, useHistory, useLocation } from 'react-router-dom';
import { useStyles } from './Header.styles';
import { Link } from 'react-router-dom';

// const useStyles = makeStyles((theme) => ({
//   fullWidth: {
//     backgroundColor: 'none', 
//     width: 'calc(100% + 48px)',
//     margin: '0 -24px',
//     padding: '18px 24px',
//   },
//   title: {
//     color: theme.palette.common.teal.main,
//     fontWeight: 'bold',
//   },
//   h1TitleLink: {
//     color: theme.palette.primary.main,
//     fontWeight: 'bold',
//     textDecoration: 'none',
//   },
//   subtitle: {
//     color: theme.palette.common.teal.main,
//   },
//   formControl: {
//     backgroundColor: 'white',
//   }
// }));

export const Header = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const selectedCountryCode = useSelector(getSelectedCountryCode);
  const selectedCountryName = useSelector(getSelectedCountryName);
  const globalMapMobilityData = useSelector(getGlobalMapMobilityByDate);
  
  const selectOptions = globalMapMobilityData?.features
    ?.filter(item => item.mobilityData.countryName != null)
    .sort((a, b) => (a.mobilityData.countryName > b.mobilityData.countryName) ? 1 : -1)
    .map((item) => <MenuItem 
      key={item.mobilityData.countryName}  
      name={item.mobilityData.countryName}
      value={JSON.stringify({
        countryCode: item.mobilityData.countryCode,
        countryName: item.mobilityData.countryName
      })}
    >{item.mobilityData.countryName}</MenuItem>);

  return (
    <Grid container justify='center' alignItems='center' className={classes.fullWidth}>
      {/* <Grid className={classes.imageContainer}> */}
      {/* <img alt="logo" src={logo} className={classes.image}/> */}
      {/* </Grid> */}
      <Grid item sm={3} />
      <Grid item xs={12} sm={6} className={classes.fullWidthWhite}>
        <Typography variant="h1" align="center" className={classes.title}><Link to='/' className={classes.h1TitleLink}>Going Viral</Link></Typography>
        <Typography variant="h3" align="center" className={classes.subtitle}>Mobility in Times of Quarantine</Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        { globalMapMobilityData.features && (location.pathname !== '/about') &&
        <FormControl variant="outlined" size="small" fullWidth className={classes.formControl}>
          {/* <InputLabel id="country-select-label">Choose a Country</InputLabel> */}
          
          <Select
            labelId="country-select-label"
            id="country-select"
            value={JSON.stringify({
              countryCode: selectedCountryCode,
              countryName: selectedCountryName
            })}
            onChange={({ target }) => {
              const { countryCode, countryName } = JSON.parse(target.value);
              const toDispatch = {
                countryCode,
                countryName
              };
              dispatch(setSelectedCountry(toDispatch));
              dispatch(setSelectedSubregion(''));
              if(location.pathname !== '/')history.replace(`/country/${countryCode}`);
            }}
          >
            { (location.pathname === '/') &&
              <MenuItem value={JSON.stringify({
                countryCode: '',
                countryName: 'Worldwide'
              })}>Choose a Country</MenuItem>
            }
            {selectOptions}          
          </Select>
        </FormControl>
        }        
      </Grid>

    </Grid>
  );
};
