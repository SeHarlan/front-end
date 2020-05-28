import React from 'react';
import { shallow } from 'enzyme';
import ComparePage from './ComparePage';
import { ThemeProvider } from '@material-ui/core';

describe('ComparePage component', () => {
  it('renders ComparePage', () => {
    const wrapper = shallow(
      <ThemeProvider>
        <ComparePage />
      </ThemeProvider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
