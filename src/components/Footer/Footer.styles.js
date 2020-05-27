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
  },
  fullWidth: {
    backgroundColor: theme.palette.common.dust.main, 
    width: 'calc(100% + 48px)',
    margin: '0 -24px',
    padding: '18px 24px',
  },
}));
