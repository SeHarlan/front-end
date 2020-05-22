import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useStyles } from './Header.styles';
// import logo from '';
import { Links } from '../Links/Links';

export const Header = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.logoContainer} >
        {/* <img alt="logo" src={logo} className={classes.image}/> */}
        <Grid item xs={12} className={classes.titleContainer}>
          <Typography variant="h1" className={classes.title}>Pandemic Legacy</Typography>
          <Typography variant="h2" className={classes.heading}>Quarantine Mobility Metrics</Typography>
        </Grid>
      </Grid>
      <Links />
    </Grid>
  );
};
