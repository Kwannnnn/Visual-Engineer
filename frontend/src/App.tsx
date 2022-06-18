import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';

function App() {
  useEffect(() => {
    localStorage.removeItem('currentBoard');
    localStorage.removeItem('boards');
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="/projects" element={<Projects />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
