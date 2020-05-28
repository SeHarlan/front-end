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
    boxShadow: '0 0 0'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  arrow: {
    width: '3rem',
    zIndex: 3
  },
  dragLabel: {
    zIndex: 5,
    backgroundColor: 'rgba(240, 240, 240, 0.7)',
    padding: '1rem',
    borderRadius: '0.5rem',
    position: 'absolute'
  }
}));
