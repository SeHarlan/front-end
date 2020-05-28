import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.lightBlue.main,
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
