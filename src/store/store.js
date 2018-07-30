import { createStore } from 'redux';
import reducer from '../reducers/index';
import data from '../data.json';

const initialState = data;

const store = createStore(reducer, initialState);
store.subscribe(() => console.log('store updated', store));

export default store;
