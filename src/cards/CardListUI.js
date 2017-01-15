import React, { PropTypes } from 'react';

import { propTypeCard } from './module/propTypes';

import './CardListUI.css';

const CardListUI = ({ cards }) => {
  return (
    <div id="cards">
      {cards.map(card =>
        <div key={card.id} className="card">
          <h3>{card.name}</h3>
          <p>{card.flavor}</p>
          {card.imageUrl && <img src={card.imageUrl} alt={card.name}/>}
        </div>
      )}
    </div>
  );
};

CardListUI.propTypes = {
  cards: PropTypes.arrayOf(propTypeCard).isRequired
};

export default CardListUI;
