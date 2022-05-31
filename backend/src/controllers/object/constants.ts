const types = [
  {
    group: 'Item',
    subsets: [
      {
        group: 'Pipe Item',
        items: [
          { name: 'Pipe Fitting' },
        ],
      },
      {
        group: 'Mechanical Equipment',
        subsets: [
          {
            group: 'Rotating Equipment',
            items: [
              { name: 'Pump' },
              { name: 'Blower' },
            ],
          },
          {
            group: 'Static Equipment',
            items: [
              { name: 'Tank' },
              { name: 'Vessel' },
            ],
          },
        ],
      },
    ],
  },
];

export default types;
