import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useStyles } from './individualCountry.styles';
import MiniChartsContainer from '../MiniChart/MiniChartsContainer';

export const individualCountry = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.header}>
        <Typography variant="h3" className={classes.title}>Individual Country</Typography>
        
        <Grid item xs={12} lg={6} className={classes.graph}>
          <MiniChartsContainer />
        </Grid>

        <Grid item xs={12} lg={6} className={classes.metrics}>
          <Typography variant="h3" className={classes.title}>Metrics</Typography>
        </Grid>

      </Grid>
    </Grid>
  );
};

