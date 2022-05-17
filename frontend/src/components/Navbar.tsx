import React from 'react';
import { Outlet } from 'react-router-dom';

export default function Navbar() {
  return (
    <>
      <nav className="flex-none">
        <div className="bg-red-500">
          <h1>Navbar</h1>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
