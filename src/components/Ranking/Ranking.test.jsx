import React from 'react';
import { shallow } from 'enzyme';
import Ranking from './Ranking';
import { ThemeProvider } from '@material-ui/core';

describe('Ranking component', () => {
  it('renders Ranking', () => {
    const wrapper = shallow(
      <ThemeProvider>
        <Ranking />
      </ThemeProvider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
