import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchJSON } from '../actions/fetchAction';

class Drag extends Component {

  componentWillMount() {
    this.props.fetchJSON();
    console.log('component willd mount');
    console.log(this.props);
  }

  render() {
    return (
      <div>
        THIS IS DRAGG DROP
      </div>
    );
  }
}

const mapStateToProps = state => ({
  trips: state.fetch.trips,
});

export default connect(mapStateToProps, { fetchJSON })(Drag)
;
