const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const {merge} = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const Dotenv = require("dotenv-webpack");
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  entry: [path.join(__dirname, 'src/server.ts')],
  externals: [nodeExternals({})],
  optimization: {
    minimize: false
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, `enviroments/stage.env`),
      safe: false
    }),
    new CleanWebpackPlugin({
      dry: false,
      verbose: true,
      cleanStaleWebpackAssets: true, // this can be removed as it is the default
      protectWebpackAssets: false, // I do not see you removing non-webpack assets, not sure why this is set to false.
      cleanOnceBeforeBuildPatterns: ['**/*'] // this can be removed as it is the default
    })
  ]
});
