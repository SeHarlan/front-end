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
      }
    },
    primary: {
      main: '#0f3568' //dark blue
    },
    secondary: {
      main: '#FFF', //white
    },
  },
  typography: {
    fontFamily: 'Volkkorn',
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': ['Volkkorn'],
      },
    },
  }
});
