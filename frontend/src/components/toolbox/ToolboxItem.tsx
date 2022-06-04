import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube } from '@fortawesome/free-solid-svg-icons';

interface Item {
  className?: string;
  name: string;
}

function ToolboxItem({ name, className = '' }: Item) {
  const onDragStart = (event: React.DragEvent, label: string) => {
    if (!event.dataTransfer) return;
    event.dataTransfer.setData('application/reactflow', label);
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      onDragStart={(event) => onDragStart(event, name)}
      className={`cursor-move p-1 text-sm select-none transition-all hover:bg-slate-100 hover:rounded-r-lg hover:font-bold
     ${className}`}
      draggable
      data-cy={`toolbox-item-${name.replace(' ', '_')}`}
    >
      <FontAwesomeIcon icon={faCube} />
      {` ${name}`}
    </div>
  );
}

export default ToolboxItem;
