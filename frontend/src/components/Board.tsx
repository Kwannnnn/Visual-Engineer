import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Item from './Item';
import { Items } from './ItemsList';

interface BoardProps {
  className?: string;
}

function Board({ className }: BoardProps) {
  const [board, setBoard] = useState<{ tag: string; name: string }[]>([]);

  const addItemToBoard = (itemName: string) => {
    const item = Items.find((i) => i.name === itemName);

    if (item === undefined) {
      return;
    }

    setBoard((boardArray) => [...boardArray, item]);
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'item',
    drop: (item: typeof Item) => addItemToBoard(item.name),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <main ref={drop} className={`overflow-auto ${className}`}>
      <div className="flex flex-col">
        {board.map((item) => (
          <Item
            key={item.tag}
            tag={item.tag}
            name={item.name}
            className="px-3 bg-gray-50 rounded w-24 h-16 flex flex-col justify-center items-center"
          />
        ))}
      </div>
    </main>
  );
}

export default Board;
