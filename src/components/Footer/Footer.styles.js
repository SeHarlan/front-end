import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    height: '5rem',    
    bottom: 0,
    // boxShadow: '0 -3px 50px rgb(19, 53, 132)',
    // width: '100%',
    left: 0,
    right: 0,
    margin: '0 -24px',
    padding: '2rem',
    width: 'calc(100% + 48px) !important',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    // color: theme.palette.common.white.main, 
    color: '#f0f8ff',
    fontSize: '1.2rem',
  },
}));
