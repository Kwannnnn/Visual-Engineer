import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
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
    const [visible, setVisibility] = useState<boolean>(false);
    const [image, setIcon] = useState<IconDefinition>(faAngleRight);

    const toggleVisibility = () => {
      if (visible) {
        setVisibility(false);
        setIcon(faAngleRight);
      } else {
        setVisibility(true);
        setIcon(faAngleDown);
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
            onClick={() => toggleVisibility()}
            onKeyDown={undefined}
            id={`listing-${listing.group}-btn`}
          >
            <p className="font-bold">{` ${listing.group}`}</p>
            <FontAwesomeIcon icon={image} />
          </div>
          <div className={`transition ${visible ? '' : 'hidden'}`} id={`listing-${listing.group}-subset`}>
            {subsetBuilder.build()}
            <div className="mb-3">
              {itemBuilder.build()}
            </div>
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
