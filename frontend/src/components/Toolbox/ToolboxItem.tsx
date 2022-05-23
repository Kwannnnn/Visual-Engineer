import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube } from '@fortawesome/free-solid-svg-icons';

interface Item {
    name: string;
    className?: string;
  }

function ToolboxItem({ name, className = '' }: Item) {
  return (
    <div className={`cursor-move p-1 text-sm select-none transition-all hover:bg-slate-100 hover:rounded-r-lg hover:font-bold
     ${className}`}
    >
      <FontAwesomeIcon icon={faCube} />
      {` ${name}`}
    </div>
  );
}

export default ToolboxItem;
