import React from 'react';
import { shallow } from 'enzyme';
import Footer from './Footer';
import { ThemeProvider } from '@material-ui/core';

describe('Footer component', () => {
  it('renders Footer', () => {
    const wrapper = shallow(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
