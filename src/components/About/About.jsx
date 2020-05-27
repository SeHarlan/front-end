import React from 'react';
import { useStyles } from './About.styles';
import { Grid, Typography, Link } from '@material-ui/core';

export const About = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.titleContainer} >
        <Typography variant="h1" className={classes.title}>Data sourced for this project provided by</Typography>
      </Grid>
      <Grid item xs={12} className={classes.container} >

        <Grid item xs={12} className={classes.google} >
          <Link className={classes.link} href="https://www.google.com/covid19/mobility/index.html?hl=en">Mobility Data</Link>
          <Typography variant="h4" className={classes.h4}>Compiled by Google</Typography>
        </Grid>

        <Grid item xs={12} className={classes.bing} >
          <Link className={classes.link} href="https://www.bing.com/covid/">COVID-19 Data</Link>
          <Typography variant="h4" className={classes.h4}>Compiled by Bing</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
