import React from 'react';
import { useStyles } from './About.styles';
import { Grid, Typography } from '@material-ui/core';

export const About = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.container} >
        <Typography variant="h2" href="https://www.google.com/covid19/mobility/index.html?hl=en">Mobility Data</Typography>
        <Typography variant="body1">Compiled by Google</Typography>
        <Typography variant="h2" href="https://www.bing.com/covid/">COVID-19 Data</Typography>
        <Typography variant="body1">Compiled by Bing</Typography>
      </Grid>
    </Grid>
  );
};
