import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faCube } from '@fortawesome/free-solid-svg-icons';
import ReactNodeBuilder from '../util/ReactNodeBuilder';

interface ReqProp {
  id: string;
  className?: string;
  items: Listing;
}

interface Item {
  name: string;
}

interface Listing {
  group?: string,
  children?: Listing[],
  items?: Item[]
}

function renderItemList(items: Listing): React.ReactNode {
  const listBuilder = new ReactNodeBuilder('m-2 p-1');
  const listItemBuilder = new ReactNodeBuilder();
  if (!items || items === null) return <>ERROR: Items could not be rendered</>;

  if (items.group) {
    if (items.children) {
      items.children.forEach((c) => {
        listItemBuilder.append(renderItemList(c));
      });
    }
  }
  if (items.items) {
    items.items.forEach((i) => {
      listItemBuilder.append(
        <div><FontAwesomeIcon icon={faCube} /> {i.name} {listBuilder.build()}</div>
      );
    });
  }
  listBuilder.append(
    <div><FontAwesomeIcon icon={faPlusSquare} /> {items.group}{listItemBuilder.build()}</div>
  );
  /*
  if (items.children) {
    items.children.forEach((c) => {
      listBuilder.append(renderItemList(c));
    });
  } else if (items.items) {
    items.items.forEach((i) => {
      listBuilder.append(
        <div><FontAwesomeIcon icon={faCube} /> {i.name} {listBuilder.build()}</div>
      );
    });
  }
  */

  return listBuilder.build();
}

function Toolbox({ className, items, id }: ReqProp) {
  return (
    <div className={`overflow-auto rounded-md w-full h-full ${className}`} id={id}>
      {
        renderItemList(items)
      }
    </div>
  );
}

export default Toolbox;
