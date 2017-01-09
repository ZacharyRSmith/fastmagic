import React from 'react';

const UserListUI = ({ users }) => {
  return (
    <ul>
      {users.map(user =>
        <li key={user.id}>
          {user.name}
        </li>
      )}
    </ul>
  );
};

export default UserListUI;
