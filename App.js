import React from 'react';

import Firebase, { FirebaseContext } from './src/Firebase/index';

import Routes from './src/routes'

const App = ()  => {
  console.disableYellowBox = true;
  return (
    <FirebaseContext.Provider value={new Firebase()}>
      <Routes/>
    </FirebaseContext.Provider>
  );
};

export default App;
