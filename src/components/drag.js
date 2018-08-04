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
    // action dispatch to fetch json-api data from store
    store.dispatch(fetchJSON());
  }

  componentWillReceiveProps(nextProps, prevState) {
    // _sortBy() :: days by not brief and daynum
    const sorted = sortBy(nextProps.trips.days, ['!brief', 'daynum']);
    this.addDisplayInfo(sorted);
    // set state with initial tree structure
    this.setState({ treeData: this.createRenderedTreeStructure(sorted) });
  }

  createRenderedTreeStructure(array) {
    const treeStructure = [];
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].brief) {
        treeStructure.push(array[i]);
      } else {
        const day = treeStructure[treeStructure.length - 1];
        day.children ? day.children.push(array[i]) : day.children = [array[i]];
      }
    }
    return treeStructure;
  }

  addDisplayInfo(array) {
    // add day['subtitle'] with day, daynum, calculated date/ range, day of week
    // subtitle is a react-sortable-tree built-in field
    const updatedDays = array.map((day) => {
      day.subtitle = `${day.day}, Day ${day.daynum}, Cal. Day, DayOfWk`;
      return day;
    });
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
