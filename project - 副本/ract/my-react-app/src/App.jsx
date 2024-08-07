//App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Circle from './pages/Circle';
import CircleDetail from './pages/CircleDetail';
import './axiosConfig';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/circles" element={<Circle />} />
        <Route path="/circle/:name" element={<CircleDetail />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
