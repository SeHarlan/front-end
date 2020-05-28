import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  mapContainer: {
    minHeight: '600px',
    padding: '2rem',
    marginBottom: '1rem'
  },
  popover: {
    pointerEvents: 'auto',
    background: 'rgba(192, 199, 207, 0.7)'
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.8)'
  },
  legendPaper: {
    padding: theme.spacing(1),
    textAlign: 'center',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));
