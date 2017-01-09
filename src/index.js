import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './configureStore';
import CardApp from './cards';
// import TodoApp from './todos';

import './index.css';

ReactDOM.render((
  <CardApp />
  ), document.getElementById('root')
);

// ReactDOM.render((
//   <Provider store={store}>
//     <TodoApp />
//   </Provider>
//   ), document.getElementById('root')
// );
