import React from 'react';

export interface Listing {
  name: string;
  type: string;
  value?: string; // or any?
}

interface PropertiesList {
  listing: Listing[];
}

export default function PropertiesList(props: PropertiesList) {
  const { listing } = props;
  const propertiesList = listing.map((p, i) => (
    <div className="flex flex-col overflow-y-auto" key={p.name}>
      <label htmlFor={`sidebar-prop-${i}`}>
        {p.name}
        <input type={p.type} id={`sidebar-prop-${i}`} className="focus:outline-blue-400 focus:outline-offset-m2 rounded-xl w-full bg-gray-200 px-3 py-2" />
      </label>
    </div>
  ));

  return <form className="space-y-4">{propertiesList}</form>;
}
