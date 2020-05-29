import React from 'react';
import { shallow } from 'enzyme';
import About from './About';
import { ThemeProvider } from '@material-ui/core';

describe('About component', () => {
  it('renders About', () => {
    const wrapper = shallow(
      <ThemeProvider>
        <About />
      </ThemeProvider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
