import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import IndexUI from './indexUI';

it('renders without crashing', () => {
  const wrapper = shallow(
    <IndexUI {...{
    }} />
  );

  expect(toJson(wrapper)).toMatchSnapshot();
});
