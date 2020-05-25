import React from 'react';
import { render } from 'react-dom';
import App from './components/App/App';
import { ThemeProvider } from '@material-ui/core';
import { theme } from './theme';
import './index.css';
import { Provider } from 'react-redux';
import store from './store';

render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);
