import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube } from '@fortawesome/free-solid-svg-icons';

interface Item {
    name: string;
    className?: string;
  }

function ToolboxItem({ name, className = '' }: Item) {
  return (
    <div className={`cursor-move select-none ${className}`}>
      <FontAwesomeIcon icon={faCube} />
      {` ${name}`}
    </div>
  );
}

export default ToolboxItem;
