/* eslint-disable @typescript-eslint/no-var-requires */
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');

const isLocal = slsw.lib.webpack.isLocal;

module.exports = {
  context: __dirname,
  mode: isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  externals: [nodeExternals()],
};
