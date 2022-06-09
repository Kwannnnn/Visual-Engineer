import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  faSearch,
  faPlus,
  faUserCircle,
  faBars,
  faTableColumns
} from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/images/logo.svg';

export default function Navbar() {
  return (
    <>
      <div className="flex justify-between items-center bg-slate-200 border-b border-slate-200 px-5 py-7">
        <button className="lg:hidden text-gray-900 hover:bg-gray-100 rounded-lg text-sm px-4 py-2 cursor-pointer" type="button">
          <FontAwesomeIcon icon={faTableColumns} size="lg" />
        </button>
        <header className="mx-auto sm:mx-0">
          <img
            src={logo}
            alt="Witeveen+Bos Logo"
            className="h-12 w-auto"
          />
        </header>
        <button className="lg:hidden text-gray-900 hover:bg-gray-100 rounded-lg text-sm px-4 py-2 cursor-pointer" type="button">
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
        <nav className="hidden lg:block">
          <ul className="flex items-center space-x-5">
            <li>
              <button className="py-2 px-5 text-sm shadow-md font-medium text-white focus:outline-none bg-wb-blue hover:bg-sky-600 rounded-xl" type="button">
                <FontAwesomeIcon icon={faPlus} className="pr-2" />
                New Project
              </button>
            </li>
            <li>
              <form className="flex items-center bg-neutral-50 py-2 rounded-xl text-sm text-slate-600">
                <FontAwesomeIcon icon={faSearch} className="pl-3 pr-2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent outline-none"
                />
              </form>
            </li>
            <li className="text-slate-800 hover:bg-gray-300 rounded-full text-sm px-2 py-2 cursor-pointer">
              <FontAwesomeIcon icon={faUserCircle} size="2x" />
            </li>
          </ul>
        </nav>
      </div>
      <Outlet />
    </>
  );
}
