import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/home';
import Login from '../pages/login';
import Signup from '../pages/signup';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default Router;
