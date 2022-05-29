import React from 'react';

interface Listing {
  name: string;
  value: string; // or any?
}

export default function PropertiesList(prop: { listing: Listing[] }) {
  const propertiesList = prop.listing.map((p, i) => (
    <div className="flex flex-col" key={p.name}>
      <label htmlFor={`sidebar-prop-${i}`}>
        {p.name}
        <input type="text" id={`sidebar-prop-${i}`} defaultValue={p.value} className="rounded-xl w-full bg-gray-200 px-3 py-2" />
      </label>
    </div>
  ));

  return <form className="space-y-4">{propertiesList}</form>;
}
