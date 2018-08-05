This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).


Things of interest
react-app/
├── actions/
├── reducers/
├── store/
├── components/
    ├── </Drag> [mapStateToProps and connect]
├── more files...


Drag.js
- exports the drag component that renders the react-sortable-tree
  - pulls in normalized data, sorts it and generates a new array with days mapped to parent/ child relationships for initial rendering
- it also mapsStateToProps
- connects component to store


git clone
inside the folder, 
    'npm install' for depenedencies
npm start will run app on localhost:3000

