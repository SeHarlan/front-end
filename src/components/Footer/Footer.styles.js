import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  
  root: {
    background: '#4ab19ab0',
    height: '5rem',    
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.palette.secondary.main, //white
    fontSize: '1.3rem',
  }
}));
