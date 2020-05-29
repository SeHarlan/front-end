import { makeStyles } from '@material-ui/core';
import shadows from '@material-ui/core/styles/shadows';

export const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#bbdefb'
  },
  // titleContainer: {
  //   display: 'flex',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   flexDirection: 'column',
  // },
  heading: {
    // color: theme.palette.common.blue.main,
    // textShadow: '1px 1px 1px #87a3d0',
    textShadow: '1px 1px 2px #e0f7fa',
    fontSize: '1.55rem',
    fontWeight: '550',
  },
  title: {
    // color: theme.palette.common.green.main, 
    // textShadow: '1px 1px 2px #87a3d0',
    textShadow: '2px 2px 2px #e0f7fa',
    fontSize: '3rem',
    fontWeight: '550',
    marginTop: '1rem'
  },
  subtitle: {
    // color: theme.palette.common.teal.main,
    color: theme.palette.secondary.main, 
    marginTop: '.5rem'
  },
  fullWidth: {
    backgroundColor: 'none', 
    // width: 'calc(100% + 48px)',
    // margin: '0 -24px',
    padding: '18px 24px',
  },
  h1TitleLink: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  formControl: {
    backgroundColor: 'white',
    borderRadius: '4px',
  },
  logo: {
    width: '3rem', 
    position: 'relative', 
    top: '0.7rem', 
    left: '0.2rem', 
    margin: '0 -0.2rem 0 -0.2rem',
    filter: 'drop-shadow(2px 2px 1px #e0f7fa)'
  }
}));

