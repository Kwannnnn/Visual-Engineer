import React, { Ref, useState } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import BoardItem from './BoardItem';
import DropPlaceholder from './DropPlaceholder';
import ItemTypes from './ItemTypes';

interface BoardProps {
  className?: string;
  toolboxRef: Ref<HTMLElement>;
}

interface Item {
  tag: string;
  name: string;
  left: number;
  top: number;
}

const items: Item[] = [
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

function Board({ className, toolboxRef }: BoardProps) {
  const [board, setBoard] = useState<Item[]>([]);

  const updateBoard = (item: Item) => {
    const foundItem = board.find((i) => i.tag === item.tag);

    if (foundItem === undefined) {
      board.push(item);
    } else {
      const index = board.indexOf(foundItem);
      Object.assign(foundItem, item);
      board[index] = foundItem;
    }
    setBoard(board);
  };

  const [, drop] = useDrop<Pick<Item, 'name'>>(
    () => ({
      accept: ItemTypes.ITEM,
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      }),
      drop(item, monitor) {
        const foundItem = items.find((i) => i.name === item.name);

        if (foundItem === undefined) {
          return;
        }

        const delta = monitor.getClientOffset();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const toolboxWidth = (toolboxRef as any).current.clientWidth;

        if (delta) {
          const roundedLeft = Math.round(foundItem.left + delta.x) - toolboxWidth;
          const roundedTop = Math.round(foundItem.top + delta.y) - 25;

          const newItem = update(foundItem, {
            left: { $set: roundedLeft },
            top: { $set: roundedTop },
          });

          updateBoard(newItem);
        }
      },
    }),
    [board, setBoard]
  );

  return (
    <main className={`overflow-auto ${className}`}>
      <div className="flex flex-col relative">
        {board?.map((item) => (
          <BoardItem
            key={item.tag}
            tag={item.tag}
            name={item.name}
            className="px-3 bg-gray-50 w-32 h-24 flex flex-col justify-center items-center"
            top={item.top}
            left={item.left}
          />
        ))}
      </div>
      <DropPlaceholder innerRef={drop} />
    </main>
  );
}

export default Board;
