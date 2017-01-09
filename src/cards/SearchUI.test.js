import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import SearchUI from './SearchUI';
import { cards } from './module/bootstrap';

it('renders without crashing', () => {
  const wrapper = shallow(
    <SearchUI {...{
      cards,
      handleChange: () => {}
    }} />
  );

  expect(toJson(wrapper)).toMatchSnapshot();
});
