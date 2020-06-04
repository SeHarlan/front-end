import { makeStyles } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme) => ({
  mapContainer: {
    minHeight: '600px',
    padding: '2rem',
    marginBottom: '1rem',
    '@media (max-width: 959px)': {
      padding: 0,
    },
  },
  popover: {
    pointerEvents: 'auto',
    background: 'rgba(192, 199, 207, 0.7)'
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.8)',
    border: 'none'
  },
  legendPaper: {
    background: 'none',
    border: 'none',
    padding: theme.spacing(1),
    textAlign: 'center',
    boxShadow: '0 0 0',
    '@media (max-width: 959px)': {
      padding: '0 0 2rem 0',
    },
    '& p': {
      '@media (max-width: 959px)': {
        marginTop: '0',
      },  
    },
  },
  
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  radioGroup: {
    '@media (max-width: 599px)': {
      justifyContent: 'center',
    },
  },
  dragLabel: {
    zIndex: 5,
    backgroundColor: 'rgba(240, 240, 240, 0.7)',
    padding: '1rem',
    borderRadius: '0.5rem',
    position: 'absolute'
  },
  statistic: {
    color: '#0f3568',
  },
  popoverButton: {
    marginTop: '1rem',
    marginRight: '1rem'
  },
  aside: {
    fontSize: '0.8rem',
    color: 'grey'
  },
}));
