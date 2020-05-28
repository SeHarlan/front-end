import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    margin: '1rem',
  }
}));
