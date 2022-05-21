import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import ReactNodeBuilder from '../util/ReactNodeBuilder';
import ToolboxItem from './ToolboxItem';

interface Listing {
    group?: string,
    subsets?: Listing[],
    items?: Item[]
  }

interface Item {
    name: string;
}

function ToolboxList(prop: {listing: Listing[]}) {
  const listBuilder = new ReactNodeBuilder();
  const subsetBuilder = new ReactNodeBuilder();
  const itemBuilder = new ReactNodeBuilder();

  if (!prop.listing || prop.listing === null || prop.listing.length < 1) {
    return <>ERROR: Items could not be rendered</>;
  }

  prop.listing.forEach((listing) => {
    const [rotation, setIconRotation] = useState<string>('');
    const [visible, toggleVisibility] = useState<boolean>(false);

    const toggleIconRotation = () => {
      if (visible) {
        setIconRotation('');
        toggleVisibility(false);
      } else {
        setIconRotation('rotate-90');
        toggleVisibility(true);
      }
    };

    if (listing.group) {
      if (listing.subsets) {
        subsetBuilder.append(<ToolboxList listing={listing.subsets} />);
      }
      if (listing.items) {
        listing.items.forEach((item) => {
          itemBuilder.append(<ToolboxItem name={item.name} />);
        });
      }

      listBuilder.append(
        <div id={`listing-${listing.group}`}>
          <div
            className="hover:opacity-60 p-1 transition-all cursor-pointer select-none flex justify-between hover:pl-2"
            role="button"
            tabIndex={0}
            onClick={() => toggleIconRotation()}
            onKeyDown={undefined}
            id={`listing-${listing.group.replace(' ', '_')}-btn`}
          >
            <p className="font-bold">{listing.group}</p>
            <div className="align-middle">
              <FontAwesomeIcon icon={faAngleRight} className={`transition-all duration-300 ml-2 ${rotation}`} />
            </div>
          </div>
          <div className={`mb-2 ${visible ? '' : 'hidden'}`} id={`listing-${listing.group.replace(' ', '_')}-subset`}>
            {subsetBuilder.build()}
            {itemBuilder.build()}
          </div>
        </div>
      );
    }
  });

  return (
    <>
      {listBuilder.build()}
    </>
  );
}

export default ToolboxList;
