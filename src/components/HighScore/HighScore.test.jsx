import React from 'react';
import { shallow } from 'enzyme';
import HighScore from './HighScore';
import { ThemeProvider } from '@material-ui/core';

describe('HighScore component', () => {
  it('renders HighScore', () => {
    const wrapper = shallow(
      <ThemeProvider>
        <HighScore />
      </ThemeProvider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
