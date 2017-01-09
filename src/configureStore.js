import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import todosReducer from './todos/module';

export function callAPIMiddleware({ dispatch, getState }) {
  return next => action => {
    const {
      types,
      callAPI,
      shouldCallAPI = () => true,
      payload = {}
    } = action;
    if (!types) return next(action);
    if (
      !Array.isArray(types) ||
      types.length !== 3 ||
      !types.every(type => typeof type === 'string')
    ) {
      throw new Error('Expected an array of three string types.');
    }
    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function.');
    }
    if (!shouldCallAPI(getState())) return;
    const [requestType, successType, failureType] = types;

    dispatch({ ...payload, type: requestType });
    return callAPI()
      .then(response => {
        if (400 <= response.status && response.status <= 600) {
          throw new Error('Bad server response');
        }
        return response.json();
      })
      .then(response => dispatch({ ...payload, response, type: successType }))
      .catch(error => dispatch({ ...payload, error, type: failureType }));
  }
}

const rootReducer = todosReducer;

const middlewares = [
  thunk,
  createLogger(),
  callAPIMiddleware
];

export default createStore(
  rootReducer,
  applyMiddleware(...middlewares)
);
