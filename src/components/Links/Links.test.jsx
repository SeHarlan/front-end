import React from 'react';
import { shallow } from 'enzyme';
import Links from './Links';
import { ThemeProvider } from '@material-ui/core';

describe('Links component', () => {
  it('renders Links', () => {
    const wrapper = shallow(
      <ThemeProvider>
        <Links />
      </ThemeProvider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
