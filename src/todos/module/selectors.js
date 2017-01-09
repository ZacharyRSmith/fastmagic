export const todos = state => state.entities.todos.allIds.map(id =>
  state.entities.todos.byId[id]
);
export const users = state => state.entities.users.allIds.map(id =>
  state.entities.users.byId[id]
);
