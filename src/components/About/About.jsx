import React from 'react';
import { useStyles } from './About.styles';
import { Grid, Typography, Link } from '@material-ui/core';
import logo from '../assets/logo.png';

export const About = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <img alt="logo" src={logo} className={classes.image}/>

      <Grid item xs={12} className={classes.titleContainer} >
        <Typography variant="h1" className={classes.title}>Data sourced for this project provided by</Typography>
      </Grid>
      <Grid item xs={12} className={classes.container} >

        <Grid item xs={12} className={classes.google} >
          <Link className={classes.link} target="_blank" href="https://www.google.com/covid19/mobility/index.html?hl=en">Mobility Data</Link>
          <Typography variant="h4" className={classes.h4}>Compiled by Google</Typography>
          <Typography variant="h4" className={classes.h4}>Movement trends over time by geography, across retail and recreation, groceries and pharmacies, parks, transit stations, workplaces, and residential.</Typography>
        </Grid>

        <Grid item xs={12} className={classes.bing} >
          <Link className={classes.link} target="_blank" href="https://www.bing.com/covid/">COVID-19 Data</Link>
          <Typography variant="h4" className={classes.h4}>Compiled by Bing</Typography>
          <Typography variant="h4" className={classes.h4}>Global spread over time, tracking COVID-19 cases for, total confirmed, active, recovered, and fatal.</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
