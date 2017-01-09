import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { actionCreators, actionTypes, initialTodosState, initialUsersState, priv, privateTypes, todosReducer, usersReducer } from './index';
import { callAPIMiddleware } from '../../configureStore';

const mockStore = configureMockStore([thunk, callAPIMiddleware]);

const mockResponse = (status, statusText, response) => {
  return new window.Response(response, {
    status,
    statusText,
    header: {
      'Content-type': 'application/json'
    }
  });
};

let adaptedFakeTodo;
let fakeTodo;

beforeEach(() => {
  fakeTodo = { _id: 1, done: false, text: 'do something', owner: { _id: 1, name: 'spot' } };
  adaptedFakeTodo = priv.adaptTodo(fakeTodo);
});

describe('async actions', () => {
  const todosPath = /\/api\/todos$/;
  let store;

  beforeEach(() => {
    store = mockStore({
      entities: {
        todos: {
          allIds: [adaptedFakeTodo.id],
          byId: {
            [adaptedFakeTodo.id]: adaptedFakeTodo
          },
          isFetching: false
        }
      }
    });
    window.fetch = jest.fn().mockImplementation((url, opts) =>
      // Resolve as if GETing todos. Most tests just need the 200.
      Promise.resolve(mockResponse(200, null, JSON.stringify({}))));
  });

  it('should fetch todos if needed', () => {
    store.dispatch(actionCreators.fetchTodosIfNeeded());

    expect(window.fetch).not.toBeCalled();

    store = mockStore({ entities: { todos: initialTodosState }});

    store.dispatch(actionCreators.fetchTodosIfNeeded());

    expect(window.fetch).toHaveBeenCalledTimes(1);
    const callArgs = window.fetch.mock.calls[0];
    expect(callArgs[0]).toMatch(todosPath);
    expect(callArgs[1].method).toBe('GET');
  });

  it(`should create ${actionTypes.FETCH_TODOS_SUCCESS} when fetching todos has been done`, () => {
    return store.dispatch(actionCreators.fetchTodos())
      .then(() => {

        const expectedActions = [
          { type: privateTypes.FETCH_TODOS_REQUEST },
          { type: actionTypes.FETCH_TODOS_SUCCESS, response: {}}
        ];
        expect(store.getActions()).toEqual(expectedActions);
        expect(window.fetch).toHaveBeenCalledTimes(1);
        const callArgs = window.fetch.mock.calls[0];
        expect(callArgs[0]).toMatch(todosPath);
        expect(callArgs[1].method).toBe('GET');
      });
  });

  it(`should create ${privateTypes.FETCH_TODOS_ERROR} when fetching todos errors`, () => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve(mockResponse(400)));

    return store.dispatch(actionCreators.fetchTodos())
      .then(() => {

        const expectedActions = [
          { type: privateTypes.FETCH_TODOS_REQUEST },
          { type: privateTypes.FETCH_TODOS_FAILURE, error: new Error('Bad server response') }
        ];
        expect(store.getActions()).toEqual(expectedActions);
        expect(window.fetch).toHaveBeenCalledTimes(1);
        const callArgs = window.fetch.mock.calls[0];
        expect(callArgs[0]).toMatch(todosPath);
        expect(callArgs[1].method).toBe('GET');
      });
  });
});

describe('todos reducer', () => {
  it('returns initial state', () => {
    expect(todosReducer(undefined, {})).toEqual(initialTodosState);
  });

  it(`handles ${privateTypes.FETCH_TODOS_REQUEST}`, () => {
    const action = { type: privateTypes.FETCH_TODOS_REQUEST };
    let state = todosReducer(undefined, {});

    state = todosReducer(state, action);

    expect(state).toEqual({ ...initialTodosState, isPending: true });
  });

  it(`handles ${privateTypes.FETCH_TODOS_REQUEST}
    followed by ${actionTypes.FETCH_TODOS_SUCCESS}`, () => {

    let state = todosReducer(undefined, {});
    let action = { type: privateTypes.FETCH_TODOS_REQUEST };
    state = todosReducer(state, action);
    action = {
      type: actionTypes.FETCH_TODOS_SUCCESS,
      response: [fakeTodo]
    };

    state = todosReducer(state, action);

    expect(state).toEqual({
      ...initialTodosState,
      allIds: [adaptedFakeTodo.id],
      byId: {
        [adaptedFakeTodo.id]: adaptedFakeTodo
      }
    });
  });

  it(`handles ${privateTypes.FETCH_TODOS_REQUEST}
    followedy by ${privateTypes.FETCH_TODOS_FAILURE}`, () => {

    let state = todosReducer(undefined, {});
    let action = { type: privateTypes.FETCH_TODOS_REQUEST };
    state = todosReducer(state, action);
    action = { type: privateTypes.FETCH_TODOS_FAILURE };

    state = todosReducer(state, action);

    expect(state).toEqual(initialTodosState);
  });

  it(`handles ${privateTypes.FETCH_TODOS_REQUEST}
    followed by ${privateTypes.UPDATE_TODO}`, () => {

    let state = {
      allIds: [adaptedFakeTodo.id],
      byId: {
        [adaptedFakeTodo.id]: adaptedFakeTodo
      },
      isPending: false
    };
    let action = { type: privateTypes.FETCH_TODOS_REQUEST };
    state = todosReducer(state, action);
    action = {
      type: privateTypes.UPDATE_TODO,
      response: { ...fakeTodo, done: true }
    };

    state = todosReducer(state, action);

    expect(state).toEqual({
      ...initialTodosState,
      allIds: [adaptedFakeTodo.id],
      byId: {
        ...initialTodosState.byId,
        [adaptedFakeTodo.id]: {
          ...adaptedFakeTodo,
          done: true
        }
      }
    });
  });
});

describe('todoOwner reducer', () => {
  it('returns the initial state', () => {
    expect(priv.todoOwnerReducer(undefined, {})).toEqual(priv.initialTodoOwnerState);
  });

  it(`handles ${actionTypes.FETCH_TODOS_SUCCESS}`, () => {
    let state = priv.initialTodoOwnerState;
    const action = {
      type: actionTypes.FETCH_TODOS_SUCCESS,
      response: [{ ...fakeTodo, owner: { _id: 'spotsid', name: 'spot' }}]
    };

    state = priv.todoOwnerReducer(state, action);

    expect(state).toEqual({
      allIds: ['1'],
      byId: {
        '1': {
          id: '1',
          todoId: fakeTodo._id,
          ownerId: 'spotsid'
        }
      }
    });
  });
});

describe('users reducer', () => {
  it('returns the initial state', () => {
    expect(usersReducer(undefined, {})).toEqual(initialUsersState);
  });

  it(`handles ${actionTypes.FETCH_TODOS_SUCCESS}`, () => {
    let usersState = initialUsersState;
    const action = {
      type: actionTypes.FETCH_TODOS_SUCCESS,
      response: [{ ...fakeTodo, owner: { _id: 'spotsid', name: 'spot' }}]
    };

    usersState = usersReducer(usersState, action);

    expect(usersState).toEqual({
      ...initialUsersState,
      allIds: ['spotsid'],
      byId: {
        spotsid: {
          id: 'spotsid',
          name: 'spot'
        }
      }
    });
  });
});
