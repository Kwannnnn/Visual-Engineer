import React from 'react';
import ToolboxList from './ToolboxList';

interface ToolboxProps {
  className?: string,
  types: []
}

function Toolbox(props: ToolboxProps) {
  const { className, types } = props;
  return (
    <aside className={`overflow-y-auto bg-slate-50 border-r border-slate-200 ${className}`}>
      <div data-cy="toolbox-list" className="p-3">
        <ToolboxList listing={types} subsetNbr={1} />
      </div>
    </aside>
  );
}

export default Toolbox;
