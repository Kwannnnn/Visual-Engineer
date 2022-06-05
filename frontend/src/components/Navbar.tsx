import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  faSearch,
  faFileCirclePlus,
  faUserCircle,
  faBars,
  faTableColumns
} from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/images/wb-logo.png';

export default function Navbar() {
  return (
    <>
      <div className="flex justify-between items-center bg-white p-5 border-b">
        <button className="lg:hidden text-gray-900 hover:bg-gray-100 rounded-lg text-sm px-4 py-2 cursor-pointer" type="button">
          <FontAwesomeIcon icon={faTableColumns} size="lg" />
        </button>
        <header className="mx-auto sm:mx-0">
          <img
            src={logo}
            alt="WB logo"
            className="max-h-6 sm:max-h-10"
          />
        </header>
        <button className="lg:hidden text-gray-900 hover:bg-gray-100 rounded-lg text-sm px-4 py-2 cursor-pointer" type="button">
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
        <nav className="hidden lg:block">
          <ul className="flex items-center space-x-5">
            <li>
              <button className="py-2 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-xl border border-gray-200 hover:bg-gray-100 hover:text-blue-700" type="button">
                <FontAwesomeIcon icon={faFileCirclePlus} className="pr-2" />
                New Project
              </button>
            </li>
            <li>
              <form className="flex items-center bg-gray-200 py-2 rounded-xl text-sm text-gray-400">
                <FontAwesomeIcon icon={faSearch} className="pl-3 pr-2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent outline-none"
                />
              </form>
            </li>
            <li className="text-gray-900 hover:bg-gray-100 rounded-lg text-sm px-4 py-2 cursor-pointer">
              <FontAwesomeIcon icon={faUserCircle} size="lg" />
            </li>
          </ul>
        </nav>
      </div>
      <Outlet />
    </>
  );
}
