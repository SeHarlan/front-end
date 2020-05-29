import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedCountryCode, getGlobalMapMobilityByDate, getSelectedCountryName } from '../../selectors/selectors';
import { setSelectedCountry, setSelectedSubregion } from '../../actions/actions';
import { Grid, Typography, FormControl, Select, MenuItem } from '@material-ui/core';

import { Link, useHistory, useLocation } from 'react-router-dom';
import { useStyles } from './Header.styles';
import logo from '../../assets/logo.png';

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
      <Grid item sm={3} />
      <Grid item xs={12} sm={6} className={classes.fullWidthWhite}>
        <Link to='/' className={classes.h1TitleLink}>
          <section style={{ textAlign: 'center' }}> 
            <Typography variant="h1" align="center" style={{ display: 'inline' }} className={classes.title}>G</Typography>
            <img src={logo} alt="Going Viral" className={classes.logo}/>
            <Typography variant="h1" align="center" style={{ display: 'inline' }}className={classes.title}>ing Viral</Typography>
          </section>
          <Typography variant="h3" align="center" className={classes.subtitle}>Pandemic-Related Mobility Metrics</Typography>
        </Link>
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
              if(location.pathname.includes('/country')) history.replace(`/country/${countryCode}`);
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
