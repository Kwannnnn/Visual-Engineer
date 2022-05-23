import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import BoardItem from './BoardItem';
import DropPlaceholder from './DropPlaceholder';
import ItemTypes from './ItemTypes';

interface BoardProps {
  className?: string;
}

const items = [
  {
    tag: 'PPP-1234',
    name: 'Plastic pipe',
    left: 0,
    top: 0,
  },
  {
    tag: 'PIP-2345',
    name: 'Iron pipe',
    left: 0,
    top: 0,
  },
  {
    tag: 'SCP-3456',
    name: 'Copper square pipe',
    left: 0,
    top: 0,
  },
  {
    tag: 'SAP-4567',
    name: 'Aluminum square pipe',
    left: 0,
    top: 0,
  },
  {
    tag: 'CAC-5678',
    name: '2A cleaner',
    left: 0,
    top: 0,
  },
  {
    tag: 'CHC-6789',
    name: 'F3 hot cleaner',
    left: 0,
    top: 0,
  }
];

function Board({ className }: BoardProps) {
  const [board, setBoard] = useState<
    { tag: string; name: string; left: number; top: number }[]
  >([]);

  const [{ canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.ITEM,
      canDrop: () => true,
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      }),
      drop(item: any, monitor) {
        const foundItem = items.find((i) => i.name === item.name);

        if (foundItem === undefined) {
          return;
        }

        const delta = monitor.getInitialClientOffset();

        if (delta) {
          const roundedLeft = Math.round(foundItem.left + delta.x);
          const roundedTop = Math.round(foundItem.top + delta.y);

          const newItem = update(foundItem, {
            left: { $set: roundedLeft },
            top: { $set: roundedTop },
          });

          setBoard((boardArray) => [...boardArray, newItem]);
        }
      },
    }),
    [board, setBoard]
  );

  return (
    <main className={`overflow-auto ${className}`}>
      <div className="flex flex-col">
        {board?.map((item) => (
          <BoardItem
            key={item.tag}
            tag={item.tag}
            name={item.name}
            className="px-3 bg-gray-50 w-32 h-24 flex flex-col justify-center items-center"
          />
        ))}
      </div>
      <DropPlaceholder innerRef={drop} canDrop={canDrop} />
    </main>
  );
}

export default Board;
