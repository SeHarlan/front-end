import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
  palette: {
    common: {
      teal: {
        main: '#229c9a', //medium light teal
      },
      blue: {
        main: '#0f3568' // dark blue
      },
      red: {
        main: '#f44336' // darkred
      },
      white: {
        main: '#f0f8ff',
      },
      green: {
        main: 'rgb(20,146,124)',
      },
      dust: {
        main: '#e6e6e3',
      },
      charcoal: {
        main: '#53565A',
      },
      lightBlue: {
        main: '#bbdefb'
      },
      greenGray: {
        main: '#3c6e71'
      }
    },
    primary: {
      main: '#2b499d' // darker globe blue
      // main: '#b71c1c' //dark red
    },
    secondary: {
      // main: '#53565A', //charcoal
      main: '#229c9a', //teal
    },
  },
  typography: {
  //   fontFamily: 'Volkkorn',
    h1: { fontSize: '3rem' },
    h2: { fontSize: '2.25rem' },
    h3: { fontSize: '1.75rem' },
    h4: { fontSize: '1.5rem' },
    h5: { fontSize: '1.25rem' },
    h6: { fontSize: '1rem' }
  }
});

export default theme;
