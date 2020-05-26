import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10rem',
    paddingBottom: '5rem',
  },
  title: {
    fontSize: '1.6rem',
    color: theme.palette.common.green.main,
    paddingBottom: '.5rem',
    fontWeight: '550'
  },
  heading: {
    fontSize: '1.2rem',
    color: theme.palette.common.blue.main,
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  graph: {
  },
  metrics: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem'
  }
}));
