import React, { useState, useEffect } from 'react';
import { getObjectTypes } from '../../api/utility-functions';
import ToolboxList from './ToolboxList';

interface ToolboxProps {
  className?: string
}

// const apiSampleData = [
//   {
//     group: 'Item',
//     subsets: [
//       {
//         group: 'Pipe Item',
//         items: [
//           { name: 'Pipe Fitting' }
//         ],
//       },
//       {
//         group: 'Mechanical Equipment',
//         subsets: [
//           {
//             group: 'Rotating Equipment',
//             items: [
//               { name: 'Pump' },
//               { name: 'Blower' }
//             ],
//           },
//           {
//             group: 'Static Equipment',
//             items: [
//               { name: 'Tank' },
//               { name: 'Vessel' }
//             ],
//           }
//         ],
//       }
//     ],
//   }
// ];

function Toolbox({ className }: ToolboxProps) {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    getObjectTypes()
      .then((res) => {
        setTypes(res);
      })
      .catch((e) => {
        console.log(e.message);
      });
  });

  return (
    <aside className={`overflow-y-auto ${className}`}>
      <div id="toolbox-list" className="p-3">
        <ToolboxList listing={types} subsetNbr={1} />
      </div>
    </aside>
  );
}

export default Toolbox;
