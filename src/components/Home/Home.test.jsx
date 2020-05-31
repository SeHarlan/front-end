import React from 'react';
import { shallow } from 'enzyme';
import Home from './Home';
import { ThemeProvider } from '@material-ui/core';

describe('Home component', () => {
  it('renders Home', () => {
    const wrapper = shallow(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
