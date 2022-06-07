import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
