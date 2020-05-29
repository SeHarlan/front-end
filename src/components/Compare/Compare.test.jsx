import React from 'react';
import { shallow } from 'enzyme';
import Compare from './Compare';
import { ThemeProvider } from '@material-ui/core';

describe('Compare component', () => {
  it('renders Compare', () => {
    const wrapper = shallow(
      <ThemeProvider>
        <Compare />
      </ThemeProvider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
