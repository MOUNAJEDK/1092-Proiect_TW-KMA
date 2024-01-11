// App.js

import React from 'react';
import Login from '../src/components/Login';
import Navbar from '../src/components/Navbar';

const App = () => {
  return (
    <div className="app-container">
      <Navbar />
      <Login />
    </div>
  );
};

export default App;
