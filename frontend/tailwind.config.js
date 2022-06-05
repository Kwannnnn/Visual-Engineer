module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        20: 'repeat(20, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-17': 'span 17 / span 17',
        'span-20': 'span 20 / span 20',
      },
    },
  },
  plugins: [],
};
