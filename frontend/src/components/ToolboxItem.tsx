import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube } from '@fortawesome/free-solid-svg-icons';

interface Item {
    name: string;
  }

function ToolboxItem({ name }: Item) {
  return (
    <div className="cursor-move select-none">
      <FontAwesomeIcon icon={faCube} />
      {` ${name}`}
    </div>
  );
}

export default ToolboxItem;
