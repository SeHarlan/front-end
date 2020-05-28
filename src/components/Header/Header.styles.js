import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#bbdefb'
  },
  // titleContainer: {
  //   display: 'flex',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   flexDirection: 'column',
  // },
  heading: {
    // color: theme.palette.common.blue.main,
    // textShadow: '1px 1px 1px #87a3d0',
    textShadow: '1px 1px 2px #e0f7fa',
    fontSize: '1.55rem',
    fontWeight: '550',
  },
  title: {
    // color: theme.palette.common.green.main, 
    // textShadow: '1px 1px 2px #87a3d0',
    textShadow: '1px 1px 2px #e0f7fa',
    fontSize: '3rem',
    fontWeight: '550',
    marginTop: '1rem'
  },
  subtitle: {
    // color: theme.palette.common.teal.main,
    color: theme.palette.secondary.main, 
    marginBottom: '1rem',
    marginTop: '.5rem'
  },
  fullWidth: {
    backgroundColor: 'none', 
    // width: 'calc(100% + 48px)',
    // margin: '0 -24px',
    // padding: '18px 24px',
  },
  h1TitleLink: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  formControl: {
    backgroundColor: 'white',
  },
  // imageContainer: {
  //   // display: 'flex',
  //   // flexDirection: 'row',
  //   // marginBottom: '2.5rem',
  // },
  // image: {
  //   // maxWidth: '100%',
  //   width: '10rem',
  //   height: '10rem',
  //   // marginTop: '-2rem',
  // },
}));

