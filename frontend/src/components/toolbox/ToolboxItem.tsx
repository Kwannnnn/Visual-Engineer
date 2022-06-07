import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube } from '@fortawesome/free-solid-svg-icons';

interface Item {
  className?: string;
  displayName: string;
  type: string;
}

function ToolboxItem({ type, displayName, className = '' }: Item) {
  const onDragStart = (event: React.DragEvent) => {
    if (!event.dataTransfer) return;
    event.dataTransfer.setData('application/reactflow', type);
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      onDragStart={(event) => onDragStart(event)}
      className={`cursor-move p-1 text-sm select-none transition-all hover:bg-slate-100 hover:rounded-r-lg hover:font-bold
     ${className}`}
      draggable
      data-cy={`toolbox-item-${type}`}
    >
      <FontAwesomeIcon icon={faCube} />
      {` ${displayName}`}
    </div>
  );
}

export default ToolboxItem;
