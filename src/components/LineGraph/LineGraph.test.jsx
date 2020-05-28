import React from 'react';
import { shallow } from 'enzyme';
import LineGraph from './LineGraph';
import { ThemeProvider } from '@material-ui/core';

describe('LineGraph component', () => {
  it('renders LineGraph', () => {
    const wrapper = shallow(
      <ThemeProvider>
        <LineGraph />
      </ThemeProvider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
