import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  infoBox: {
    display: 'flex',
    flexDirection: 'row'

  },
  legend: {
    display: 'flex',
    margin: '1rem'
  }
}));
