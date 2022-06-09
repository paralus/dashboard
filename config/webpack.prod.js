const { merge } = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  entry: ["./index.js"],
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/",
    filename: "assets/app.[contenthash].js",
    chunkFilename: "assets/[id].[chunkhash].chunk.js",
    clean: true
  },
  optimization: {
    runtimeChunk: "single",
    moduleIds: "deterministic",
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"]
          }
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          chunks: "all",
          filename: "assets/vendors.[contenthash].js",
          priority: 1,
          maxInitialRequests: 2,
          minChunks: 1
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"production"'
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public/favicon.ico"),
          to: path.resolve(__dirname, "../dist")
        },
        {
          from: path.resolve(__dirname, "../public/vendors"),
          to: path.resolve(__dirname, "../dist/vendors")
        },
        {
          from: path.resolve(__dirname, "../src/assets/images"),
          to: path.resolve(__dirname, "../dist/assets/images")
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.template")
    }),
    new CaseSensitivePathsPlugin()
  ]
});
