import React, { Component } from 'react';
import { connect } from 'react-redux';
import normalize from 'json-api-normalizer';
import build from 'redux-object';
import SortableTree from 'react-sortable-tree';

import { fetchJSON } from '../actions/fetchAction';
import store from '../store/store';

class Drag extends Component {

  componentWillMount() {
    store.dispatch(fetchJSON());
  }

  componentWillReceiveProps(newProps, props) {
    console.log('newprops', newProps.trips);
  }


  render() {
    return (
      <div>
        DRAGG DROP
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let trips = state.fetch.trips;

  if (trips) {
    const normalizeData = normalize(state.fetch.trips);
    const proposalObj = build(normalizeData, 'proposal', '23778');
    trips = proposalObj;
  }
  return { trips };
};


export default connect(mapStateToProps)(Drag);
