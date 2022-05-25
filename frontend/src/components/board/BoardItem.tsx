/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useDrag } from 'react-dnd';
import ItemTypes from './ItemTypes';

interface BoardItemProps {
  className?: string;
  tag: string;
  name: string;
  top: number;
  left: number;
  setCanDrag: (canDrag: boolean) => void;
}

function BoardItem({
  className, tag, name, top, left, setCanDrag,
}: BoardItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BOARD_ITEM,
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    !isDragging ? (
      <div
        ref={drag}
        id={tag}
        onMouseDown={() => setCanDrag(false)}
        className={`bg-slate-50 border-2 border-black absolute ${className}`}
        style={{ top, left }}
      >
        <div>{tag}</div>
        <div>{name}</div>
      </div>
    )
      : null);
}

export default BoardItem;
