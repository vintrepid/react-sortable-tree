const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET':
      console.log('GET REDUCER CALLED!');
      break;
    default:
  }
};

module.exports = reducer;
