import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import TodoFormUI from './TodoFormUI';

it('renders without crashing', () => {
  const wrapper = shallow(
    <TodoFormUI {...{
      formData: {},
      handleChange: () => {},
      handleSubmit: () => {}
    }} />
  );

  expect(toJson(wrapper)).toMatchSnapshot();
});
