import _ from 'lodash';
import { combineReducers } from 'redux';

const adaptTodo = todo => {
  const retObj = {
    ...todo,
    id: todo._id,
    owner: todo.owner.name
  };
  delete retObj._id;
  return retObj;
};
const adaptUser = user => {
  const retObj = {
    ...user,
    id: user._id
  };
  delete retObj._id;
  return retObj;
};
const normalizeTodo = rawTodo => {
  const user = adaptUser(rawTodo.owner);
  const todo = adaptTodo(rawTodo);
  return { todo, user };
};

// ACTION TYPES
const CREATE_TODOS_REQUEST = 'todos/CREATE_TODOS_REQUEST';
const CREATE_TODOS_SUCCESS = 'todos/CREATE_TODOS_SUCCESS';
const CREATE_TODOS_FAILURE = 'todos/CREATE_TODOS_FAILURE';
const FETCH_TODOS_REQUEST = 'todos/FETCH_TODOS_REQUEST';
const FETCH_TODOS_SUCCESS = 'todos/FETCH_TODOS_SUCCESS';
const FETCH_TODOS_FAILURE = 'todos/FETCH_TODOS_FAILURE';
const UPDATE_TODO = 'todos/UPDATE_TODO';
export const actionTypes = {
  FETCH_TODOS_SUCCESS
};
export const privateTypes = {
  FETCH_TODOS_REQUEST,
  FETCH_TODOS_FAILURE,
  UPDATE_TODO
};

// ASYNC ACTION CREATORS
const createTodos = todos => ({
  types: [CREATE_TODOS_REQUEST, FETCH_TODOS_SUCCESS, CREATE_TODOS_FAILURE],
  callAPI: () => fetch(
    'http://localhost:5000/api/todos',
    {
      body: JSON.stringify(todos),
      headers: (() => {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-type', 'application/json');
        return headers;
      })(),
      method: 'POST'
    })
});
const fetchTodos = () => ({
  types: [FETCH_TODOS_REQUEST, FETCH_TODOS_SUCCESS, FETCH_TODOS_FAILURE],
  callAPI: () => fetch(
    'http://localhost:5000/api/todos',
    {
      headers: (() => {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        return headers;
      })(),
      method: 'GET'
    })
});
const fetchTodosIfNeeded = () => ({
  ...fetchTodos(),
  shouldCallAPI: state => !state.entities.todos.allIds.length
});
const toggleTodo = todo => ({
  types: [FETCH_TODOS_REQUEST, UPDATE_TODO, FETCH_TODOS_FAILURE],
  callAPI: () => fetch(
    'http://localhost:5000/api/todos',
    {
      body: JSON.stringify(todo),
      headers: (() => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return headers;
      })(),
      method: 'PUT'
    })
});
export const actionCreators = {
  createTodos,
  fetchTodos,
  fetchTodosIfNeeded,
  toggleTodo
};

// REDUCERS
export const initialTodosState = { allIds: [], byId: {}, isPending: false };
export function todosReducer(state = initialTodosState, action) {
  const { type } = action;
  const response = Array.isArray(action.response)
    ? action.response
    : [action.response];
  switch (type) {
  case FETCH_TODOS_REQUEST:
    return {
      ...state,
      isPending: true
    };
  case FETCH_TODOS_SUCCESS:
    const newById = response.reduce((res, todo) => {
      const adaptedTodo = adaptTodo(todo);
      return {
        ...res,
        [adaptedTodo.id]: adaptedTodo
      };
    }, {});

    return {
      ...state,
      isPending: false,
      allIds: _.uniq([
        ...state.allIds,
        ...response.map(todo => adaptTodo(todo).id)
      ]),
      byId: {
        ...state.byId,
        ...newById
      }
    };
  case FETCH_TODOS_FAILURE:
    return {
      ...state,
      isPending: false
    };
  case UPDATE_TODO:
    const todo = adaptTodo(response[0]);
    return {
      ...state,
      isPending: false,
      byId: {
        ...state.byId,
        [todo.id]: {
          ...todo
        }
      }
    };
  default:
    return state;
  }
}
export const initialUsersState = { allIds: [], byId: {}, isPending: false };
export function usersReducer(state = initialUsersState, action) {
  const { type } = action;
  const response = Array.isArray(action.response)
    ? action.response
    : [action.response];
  switch (type) {
  case FETCH_TODOS_SUCCESS:
    const newById = response.reduce((res, todo) => {
      const adaptedUser = adaptUser(todo.owner);

      return {
        ...res,
        [adaptedUser.id]: adaptedUser
      };
    }, {});

    return {
      ...state,
      allIds: _.uniq([
        ...state.allIds,
        ...response.map(todo => adaptUser(todo.owner).id)
      ]),
      byId: {
        ...state.byId,
        ...newById
      }
    }
  default:
    return state;
  }
}
const initialTodoOwnerState = { allIds: [], byId: {}};
function todoOwnerReducer(state = initialTodoOwnerState, action) {
  const { type } = action;
  const response = Array.isArray(action.response)
    ? action.response
    : [action.response];
  switch (type) {
  case FETCH_TODOS_SUCCESS:
    const newIds = [];
    let nextId = state.allIds.length + 1;

    const newById = response.reduce((retObj, rawTodo) => {
      const { todo, user } = normalizeTodo(rawTodo);
      const foundById = Object.keys(state.byId).find(key =>
        state.byId[key].todoId === todo.id
      );

      if (foundById) {
        retObj[foundById].ownerId = user.id;
      } else {
        newIds.push(String(nextId));
        retObj[String(nextId)] = {
          id: String(nextId++), // NOTE: nextId incremented after passing to String()
          todoId: todo.id,
          ownerId: user.id
        };
      }
      return retObj;
    }, {});

    return {
      ...state,
      allIds: [
        ...state.allIds,
        ...newIds
      ],
      byId: {
        ...state.byId,
        ...newById
      }
    }
  default:
    return state;
  }
}
export default combineReducers({
  entities: combineReducers({
    todos: todosReducer,
    todoOwner: todoOwnerReducer,
    users: usersReducer
  })
});

export const priv = {
  adaptTodo,
  initialTodoOwnerState,
  todoOwnerReducer
};
