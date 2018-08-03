import React, { Component } from 'react';
import { connect } from 'react-redux';

import normalize from 'json-api-normalizer';
import build from 'redux-object';
import SortableTree, { removeNodeAtPath } from 'react-sortable-tree';
import sortBy from 'lodash.sortby';

import { fetchJSON } from '../actions/fetchAction';
import store from '../store/store';

class Drag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [],
    };
  }

  componentWillMount() {
    store.dispatch(fetchJSON());
  }

  componentWillReceiveProps(nextProps, prevState) {
    // sorting days by not brief and daynum
    const sorted = sortBy(nextProps.trips.days, ['brief', 'daynum']);
    // add subtitle property with calculated info.
    this.addDisplayInfo(sorted);

    this.setState({ treeData: sorted });
    console.log('newprops', nextProps.trips.days);
    console.log('========sorted========');
  }

  addDisplayInfo(array) {
    const updatedDays = array.map((day) => {
      day.subtitle = `${day.day}, Day ${day.daynum}, Cal. Day, DayOfWk`;
      return day;
    });
    console.log('addDisplay', updatedDays);
  }


  render() {
    const getNodeKey = ({ treeIndex }) => treeIndex;

    return (
      <div className="drag">
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
          generateNodeProps={({ node, path }) => ({
            buttons: [
              <button
                className="remove"
                onClick={() => {
                  this.setState(state => ({
                    treeData: removeNodeAtPath({
                      treeData: state.treeData,
                      path,
                      getNodeKey,
                    }),
                  }));
                }
                }
              >
                &times;
                </button>,
            ],
          })}
        />
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
