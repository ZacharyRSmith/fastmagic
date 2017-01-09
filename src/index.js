import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './configureStore';
import TodoApp from './todos';

import './index.css';

ReactDOM.render((
  <Provider store={store}>
    <TodoApp />
  </Provider>
  ), document.getElementById('root')
);
