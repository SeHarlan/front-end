import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.lightBlue.main,
    height: '5rem',    
    bottom: 0,
    // position: 'absolute',
    width: '100%',
    left: 0,
    right: 0,
    padding: 0
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    color: theme.palette.common.white.main, 
    fontSize: '1.2rem',
  },
  // fullWidth: {
  //   backgroundColor: theme.palette.common.lightBlue.main, 
  //   width: 'calc(100% + 48px)',
  //   margin: '0 -24px',
  //   padding: '18px 24px',
  // },
}));
