import React from 'react';
import ToolboxList from './ToolboxList';

interface ToolboxProps {
  className?: string
}

const apiSampleData = [
  {
    group: 'Item',
    subsets: [
      {
        group: 'Pipe Item',
        items: [
          { name: 'Pipe Fitting' }
        ],
      },
      {
        group: 'Mechanical Equipment',
        subsets: [
          {
            group: 'Rotating Equipment',
            items: [
              { name: 'Pump' },
              { name: 'Blower' }
            ],
          },
          {
            group: 'Static Equipment',
            items: [
              { name: 'Tank' },
              { name: 'Vessel' }
            ],
          }
        ],
      }
    ],
  }
];

function Toolbox({ className }: ToolboxProps) {
  return (
    <aside className={`overflow-y-auto ${className}`}>
      <div id="toolbox-list" className="p-3">
        <ToolboxList listing={apiSampleData} />
      </div>
    </aside>
  );
}

export default Toolbox;
