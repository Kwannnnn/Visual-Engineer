import React from 'react';
import Item from './Item';

export const Items = [
  {
    tag: 'tag1',
    name: 'item1',
  },
  {
    tag: 'tag2',
    name: 'item2',
  },
  {
    tag: 'tag3',
    name: 'item3',
  },
  {
    tag: 'tag4',
    name: 'item4',
  }
];

function ItemsList() {
  return (
    <div className="overflow-y-auto py-4 rounded">
      {Items.map((item) => (
        <Item key={item.tag} tag={item.tag} name={item.name} />
      ))}
    </div>
  );
}

export default ItemsList;
