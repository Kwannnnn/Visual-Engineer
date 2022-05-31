import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import ReactNodeBuilder from '../../util/ReactNodeBuilder';
import ToolboxItem from './ToolboxItem';

interface Listing {
    group?: string,
    subsets?: Listing[],
    items?: Item[],
    subsetNbr?: number
  }

interface Item {
    name: string;
}

function ToolboxList(prop: {listing: Listing[], subsetNbr: number}) {
  const listBuilder = new ReactNodeBuilder();
  const subsetBuilder = new ReactNodeBuilder();
  const itemBuilder = new ReactNodeBuilder();

  if (!prop.listing || prop.listing === null || prop.listing.length < 1) {
    return <>ERROR: Items could not be rendered</>;
  }

  const subset = prop.subsetNbr > 3 ? 3 : prop.subsetNbr;

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
        const newSize = subset + 1;
        subsetBuilder.append(<ToolboxList listing={listing.subsets} subsetNbr={newSize} />);
      }
      if (listing.items) {
        listing.items.forEach((item) => {
          itemBuilder.append(<ToolboxItem name={item.name} />);
        });
      }

      let size: string;
      switch (subset) {
        case 1:
          size = 'text-lg';
          break;
        case 2:
          size = 'text-md';
          break;
        case 3:
          size = 'text-sm';
          break;
        default:
          size = '';
      }

      listBuilder.append(
        <div id={`listing-${listing.group}`}>
          <div
            className={`hover:opacity-60 p-1 transition-all cursor-pointer select-none flex justify-between hover:pl-2 ${size}`}
            role="button"
            tabIndex={0}
            onClick={() => toggleIconRotation()}
            onKeyDown={undefined}
            id={`listing-${listing.group.replace(' ', '_')}-btn`}
          >
            <p className={`${subset === 3 ? 'font-medium' : 'font-bold'}`}>{listing.group}</p>
            <div className="align-middle">
              <FontAwesomeIcon icon={faAngleRight} className={`transition-all duration-300 ml-2 ${rotation}`} />
            </div>
          </div>
          <div className={`mb-2 ${visible ? 'hidden' : ''}`} id={`listing-${listing.group.replace(' ', '_')}-subset`}>
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
