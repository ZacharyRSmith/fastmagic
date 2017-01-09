import React from 'react';
import { Checkbox } from 'react-bootstrap';

const TodoListUI = ({ todos, toggleTodo }) => {
  return (
    <ul>
      {todos.map(todo =>
        <li key={todo.id}>
          <Checkbox {...{
            checked: todo.done,
            inline: true,
            onChange: () => toggleTodo(todo)
          }}/> {todo.text} <small>({todo.owner})</small>
        </li>
      )}
    </ul>
  );
}

export default TodoListUI;
