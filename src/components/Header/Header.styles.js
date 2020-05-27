import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    // paddingTop: '1rem',
    // background: '#fff',
    // width: '100%',
    // height: '7rem',
    // boxShadow: '2px 2px 2px #0c7982',       
    // position: 'fixed',
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  heading: {
    // color: theme.palette.common.blue.main,
    textShadow: '1px 1px 1px #87a3d0',
    fontSize: '1.55rem',
    fontWeight: '550',
  },
  title: {
    // color: theme.palette.common.green.main, 
    textShadow: '1px 1px 2px #87a3d0',
    fontSize: '2.4rem',
    fontWeight: '550',
  },
  formControl: {
    display: 'flex'
  }
}));

