import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import ReactNodeBuilder from '../util/ReactNodeBuilder';
import ToolboxItem from './ToolboxItem';
import 'tw-elements';

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

    const toggleIconRotation = () => {
      if (rotation === 'rotate-90') {
        setIconRotation('');
      } else {
        setIconRotation('rotate-90');
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
            className="hover:opacity-50 transition-all cursor-pointe select-none flex justify-between"
            role="button"
            tabIndex={0}
            onClick={() => toggleIconRotation()}
            onKeyDown={undefined}
            id={`listing-${listing.group.replace(' ', '_')}-btn`}
            data-bs-toggle="collapse"
            aria-expanded="false"
            aria-controls={`listing-${listing.group.replace(' ', '_')}-subset`}
            data-bs-target={`#listing-${listing.group.replace(' ', '_')}-subset`}
          >
            <p className="font-bold">{listing.group}</p>
            <div className="align-middle">
              <FontAwesomeIcon icon={faAngleRight} className={`transition-all duration-300 ${rotation}`} />
            </div>
          </div>
          <div className="mb-2 collapse" id={`listing-${listing.group.replace(' ', '_')}-subset`}>
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
