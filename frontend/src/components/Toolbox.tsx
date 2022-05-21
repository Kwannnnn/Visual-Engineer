import React from 'react';
import ItemsList from './ItemsList';

interface ToolboxProps {
  className?: string;
}

function Toolbox({ className }: ToolboxProps) {
  return (
    <aside className={`bg-yellow-500 overflow-y-auto ${className}`}>
      <ItemsList />
    </aside>
  );
}

export default Toolbox;
