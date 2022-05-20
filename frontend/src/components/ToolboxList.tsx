import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faPlusSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
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
    const [image, setIcon] = useState<IconDefinition>(faPlusSquare);

    const toggleVisibility = () => {
      if (visible) {
        setVisibility(false);
        setIcon(faPlusSquare);
      } else {
        setVisibility(true);
        setIcon(faPlus);
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
          <span
            className="hover:opacity-50 transition-all cursor-pointe select-none"
            role="button"
            tabIndex={0}
            onClick={() => toggleVisibility()}
            onKeyDown={undefined}
            id={`listing-${listing.group}-btn`}
          >
            <FontAwesomeIcon icon={image} />
            {` ${listing.group}`}
          </span>
          <div className={visible ? '' : 'hidden'} id={`listing-${listing.group}-subset`}>
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
