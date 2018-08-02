import FETCH_JSON from '../actions/types';

const fetchReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_JSON:
      console.log('GET REDUCER CALLED!');
      console.log('payload', action.payload);
      return {
        ...state,
        trips: action.payload,
      };
    default:
      return state;
  }
};

export default fetchReducer;
