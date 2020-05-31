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
    margin: '2rem',
    minHeight: '35vh'
  },
  formControl: {
    margin: '8px 0 8px 0',
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  backdrop: {
    width: 'calc(100% + 48px) !important',
    backgroundColor: 'rgba(43, 73, 157, 0.132)',
    margin: '0 -24px',
    padding: '2rem',
  }
}));
