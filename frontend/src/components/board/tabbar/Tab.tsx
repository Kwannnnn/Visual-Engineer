import React, { MouseEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

interface TabProps {
    id: number;
    name: string;
    active?: boolean;
    onClose?: (id: number) => void;
    onSelect?: (id: number) => void;
}

function Tab({
  id, name, active, onClose, onSelect,
}: TabProps) {
  const handleClose = () => {
    if (onClose) {
      onClose(id);
    }
  };

  const handleSelect: MouseEventHandler<HTMLButtonElement> = () => {
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <div className={classNames('flex-1 flex max-w-xs items-center', {
      'border-b-4': active,
    })}
    >
      <button
        type="button"
        onClick={handleSelect}
        className="flex-1 flex justify-center"
      >
        <p className="truncate max-w-[15rem]">{name}</p>
      </button>
      <FontAwesomeIcon
        icon={faXmark}
        className="hover:bg-gray-100 text-gray-500 hover:text-gray-800 rounded-full px-2 py-1.5"
        size="sm"
        onClick={handleClose}
      />
    </div>
  );
}

export default Tab;
