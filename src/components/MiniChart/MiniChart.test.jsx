import React from 'react';
import { shallow } from 'enzyme';
import MiniChart from './MiniChart';
import { ThemeProvider } from '@material-ui/core';

describe('MiniChart component', () => {
  it('renders MiniChart', () => {
    const wrapper = shallow(
      <ThemeProvider>
        <MiniChart />
      </ThemeProvider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
