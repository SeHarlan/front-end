import React from 'react';
import { shallow } from 'enzyme';
import Map from './Map';
import { ThemeProvider } from '@material-ui/core';

describe('Map component', () => {
  it('renders Map', () => {
    const wrapper = shallow(
      <ThemeProvider>
        <Map />
      </ThemeProvider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
