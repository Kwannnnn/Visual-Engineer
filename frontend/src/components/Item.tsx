import React from 'react';
import { useDrag } from 'react-dnd';

interface ItemProps {
  className?: string;
  tag: string;
  name: string;
}

function Item({ className, tag, name }: ItemProps) {
  const [, drag] = useDrag({
    type: 'item',
    item: { tag, name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      id={tag}
      className={`bg-slate-50 border-2 border-black ${className}`}
    >
      <div>{tag}</div>
      <div>{name}</div>
    </div>
  );
}

export default Item;
