import React from 'react';
import { render } from 'react-dom';
import App from './components/App/App';
import { ThemeProvider } from '@material-ui/core';
import { theme } from './theme';
import './index.css';

render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>, 
  document.getElementById('root')
);
