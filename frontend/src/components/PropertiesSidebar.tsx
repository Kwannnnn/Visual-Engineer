import React from 'react';
import { faX, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropertiesList from './PropertiesList';

interface PropertiesSidebarProps {
  className?: string;
}

const sampleData = [
  {
    name: 'Tag',
    value: 'SX69',
  },
  {
    name: 'Length',
    value: 'SX69',
  },
  {
    name: 'Width',
    value: '69',
  },
  {
    name: 'Depth',
    value: '99.6',
  },
  {
    name: 'Diameter',
    value: '6.69',
  },
  {
    name: 'Type',
    value: 'Pump',
  }
];

function PropertiesSidebar({ className }: PropertiesSidebarProps) {
  const type = sampleData.find((item) => item.name.toLowerCase() === 'type')?.value || 'Unknown';

  return (
    <aside className={`hidden sm:flex flex-col items-center w-full h-full bg-white overflow-y-auto py-2 border-2 rounded-sm relative ${className}`}>
      <button id="close-sidebar-btn" className="text-gray-700 hover:bg-gray-200 px-2 py-1 cursor-pointer rounded-lg absolute top-1 right-1" type="button">
        <FontAwesomeIcon icon={faX} />
      </button>

      <h1 id="siderbar-item-type" className="text-lg font-semibold mb-6">{type}</h1>

      <div id="sidebar-properties-list" className="w-5/6">
        <PropertiesList listing={sampleData} />
      </div>
      <div className="flex flex-1 w-full justify-center">
        <button id="delete-component-btn" className="rounded-xl w-5/6 border-2 border-red-600 hover:bg-red-100 text-red-600 hover:text-red-700 py-2 cursor-pointer mt-auto" type="button">
          <FontAwesomeIcon icon={faTrash} />
          <p className="hidden md:inline"> Delete</p>
        </button>
      </div>
    </aside>
  );
}

export default PropertiesSidebar;
