import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2.5rem 0',
  },
  title: {
    paddingBottom: '.5rem',
    fontWeight: '550'
  },
  heading: {
    fontSize: '1.2rem',
    color: theme.palette.common.blue.main,
  },
  graph: {
    margin: '2rem'
  },
  formControl: {
    margin: '8px 0 8px 0',
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
