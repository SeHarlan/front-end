import React from 'react';
import { shallow } from 'enzyme';
import IndividualCountry from './IndividualCountry';
import { ThemeProvider } from '@material-ui/core';

describe('IndividualCountry component', () => {
  it('renders IndividualCountry', () => {
    const wrapper = shallow(
      <ThemeProvider>
        <IndividualCountry />
      </ThemeProvider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
