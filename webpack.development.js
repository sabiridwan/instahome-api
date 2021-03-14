const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { merge } = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  entry: ["webpack/hot/poll?1000", path.join(__dirname, "src/server.ts")],
  devtool: "inline-source-map",
  watch: true,
  target: "node",
  node: {
    __dirname: true,
    __filename: true,
  },
  externals: [
    nodeExternals({
      allowlist: ["webpack/hot/poll?1000"],
    }),
  ],
  mode: "development",
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, `enviroments/development.env`),
      safe: true,
    }),
    new CleanWebpackPlugin({
      dry: false,
      verbose: true,
      cleanStaleWebpackAssets: true, // this can be removed as it is the default
      protectWebpackAssets: false, // I do not see you removing non-webpack assets, not sure why this is set to false.
      cleanOnceBeforeBuildPatterns: ["**/*"], // this can be removed as it is the default
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
