const { merge } = require("webpack-merge");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const common = require("./webpack.common");

const isDevelopment = process.env.NODE_ENV !== "production";
const isFastRefresh = isDevelopment && process.env.FAST_REFRESH !== "disabled";
const srcPathAbsolute = path.resolve(__dirname, "../src");

module.exports = merge(common, {
  mode: "development",
  cache: true,
  devtool: "eval-source-map",
  entry: isFastRefresh
    ? "./index.js"
    : [
        "webpack-dev-server/client?http://0.0.0.0:3000/",
        "webpack/hot/only-dev-server",
        "react-hot-loader/patch",
        "./index.js"
      ],
  output: {
    path: path.resolve(__dirname, "../dist/assets/"),
    filename: "app.js",
    publicPath: "/assets/"
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: isFastRefresh ? "only" : true,
    proxy: [
      {
        context: ["/debug"],
        target: "http://localhost:7009",
      },
      {
        context: [
          "/auth",
          "/infra",
          "/config",
          "/data",
          "/edge/v1",
          "/auditlogs",
          "/kubectllogs",
          "/v2",
          "/cls/v1",
          "/opsauditlogs",
          "/cluster",
          "/info",
          "/audit_metric",
          "/event",
          "/resources",
          "/dashboard"
        ],
        target: "http://localhost:11000"
      },
      {
        context: ["/accesslogs"],
        target: "http://192.168.99.100:32767"
      }
    ]
  },
  plugins: [
    isFastRefresh
      ? new ReactRefreshWebpackPlugin()
      : new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js|jsx)$/,
        include: [srcPathAbsolute],
        loader: require.resolve("babel-loader"),
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: [
            isFastRefresh && require.resolve("react-refresh/babel")
          ].filter(Boolean)
        }
      }
    ]
  }
});
