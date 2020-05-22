import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main, 
    width: '100vw',
    minHeight: '100vh',
    paddingLeft: '0',
    paddingRight: '0',
  },
  container: {
    marginLeft: '0',
    marginRight: '0',
  }
}));
