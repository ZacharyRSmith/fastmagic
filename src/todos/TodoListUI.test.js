import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import TodoListUI from './TodoListUI';
import { priv } from './module';
import { fakeTodos } from './module/bootstrap';

it('renders without crashing', () => {
  const wrapper = shallow(
    <TodoListUI {...{
      todos: fakeTodos.map(todo => priv.adaptTodo(todo)),
      toggleTodo: () => {}
    }}/>
  );

  expect(toJson(wrapper)).toMatchSnapshot();
});
