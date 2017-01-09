import React, { PropTypes } from 'react';
import { Grid, Row, Col, Thumbnail } from 'react-bootstrap';

import { propTypeCard } from './module/propTypes';

const CardListUI = ({ cards }) => {
  return (
    <Grid>
      <Row>
      {cards.map(card =>
        <Col key={card.id} xs={6} md={4}>
          <Thumbnail src={card.imageUrl} alt="">
            <h3>{card.name}</h3>
            <p>{card.flavor}</p>
          </Thumbnail>
        </Col>
      )}
      </Row>
    </Grid>
  );
};

CardListUI.propTypes = {
  cards: PropTypes.arrayOf(propTypeCard).isRequired
};

export default CardListUI;
