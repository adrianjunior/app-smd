import React from 'react';
import { Root } from "native-base";

import Firebase, { FirebaseContext } from './src/Firebase/index';

import Routes from './src/routes'

const App = ()  => {
  console.disableYellowBox = true;
  return (
    
    <FirebaseContext.Provider value={new Firebase()}>
      <Root>
        <Routes/>
      </Root>
    </FirebaseContext.Provider>  
    
  );
};

export default App;
