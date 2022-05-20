module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // eslint-disable-next-line global-require
    require('tw-elements/dist/plugin')
  ],
};
