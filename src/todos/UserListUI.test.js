import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import UserListUI from './UserListUI';

it('renders without crashing', () => {
  const wrapper = shallow(
    <UserListUI {...{
      users: [{ id: '1', name: 'Spot' }]
    }}/>
  );

  expect(toJson(wrapper)).toMatchSnapshot();
});
