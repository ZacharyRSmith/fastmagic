import { connect } from 'react-redux';

import UserListUI from './UserListUI';
import { users } from './module/selectors';

export default connect(
  state => ({
    users: users(state)
  })
)(UserListUI);
