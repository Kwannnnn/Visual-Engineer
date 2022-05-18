import React from 'react';
import ToolboxList from './ToolboxList';

interface ToolboxProps {
  className?: string
}

const apiSampleData = [
  {
    group: 'items',
    subsets: [
      {
        group: 'pipes',
        items: [
          {
            name: 'plastic pipe',
          },
          {
            name: 'iron pipe',
          }
        ],
        subsets: [
          {
            group: 'long pipes',
            items: [
              {
                name: 'plastic long pipe',
              },
              {
                name: 'iron long pipe',
              }
            ],
          }
        ],
      },
      {
        group: 'cleaners',
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
    <aside className={`bg-yellow-500 overflow-y-auto ${className}`}>
      <ToolboxList listing={apiSampleData} />
    </aside>
  );
}

export default Toolbox;
