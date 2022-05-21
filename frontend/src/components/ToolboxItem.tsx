import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import { useDrag } from 'react-dnd';

interface Item {
  className?: string;
  name: string;
}

function ToolboxItem({ name, className = '' }: Item) {
  const [, drag] = useDrag({
    type: 'item',
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} className={`cursor-move select-none ${className}`}>
      <FontAwesomeIcon icon={faCube} />
      {` ${name}`}
    </div>
  );
}

export default ToolboxItem;
