import { PropTypes } from 'react';

export const propTypeCard = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
});
