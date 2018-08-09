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
    // this.addDisplayInfo.bind(this);
    this.createRenderedTreeStructure.bind(this);
    this.dayMapper.bind(this);
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
    this.dayMapper(sorted);
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

  /**
   *
   *  Update day['subtitle'] w/ day, daynum, calculated date/ range, day of week
   *
   */
  // addDisplayInfo(tree) {
  //   return tree.map((day, index) => {
  //     day.subtitle = `Day ${day.daynum} ${day.day}`;
  //     if (day.children && day.children.length > 1) {
  //       // parent node
  //       day.daynum = index + 1;
  //       day.subtitle = `Day ${day.daynum} ${day.day}`;
  //       // iterate on children[] -set daynum
  //       // first child is the same index as the parent/ (same day)
  //       let parentIdx = index + 1;
  //       for (let i = 0; i < day.children.length; i += 1) {
  //         day.children[i].subtitle = `Day ${parentIdx} ${day.day}`;
  //         parentIdx += 1;
  //       }
  //     } else if (day.children && day.children.length === 1) {
  //       // parent with one child
  //       day.children[0].subtitle = `Day ${index} ${day.day}`;
  //     }
  //     return day;
  //   });
  // }

  dayMapper(tree) {
    let totalDays = 0;
    let indexOfLastChild = null;
    let treeIdx = 0;
    let recentParent = 0;
    return tree.map((day, index) => {
      treeIdx += 1;
      recentParent = index + 1;
      totalDays += 1;

      if (day.children) {
        const children = day.children;
        totalDays = children.length;
        indexOfLastChild = children.length - 1;
        day.subtitle = `Day ${treeIdx} totalDays ${treeIdx} - ${totalDays}`; // add latchildofindex here w/ ter

        for (let i = 0; i < children.length; i += 1) {
          if (i === 0) {
            children[i].subtitle = `Day ${treeIdx}`;
          } else {
            treeIdx += 1;
            children[i].subtitle = `Day ${treeIdx}`;
          }
        }
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
            // const tree = this.addDisplayInfo(treeData);
            const tree = this.dayMapper(treeData);
            this.setState({ treeData: tree });
          }}
          generateNodeProps={(rowInfo) => {
            const { node, path, treeIndex } = rowInfo;
            // this.addDisplayInfo(this.state.treeData);
            // node.daynum = path[0];
            // node.subtitle = `${node.day}, Day ${node.daynum}, Cal. Day, DayOfWk`;
            this.dayMapper(this.state.treeData);
            // console.log('node >', node);
            // console.log('path >', path);
            // console.log('treeData', this.state.treeData);
            // console.log('treeIndex', treeIndex); // doesnt count hidden nodes
            // console.log('rowInfo', rowInfo);

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
