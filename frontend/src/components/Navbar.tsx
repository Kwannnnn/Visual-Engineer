import React from 'react';
import { Outlet } from 'react-router-dom';
import logo from '../assets/images/wb-logo.png';

export default function Navbar() {
  return (
    <>
      <div className="flex justify-between items-center bg-white p-6 border-b border-gray-300">
        <header>
          <img
            src={logo}
            alt="WB logo"
            className="max-h-12"
          />
        </header>
        <nav>
          <ul className="flex items-center space-x-5">
            <li>Create</li>
            <li>
              <form className="flex bg-gray-300 h-10 pl-3 rounded-2xl">
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent outline-none text-gray-600"
                />
              </form>
            </li>
            <li>User</li>
          </ul>
        </nav>
      </div>
      <Outlet />
    </>
  );
}
