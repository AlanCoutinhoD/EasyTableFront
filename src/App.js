import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Dishes from './components/Dishes';
import Menu from './components/Menu'; 
import Kitchen from './components/Kitchen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu/:businessId/:tableNumber/:branchId" element={<Menu />} />
        <Route path="/platillos" element={<Dishes />} />
        <Route path="/kitchen" element={<Kitchen />} />
      </Routes>
    </Router>
  );
}

export default App;
