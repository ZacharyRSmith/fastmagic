import React, { Component } from 'react';
import { BrowserRouter } from 'react-router';

import TodoFormContainer from './TodoFormContainer';
import TodoFormUI from './TodoFormUI';
import TodoListUI from './TodoListUI';
import UserList from './UserList';

class TodoAppUI extends Component {
  constructor(props) {
    super(props);
    // this.props.fetchTodos();
  }

  componentDidMount() {
    setTimeout(() => this.props.fetchTodos(), 250); // Give nodemon some time.
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <h1>Todo App</h1>
          <TodoListUI {...this.props}/>
          <TodoFormContainer>
            <TodoFormUI/>
          </TodoFormContainer>
          <UserList />
        </div>
      </BrowserRouter>
    );
  }
}

export default TodoAppUI;
