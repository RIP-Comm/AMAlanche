import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from '../pages/home';

function Router() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HelmetProvider>
  );
}

export default Router;
