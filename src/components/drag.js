import React, { Component } from 'react';
import data from '../data.json';

export default class drag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trips: {},
    };
  }

  componentDidMount() {
    console.log(data);
  }

  render() {
    return (
      <div>
        THIS IS DRAGG DROP
      </div>
    );
  }
}
