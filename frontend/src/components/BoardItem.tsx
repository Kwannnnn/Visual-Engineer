import React from 'react';
import { useDrag } from 'react-dnd';
import ItemTypes from './ItemTypes';

interface BoardItemProps {
  className?: string;
  tag: string;
  name: string;
  top: number;
  left: number;
}

function BoardItem({
  className, tag, name, top, left,
}: BoardItemProps) {
  const [, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} id={tag} className={`bg-slate-50 border-2 border-black absolute ${className}`} style={{ top, left }}>
      <div>{tag}</div>
      <div>{name}</div>
    </div>
  );
}

export default BoardItem;
