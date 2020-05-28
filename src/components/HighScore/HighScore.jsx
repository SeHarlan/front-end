import React from 'react';
import { Grid, Typography, List } from '@material-ui/core';
import { useStyles } from './HighScore.styles';
import { Links } from '../Links/Links';
import { useState } from 'react';
import { useCovidData } from '../../hooks/covidHooks';
import { useMobilityDataByDate, useWorldMobilityData } from '../../hooks/mobilityHooks';

const getOrZero = prop => prop ?? 0;
export const HighScore = () => {
  const classes = useStyles();
  // const [averageMobility, setAverageMobility] = useState();

  // const { dateData, positiveData, recoveredData, deathData } = useCovidData();
  // console.log(deathData);

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


  console.log(mappedData);

  console.log('absolute change in metrics', result);


  const list = mappedData.map(([countryName, data]) => {
    return (
      <div key={countryName}>
        <p>•{countryName} {data.sumMetric} {data.residentialChange}</p>
      </div>
    );
  });

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.container} >
        <Grid item xs={12} className={classes.titleContainer}>
          <Typography variant="h1" className={classes.title}>Country Metric Comparison</Typography>
          <List className={classes.list}>{list}</List>
        </Grid>
      </Grid>
    </Grid>
  );
};
