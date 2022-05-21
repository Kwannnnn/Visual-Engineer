import React from 'react';
import ToolboxList from './ToolboxList';

interface ToolboxProps {
  className?: string
}

const apiSampleData = [
  {
    group: 'Items',
    subsets: [
      {
        group: 'Pipes',
        items: [
          {
            name: 'Plastic pipe',
          },
          {
            name: 'Iron pipe',
          }
        ],
        subsets: [
          {
            group: 'Square pipes',
            items: [
              {
                name: 'Copper square pipe',
              },
              {
                name: 'Aluminum square pipe',
              }
            ],
          }
        ],
      },
      {
        group: 'Cleaners',
        items: [
          {
            name: '2A cleaner',
          },
          {
            name: 'F3 hot cleaner',
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
