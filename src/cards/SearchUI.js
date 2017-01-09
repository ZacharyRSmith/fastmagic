import React, { PropTypes } from 'react';
import { FormControl } from 'react-bootstrap';

import CardListUI from './CardListUI';
import { propTypeCard } from './module/propTypes';

const SearchUI = ({ cards, handleChange }) => (
  <div>
    <FormControl {...{
      onChange: handleChange
    }}/>
    <CardListUI {...{
      cards
    }} />
  </div>
);

SearchUI.propTypes = {
  cards: PropTypes.arrayOf(propTypeCard).isRequired,
  handleChange: PropTypes.func.isRequired
};

export default SearchUI;
