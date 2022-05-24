import React, { Ref } from 'react';
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

function Toolbox({ className }: ToolboxProps, ref: Ref<HTMLElement>) {
  return (
    <aside ref={ref} className={`overflow-y-auto ${className}`}>
      <div id="toolbox-list" className="p-3">
        <ToolboxList listing={apiSampleData} subsetNbr={1} />
      </div>
    </aside>
  );
}

export default React.forwardRef(Toolbox);
