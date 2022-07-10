const path = require('path');
const nodeExternals = require('webpack-node-externals');

const entry = { server: './src/server/index.ts' };

module.exports = {
  mode: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
  target: 'node',
  devtool: 'inline-source-map',
  entry: entry,
  output: {
    path: path.resolve(__dirname, 'build-server'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@config': path.resolve(__dirname, './src/config'),
      '@helpers': path.resolve(__dirname, './src/server/helpers'),
      '@interfaces': path.resolve(__dirname, './src/interfaces'),
      '@models': path.resolve(__dirname, './src/server/models'),
      '@services': path.resolve(__dirname, './src/server/services'),
      '@i18n': path.resolve(__dirname, './src/server/i18n'),
    },
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'src/server/tsconfig.json',
            },
          },
        ],
      },
    ],
  },
};
