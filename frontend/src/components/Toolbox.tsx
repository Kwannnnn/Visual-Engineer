import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faCube, faPlus } from '@fortawesome/free-solid-svg-icons';
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

function handleListClick(): void {
  const [data, setData] = useState<Item[]>([]);
}

function renderItemList(items: Listing): React.ReactNode {
  const listBuilder = new ReactNodeBuilder('text-yellow-500');
  const listItemBuilder = new ReactNodeBuilder('text-green-500 mb-2');
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
        <>
          <div className="cursor-move">
            <FontAwesomeIcon icon={faCube} />
            {` ${i.name}`}
          </div>
          {listBuilder.build()}
        </>
      );
    });
  }
  listBuilder.append(
    <>
      <span
        className="hover:opacity-50 transition-all cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => { handleListClick(); }}
        onKeyDown={() => { handleListClick(); }}
      >
        <FontAwesomeIcon icon={faPlusSquare} />
        {` ${items.group}`}
      </span>
      {listItemBuilder.build()}
    </>
  );

  return listBuilder.build();
}

function Toolbox({ className, items, id }: ReqProp) {
  return (
    <div className={`overflow-auto rounded-md w-full h-ful m-2 p-2 ${className}`} id={id}>
      {
        renderItemList(items)
      }
    </div>
  );
}

export default Toolbox;
