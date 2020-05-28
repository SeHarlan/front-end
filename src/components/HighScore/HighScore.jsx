import React from 'react';
import { Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useStyles } from './HighScore.styles';
// import { Links } from '../Links/Links';
import { useState } from 'react';
import { useCovidData } from '../../hooks/covidHooks';
import { useMobilityDataByDate, useWorldMobilityData } from '../../hooks/mobilityHooks';

const getOrZero = prop => prop ?? 0;
export const HighScore = () => {
  const classes = useStyles();

  const mobility = useWorldMobilityData('2020-04-30T00:00:00.000+00:00');

  if(!mobility.features) return <h1>loading</h1>;
  console.log(mobility.features[0].mobilityData);
  
  const result = 
    mobility.features.reduce((r, d) => {
      const sumMetric = Math.abs(getOrZero(d.mobilityData.parksChange) + getOrZero(d.mobilityData.residentialChange) + getOrZero(d.mobilityData.groceryChange) + getOrZero(d.mobilityData.retailChange) + getOrZero(d.mobilityData.transitChange) + getOrZero(d.mobilityData.workplacesChange));
      r[d.mobilityData.countryName] = { sumMetric, ...d.mobilityData };
      return r;
    }, {});
  
  const mappedData = Object.entries(result).sort((a, b) => b[1].sumMetric - a[1].sumMetric);


  console.log(mappedData, 'mappedData');

  console.log('absolute change in metrics', result);

  const list = mappedData.map(([countryName, data], i) => {
    return (
      <div key={countryName}>
        { (i !== 121) && <p> {i + 1}. {countryName} </p> }
      </div>
      //  {data.sumMetric} {data.residentialChange}</
    );
  });

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.container} >

        <Grid item xs={12} className={classes.titleContainer}>
          <Typography variant="h1" className={classes.title}>Country Metric Comparison</Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl variant="outlined" size="small" fullWidth className={classes.formControl}>
            <InputLabel id="country-select-label">Choose a Country to compare</InputLabel>
            <Select
              labelId="country-select-label"
              id="country-select"
              // value={JSON.stringify({
              //   countryCode: selectedCountryCode,
              //   countryName: selectedCountryName
              // })}
              onChange={({ target }) => {
                const { countryCode, countryName } = JSON.parse(target.value);
                const toDispatch = {
                  countryCode,
                  countryName
                };
                // dispatch(setSelectedCountry(toDispatch));
                // dispatch(setSelectedSubregion(''));
                if(location.pathname !== '/')history.replace(`/highscore/${countryCode}`);
              }}
            >
              { (location.pathname === '/') &&
              <MenuItem value={JSON.stringify({
                countryCode: '',
                countryName: 'Worldwide'
              })}>Choose a Country</MenuItem>
              }
              {list}          
            </Select>
          </FormControl>
          {/* }         */}
        </Grid>
      </Grid>
    </Grid>
  );
};
