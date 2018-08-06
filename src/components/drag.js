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
      startDate: '',
    };
    this.addDisplayInfo.bind(this);
    this.createRenderedTreeStructure.bind(this);
  }

  componentWillMount() {
    // action dispatch to fetch json-api data from store
    store.dispatch(fetchJSON());
  }

  componentWillReceiveProps(nextProps, prevState) {
    // lodash _sortBy(days) :: by not brief and daynum
    const sorted = sortBy(nextProps.trips.days, ['!brief', 'daynum']);
    // add calculated days/ headers
    this.addDisplayInfo(sorted);
    // set state with initial tree structure
    this.setState({
      treeData: this.createRenderedTreeStructure(sorted),
      startDate: nextProps.trips.startsOn,
    });
  }

  // [{T}{F}{T}{F}{F}{T}..] => [ { T[{F}]} { T[{F}{F}]}..]
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
    console.log('addDisplayInfo');
    return array.map((day, index) => {
      if (day.children && day.children.length > 1) {
        // this is a parent node
        // set its daynum to the index + 1
        day.daynum = index + 1;
        day.subtitle = `Parent ${day.daynum}`;
        // loop the childrens array to set their daynum prop.
        for (let i = 0; i < day.children.length; i += 1) {
          const newDayNum = day.children[i].daynum = i + 1;
          day.children[i].subtitle = `Child ${newDayNum}`;
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
            const tree = this.addDisplayInfo(treeData);
            this.setState({ treeData: tree });
          }}
          generateNodeProps={(rowInfo) => {
            const { node, path, treeIndex } = rowInfo;
            // node.daynum = path[0];

            // node.subtitle = `${node.day}, Day ${node.daynum}, Cal. Day, DayOfWk`;
            console.log('node >', node);
            console.log('path >', path);
            console.log('treeData', this.state.treeData);
            console.log('treeIndex', treeIndex);
            console.log('rowInfo', rowInfo);

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
