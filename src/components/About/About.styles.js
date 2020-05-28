import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',  
    // marginTop: '2rem',
    marginBottom: '3rem',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '1rem',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1rem',
    textAlign: 'center',
    padding: '2rem',
    width: '50rem'
  },
  title: {
    color: theme.palette.primary.main,
    // color: '#3c6e71',
    fontSize: '1.8rem',
    fontWeight: '500'
  },
  link: {
    fontWeight: '500',
    fontSize: '1.6rem',
    '&:hover': {
      color: theme.palette.common.teal.main,
    },
    '&$focusVisible': {
      color: theme.palette.common.teal.main,
    }
  },
  h4: {
    color: theme.palette.common.teal.main,
  },
  bing: {
    marginTop: '3rem'
  },
  imageContainer: {
    // display: 'flex',
    // flexDirection: 'row',
    // marginBottom: '2.5rem',
  },
  image: {
    // maxWidth: '100%',
    width: '13rem',
    height: '13rem',
    // marginTop: '-2rem',
  },
}
));
