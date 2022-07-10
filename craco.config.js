const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@actions': path.resolve(__dirname, 'src/client/actions/'),
      '@components': path.resolve(__dirname, 'src/client/components/'),
      '@config': path.resolve(__dirname, './src/config'),
      '@contexts': path.resolve(__dirname, './src/client/contexts'),
      '@hooks': path.resolve(__dirname, './src/client/hooks'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@modules': path.resolve(__dirname, 'src/client/modules'),
      '@selectors': path.resolve(__dirname, 'src/client/selectors'),
      '@styles': path.resolve(__dirname, 'src/client/styles'),
      '@rest': path.resolve(__dirname, 'src/client/rest'),
    },
  },
};
