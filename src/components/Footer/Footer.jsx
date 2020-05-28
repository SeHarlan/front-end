import React from 'react';
import { Grid, Typography, Link } from '@material-ui/core';
import { useStyles } from './Footer.styles';

export const Footer = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.container} >
        <Link className={classes.link} href="/about">About the data</Link>
      </Grid>
    </Grid>
  );
};
