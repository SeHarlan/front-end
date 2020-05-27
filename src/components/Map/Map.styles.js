import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'auto',
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.7)'
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
