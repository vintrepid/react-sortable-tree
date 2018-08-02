import React, { Component } from 'react';
import { Provider } from 'react-redux';
import 'react-sortable-tree/style.css';

import store from './store/store';
import Drag from './components/drag';
import './App.css';


class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Welcome to Wilderness Travels</h1>
          </header>
          <Drag />
        </div>
      </Provider>
    );
  }
}

export default App;
