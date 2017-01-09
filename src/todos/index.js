import { connect } from 'react-redux';

import TodoAppUI from './indexUI';
import { actionCreators } from './module';
import { todos } from './module/selectors';

export default connect(
  state => ({
    todos: todos(state)
  }),
  {
    fetchTodos: actionCreators.fetchTodos,
    toggleTodo: actionCreators.toggleTodo
  }
)(TodoAppUI);
