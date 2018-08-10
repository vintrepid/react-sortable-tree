import React, { Component } from 'react';
import { connect } from 'react-redux';

import normalize from 'json-api-normalizer';
import build from 'redux-object';
import SortableTree, { removeNodeAtPath, walk } from 'react-sortable-tree';
import sortBy from 'lodash.sortby';

import { fetchJSON } from '../actions/fetchAction';
import store from '../store/store';

class Drag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [],
      startDate: '',
    };
    this.createRenderedTreeStructure.bind(this);
    this.addDayInfo.bind(this);
  }

  componentWillMount() {
    // action dispatch to fetch json-api data from store
    store.dispatch(fetchJSON());
  }

  componentWillReceiveProps(nextProps, prevState) {
    // lodash _sortBy(days) :: by not brief and daynum
    const sorted = sortBy(nextProps.trips.days, ['!brief', 'daynum']);
    // add calculated days/ headers
    // this.addDisplayInfo(sorted);
    this.addDayInfo(sorted);
    // set state with initial tree structure
    this.setState({
      treeData: this.createRenderedTreeStructure(sorted),
      startDate: nextProps.trips.startsOn,
    });
  }

  // [{T}{F}{T}{F}{F}{T}..] => [ { T[{F}]} { T[{F}{F}]}..]
  createRenderedTreeStructure(tree) {
    const treeStructure = [];
    for (let i = 0; i < tree.length; i += 1) {
      if (tree[i].brief) {
        treeStructure.push(tree[i]);
      } else {
        const day = treeStructure[treeStructure.length - 1];
        day.children ? day.children.push(tree[i]) : day.children = [tree[i]];
      }
    }
    return treeStructure;
  }

  addDayInfo(tree) {
    let totalDays = 0;
    let treeIndex = 0;

    return tree.map((day) => {
      treeIndex += 1;
      totalDays += 1;
      if (day.children) {
        const children = day.children;
        totalDays = treeIndex + (children.length - 1);
        const days = `${treeIndex}-${totalDays}`;
        day.subtitle = `Day ${treeIndex} Days ${totalDays === 0 || totalDays === 1 ? 1 : days}`;
        for (let i = 0; i < children.length; i += 1) {
          if (i === 0) {
            children[i].subtitle = `Day ${treeIndex}`;
          } else {
            treeIndex += 1;
            children[i].subtitle = `Day ${treeIndex}`;
          }
        }
      } else {
        day.subtitle = `Day ${treeIndex}`;
      }
      return day;
    });
  }

  render() {
    const getNodeKey = ({ treeIndex }) => treeIndex;

    return (
      <div className="drag">
        <SortableTree
          treeData={this.state.treeData}
          onChange={(treeData) => {
            const tree = this.addDayInfo(treeData);
            this.setState({ treeData: tree });
          }}
          generateNodeProps={(rowInfo) => {
            const { path } = rowInfo;
            this.addDayInfo(this.state.treeData);

            return ({
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
            });
          }
        }
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


    // walk({
    //   treeData,
    //   getNodeKey,
    //   callback: (rowInfo) => {
    //     if (rowInfo.node.hasOwnProperty('daynum')) {
    //       console.log('inside walk rowInfo', rowInfo);
    //       console.log('node.daynum', rowInfo.node.daynum);
    //       rowInfo.node.subtitle = `Day ${rowInfo.node.daynum} ${rowInfo.node.day}`;
    //     }
    //   },
    //   ignoreCollapsed: true,
    // });
