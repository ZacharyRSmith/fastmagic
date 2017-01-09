import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import CardListUI from './CardListUI';
import { cards } from './module/bootstrap';

it('renders without crashing', () => {
  const wrapper = shallow(
    <CardListUI {...{
      cards
    }} />
  );

  expect(toJson(wrapper)).toMatchSnapshot();
});
