import React from 'react';
import { useDrag } from 'react-dnd';
import ItemTypes from './ItemTypes';

interface BoardItemProps {
  className?: string;
  tag: string;
  name: string;
}

function BoardItem({ className, tag, name }: BoardItemProps) {
  const [, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} id={tag} className={`bg-slate-50 border-2 border-black ${className}`}>
      <div>{tag}</div>
      <div>{name}</div>
    </div>
  );
}

export default BoardItem;
