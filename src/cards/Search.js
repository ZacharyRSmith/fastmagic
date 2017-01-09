import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';

import SearchUI from './SearchUI';

class Search extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { cards: [] };
  }

  handleChange(e) {
    // TODO debounce
    console.log(e);
    const query = e.target.value;

    // fetch from elasticsearch
    fetch('http://localhost:9200/cards/_search', {
      body: JSON.stringify({
        "query": {
          "match": {
            "name": {
              "query": query,
              "operator": "and"
            }
          }
        }
      }),
      headers: new Headers({
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }),
      method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
      console.log('data', data);
      this.setState({ cards: data.hits.hits.map(card => card._source) });
    })
    .catch(err => console.error('err', err));
  }

  render() {
    return (
      <SearchUI {...{
        cards: this.state.cards,
        handleChange: this.handleChange
      }}/>
    );
  }
}

export default Search;
