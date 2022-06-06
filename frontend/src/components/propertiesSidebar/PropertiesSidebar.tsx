import React, { useState, useEffect } from 'react';
import { faX, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Node } from 'react-flow-renderer';

interface Listing {
  name: string; // name of the property
  type: string; // data type of the property
  value?: string; // value of the property
}
interface PropertiesSidebarProps {
  className?: string;
  initialProperties?: Listing[];
  currentNode: Node | null;
  onClose: () => void;
}

function getPropertyValue(node: Node | null, propName: string) {
  if (!node) return '';

  const propKey = Object.keys(node.data).find((key) => key === propName);
  const value = propKey ? node.data[propKey] : '';

  return value;
}

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  alert('form submitted');
}

function PropertiesSidebar(props: PropertiesSidebarProps) {
  const {
    className = '', initialProperties = [], onClose, currentNode,
  } = props;

  const [propValues, setPropValues] = useState<Listing[]>([]);

  useEffect(() => {
    setPropValues(initialProperties);
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProps: Listing[] = [];

    propValues.forEach((item) => {
      if (item.name === event.target.name) {
        item.value = event.target.value; // update the prop state
        currentNode!.data[item.name] = event.target.value; // update node state
      }

      newProps.push(item);
    });
    setPropValues(newProps);
  };

  const heading = currentNode?.data.type || 'Unknown';

  return (
    <aside className={`w-full h-full flex bg-white pt-3 pb-12 px-6 overflow-y-auto border-l-4 rounded-sm relative ${className}`}>
      <form onSubmit={handleSubmit}>
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
          <button id="save-component-btn" type="submit" className="rounded-xl p-2 shadow-sm hover:shadow-md border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-700 py-2 cursor-pointer mt-auto">
            <FontAwesomeIcon icon={faTrash} />
            <p className="hidden md:inline"> Save</p>
          </button>
          <button id="delete-component-btn" className="rounded-xl p-2 shadow-sm hover:shadow-md border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-700 py-2 cursor-pointer mt-auto" type="button">
            <FontAwesomeIcon icon={faTrash} />
            <p className="hidden md:inline"> Delete</p>
          </button>
        </div>

        <div id="sidebar-properties-list" className="w-full">
          {
            propValues.map((p, i) => {
              const value = getPropertyValue(currentNode, p.name);
              p.value = value;

              return (
                <div className="flex flex-col overflow-y-auto" key={p.name}>
                  <label htmlFor={`sidebar-prop-${i}`}>
                    {p.name}
                    <input
                      name={p.name}
                      type={p.type}
                      id={`sidebar-prop-${i}`}
                      value={p.value}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                      className="focus:outline-blue-400 focus:outline-offset-m2 rounded-xl w-full bg-blue-50 px-3 py-2 mt-1"
                    />
                  </label>
                </div>
              );
            })
          }
        </div>
      </form>
    </aside>

  );
}

export default PropertiesSidebar;
