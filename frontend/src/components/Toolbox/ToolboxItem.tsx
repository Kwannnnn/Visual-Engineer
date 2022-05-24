import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import { useDrag } from 'react-dnd';
import ItemTypes from '../board/ItemTypes';

interface Item {
  className?: string;
  name: string;
}

function ToolboxItem({ name, className = '' }: Item) {
  const [, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`cursor-move p-1 text-sm select-none transition-all hover:bg-slate-100 hover:rounded-r-lg hover:font-bold
     ${className}`}
    >
      <FontAwesomeIcon icon={faCube} />
      {` ${name}`}
    </div>
  );
}

export default ToolboxItem;
