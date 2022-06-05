import React from 'react';

interface Listing {
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
    <div className="flex flex-col" key={p.name}>
      <label htmlFor={`sidebar-prop-${i}`}>
        {p.name}
        <input type="text" id={`sidebar-prop-${i}`} className="rounded-xl w-full bg-gray-200 px-3 py-2" />
      </label>
    </div>
  ));

  return <form className="space-y-4">{propertiesList}</form>;
}
