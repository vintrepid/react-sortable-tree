import FETCH_JSON from './types';
import data from '../data.json';


export function fetchJSON() {
  return function (dispatch) {
    console.log('...fetching JSON', data);
    return dispatch({
      type: FETCH_JSON,
      payload: data,
    });
  };
}
