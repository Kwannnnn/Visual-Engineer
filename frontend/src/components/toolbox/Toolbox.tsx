import React from 'react';
import ToolboxList from './ToolboxList';

interface ToolboxProps {
  isOpen: boolean;
  className?: string,
  types: []
}

function Toolbox(props: ToolboxProps) {
  const { className, isOpen, types } = props;
  const displayClass = isOpen ? 'block' : 'hidden';
  return (
    <aside className={`${displayClass} overflow-y-auto md:border-r-4 ${className}`}>
      <div data-cy="toolbox-list" className="p-3">
        <ToolboxList listing={types} subsetNbr={1} />
      </div>
    </aside>
  );
}

export default Toolbox;
