import React, { ConnectDropTarget } from 'react-dnd';

interface DropPlaceholderProps {
  innerRef: ConnectDropTarget;
  canDrop: boolean;
}

function DropPlaceholder({ innerRef, canDrop }: DropPlaceholderProps) {
  return (
    <div
      ref={innerRef}
      className={`${
        canDrop
          ? 'bg-red-300 border-2 border-red-900 text-red-900 w-32 h-24 flex justify-center items-center'
          : ''
      }`}
    >
      {`${canDrop ? 'Drop here!' : ''}`}
    </div>
  );
}

export default DropPlaceholder;
