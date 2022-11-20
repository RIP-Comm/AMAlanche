import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './router/root';

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
