import React from 'react';
import ToolboxList from './ToolboxList';

interface ToolboxProps {
  className?: string,
  types: []
}

function Toolbox({ className, types }: ToolboxProps) {
  return (
    <aside className={`overflow-y-auto ${className}`}>
      <div data-cy="toolbox-list" className="p-3">
        <ToolboxList listing={types} subsetNbr={1} />
      </div>
    </aside>
  );
}

export default Toolbox;
