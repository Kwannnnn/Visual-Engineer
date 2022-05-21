import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import BoardItem from './BoardItem';

interface BoardProps {
  className?: string;
}

const items = [
  {
    tag: 'PPP-1234',
    name: 'Plastic pipe',
  },
  {
    tag: 'PIP-2345',
    name: 'Iron pipe',
  },
  {
    tag: 'SCP-3456',
    name: 'Copper square pipe',
  },
  {
    tag: 'SAP-4567',
    name: 'Aluminum square pipe',
  },
  {
    tag: 'CAC-5678',
    name: '2A cleaner',
  },
  {
    tag: 'CHC-6789',
    name: 'F3 hot cleaner',
  }
];

function Board({ className }: BoardProps) {
  const [board, setBoard] = useState<{ tag: string; name: string }[]>([]);

  const addItemToBoard = (itemName: string) => {
    const item = items.find((i) => i.name === itemName);

    if (item === undefined) {
      return;
    }

    setBoard((boardArray) => [...boardArray, item]);
  };

  const [, drop] = useDrop(() => ({
    accept: 'item',
    drop: (item: { tag: string; name: string }) => addItemToBoard(item.name),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <main ref={drop} className={`overflow-auto ${className}`}>
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
    </main>
  );
}

export default Board;
