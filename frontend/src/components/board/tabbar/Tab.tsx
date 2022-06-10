import React, { MouseEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

interface TabProps {
    id: number;
    name: string;
    active?: boolean;
    onDelete?: (id: number) => void;
    onSelect?: (id: number) => void;
}

function Tab({
  id, name, active, onDelete, onSelect,
}: TabProps) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleSelect: MouseEventHandler<HTMLButtonElement> = () => {
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSelect}
      className={classNames({
        'box-content max-w-xs p-2 flex flex-1 items-center space-x-2': true,
        'border-b-4': active,
      })}
    >
      <p className="truncate flex-1">{name}</p>
      <FontAwesomeIcon
        icon={faXmark}
        className="hover:bg-gray-100 text-gray-500 hover:text-gray-800 rounded-full px-2 py-1.5"
        size="sm"
        onClick={handleDelete}
      />
    </button>
  );
}

export default Tab;
