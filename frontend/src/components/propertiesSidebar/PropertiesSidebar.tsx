import React from 'react';
import { faX, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropertiesList from './PropertiesList';

interface PropertiesSidebarProps {
  className?: string;
  heading?: string;
  initialProperties?: any;
  onClose: () => void;
}

function PropertiesSidebar(props: PropertiesSidebarProps) {
  const {
    className = '', heading = '', initialProperties = [], onClose,
  } = props;

  return (
    <aside className={`w-full h-full flex bg-white pt-3 pb-12 px-6 overflow-y-auto border-l-4 rounded-sm relative ${className}`}>
      <button
        id="close-sidebar-btn"
        className="absolute top-3 right-3 text-gray-900 hover:bg-gray-100 rounded-lg text-sm px-3 py-2 cursor-pointer"
        type="button"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faX} size="sm" />
      </button>

      <h2 id="siderbar-item-type" className="text-xl font-semibold mb-2">{heading}</h2>

      <div className="flex space-x-2 w-full mb-8">
        <button id="save-component-btn" className="rounded-xl p-2 shadow-sm hover:shadow-md border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-700 py-2 cursor-pointer mt-auto" type="button">
          <FontAwesomeIcon icon={faTrash} />
          <p className="hidden md:inline"> Save</p>
        </button>
        <button id="delete-component-btn" className="rounded-xl p-2 shadow-sm hover:shadow-md border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-700 py-2 cursor-pointer mt-auto" type="button">
          <FontAwesomeIcon icon={faTrash} />
          <p className="hidden md:inline"> Delete</p>
        </button>
      </div>

      <div id="sidebar-properties-list" className="w-full">
        <PropertiesList listing={initialProperties} />
      </div>
    </aside>
  );
}

export default PropertiesSidebar;
