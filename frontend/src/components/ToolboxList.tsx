import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
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
        <div>
          <span
            className="hover:opacity-50 transition-all cursor-pointer text-yellow-500"
            role="button"
            tabIndex={0}
            onClick={undefined}
            onKeyDown={undefined}
          >
            <FontAwesomeIcon icon={faPlusSquare} />
            {` ${listing.group}`}
          </span>
          {subsetBuilder.build()}
          {itemBuilder.build()}
        </div>
      );
    }
  });

  /*
  prop.listing.forEach((item) => {
    if (item.group) {
      listBuilder.append(
        <span
          className="hover:opacity-50 transition-all cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={undefined}
          onKeyDown={undefined}
        >
          <FontAwesomeIcon icon={faPlusSquare} />
          {` ${item.group}`}
        </span>
      );
    }
    if (item.group && item.subsets) {
      // listBuilder.append(<ToolboxList listing={item.subsets} />);
    } else if (item.items) {
      prop.listing.forEach((i) => {
        i.items?.forEach((itm) => {
          listBuilder.append(
            <ToolboxItem name={itm.name} />
          );
        });
      });
    }
  });
  */

  return (
    <>
      {listBuilder.build()}
    </>
  );
}

export default ToolboxList;
