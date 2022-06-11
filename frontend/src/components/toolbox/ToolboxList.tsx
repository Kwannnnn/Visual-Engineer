import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import ReactNodeBuilder from '../../util/ReactNodeBuilder';
import ToolboxItem from './ToolboxItem';

interface Listing {
    group?: string,
    subsets?: Listing[],
    items?: Item[],
    subsetNbr?: number
  }

interface Item {
  type: string;
  displayName: string;
}

function ToolboxList(prop: {listing: Listing[], subsetNbr: number}) {
  const listBuilder = new ReactNodeBuilder();
  const subsetBuilder = new ReactNodeBuilder();
  const itemBuilder = new ReactNodeBuilder();

  const subset = prop.subsetNbr > 3 ? 3 : prop.subsetNbr;

  prop.listing.forEach((listing) => {
    const [visible, toggleVisibility] = useState<boolean>(false);

    const toggleIconRotation = useCallback(() => {
      if (visible) {
        toggleVisibility(false);
      } else {
        toggleVisibility(true);
      }
    }, [visible]);

    if (listing.group) {
      if (listing.subsets) {
        const newSize = subset + 1;
        subsetBuilder.append(<ToolboxList listing={listing.subsets} subsetNbr={newSize} />);
      }
      if (listing.items) {
        listing.items.forEach((item) => {
          itemBuilder.append(<ToolboxItem type={item.type} displayName={item.displayName} />);
        });
      }

      listBuilder.append(
        <div data-cy={`listing-${listing.group}`}>
          <div
            className={classNames('hover:opacity-60 p-1 transition-all cursor-pointer select-none flex justify-between hover:pl-2', {
              'text-lg': subset === 1,
              'text-md': subset === 2,
              'text-sm': subset === 3,
            })}
            role="button"
            tabIndex={0}
            onClick={() => toggleIconRotation()}
            onKeyDown={undefined}
            data-cy={`listing-${listing.group.replace(' ', '_')}-btn`}
          >
            <p className={`${subset === 3 ? 'font-medium' : 'font-bold'}`}>{listing.group}</p>
            <div className="align-middle">
              <FontAwesomeIcon
                icon={faAngleRight}
                className={classNames('transition-all duration-300 ml-2', {
                  'rotate-90': !visible,
                })}
              />
            </div>
          </div>
          <div
            data-cy={`listing-${listing.group.replace(' ', '_')}-subset`}
            className={classNames('mb-2', { hidden: visible })}
          >
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
