//FIXME: This class is no longer used
import React from 'react';
import { Node } from 'react-flow-renderer';

export interface Listing {
  name: string; // name of the property
  type: string; // data type of the property
  value?: string; // value of the property
}

interface PropertiesListProps {
  listing: Listing[];
  currentNode: Node | null;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function getPropertyValue(node: Node | null, propName: string) {
  if (!node) return '';

  const propKey = Object.keys(node.data).find((key) => key === propName);
  const value = propKey ? node.data[propKey] : '';

  return value;
}

export default function PropertiesList(props: PropertiesListProps) {
  const { listing, currentNode, handleChange } = props;
  console.log(listing);

  const propertiesList = listing.map((p, i) => {
    p.value = getPropertyValue(currentNode, p.name);

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
  });

  return <div>{propertiesList}</div>;
}
