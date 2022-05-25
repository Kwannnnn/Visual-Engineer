/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ItemTypes from './ItemTypes';

interface BoardItemProps {
  className?: string;
  tag: string;
  name: string;
  top?: number;
  left?: number;
  setCanDrag?: (canDrag: boolean) => void;
  scale: number;
}

function BoardItem({
  className, tag, name, top, left, setCanDrag, scale,
}: BoardItemProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.BOARD_ITEM,
    item: { name, tag },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage());
  }, []);

  return (
    isDragging ? null : (
      <div
        ref={drag}
        id={tag}
        onMouseDown={() => (setCanDrag ? setCanDrag(false) : null)}
        className={`bg-slate-50 border-2 border-black absolute ${className}`}
        style={{ top, left, transform: `scale(${scale})` }}
      >
        <div>{tag}</div>
        <div>{name}</div>
      </div>
    )
  );
}

export default BoardItem;
