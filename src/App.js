import React from 'react';
// import LanguageSelect from './components/LanguageSelect';
import TranslateGoogleApi from './components/TranslateGoogleApi';
// require('dotenv').config();

import './App.css';

function App() {
  return (
    <div className='App'>
      {/* <LanguageSelect /> */}
      <TranslateGoogleApi />
    </div>
  );
}

export default App;
