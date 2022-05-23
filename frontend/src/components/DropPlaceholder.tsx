import React, { ConnectDropTarget } from 'react-dnd';

interface DropPlaceholderProps {
  innerRef: ConnectDropTarget;
}

function DropPlaceholder({ innerRef }: DropPlaceholderProps) {
  return (
    <div
      ref={innerRef}
      className="w-full h-full"
    />
  );
}

export default DropPlaceholder;
