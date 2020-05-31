import React from 'react';
import { shallow } from 'enzyme';
import StackGraph from './StackGraph';
import { ThemeProvider } from '@material-ui/core';

describe('StackGraph component', () => {
  it('renders StackGraph', () => {
    const wrapper = shallow(
      <ThemeProvider>
        <StackGraph />
      </ThemeProvider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
