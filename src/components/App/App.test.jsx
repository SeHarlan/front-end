import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import { ThemeProvider } from '@material-ui/core';

describe('App component', () => {
  it('renders App', () => {
    const wrapper = shallow(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
