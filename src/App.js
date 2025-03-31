import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Dishes from './components/Dishes';
import Menu from './components/Menu'; 
import Kitchen from './components/Kitchen';
import Branches from './components/Branches';
import NewDish from './components/NewDish';
import Sales from './components/Sales';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu/:businessId/:tableNumber/:branchId" element={<Menu />} />
        <Route path="/platillos/nuevo" element={<NewDish />} />
        <Route path="/platillos" element={<Dishes />} />
        <Route path="/kitchen/:branchId" element={<Kitchen />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/ventas" element={<Sales />} />
      </Routes>
    </Router>
  );
}

export default App;
