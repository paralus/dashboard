const path = require("path");
const webpack = require("webpack");

const isDevelopment = process.env.NODE_ENV !== "production";
const srcPathAbsolute = path.resolve(__dirname, "../src");
const env = isDevelopment ? "development" : "production";
const cssModulesQuery = {
  modules: {
    auto: true,
    localIdentName: "[name]-[local]-[hash:base64:5]"
  },
  importLoaders: 1
};

module.exports = {
  context: srcPathAbsolute,
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js|jsx)$/,
        include: [srcPathAbsolute],
        loader: require.resolve("babel-loader"),
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: ["react-hot-loader/babel"]
        }
      },
      {
        test: /\.(png|jpg|gif|mp4|ogg|svg|woff|woff2|ttf|eot|ico)$/,
        loader: "file-loader"
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: cssModulesQuery
          }
        ]
      },
      {
        test: /\.scss$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: cssModulesQuery
          },
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser"
    })
  ],
  resolve: {
    alias: {
      assets: `${srcPathAbsolute}/assets/`,
      actions: `${srcPathAbsolute}/actions/`,
      components: `${srcPathAbsolute}/components/`,
      constants: `${srcPathAbsolute}/constants`,
      config: `${srcPathAbsolute}/config/${env}.js`,
      containers: `${srcPathAbsolute}/containers/`,
      reducers: `${srcPathAbsolute}/reducers/`,
      app: `${srcPathAbsolute}/app/`,
      utils: `${srcPathAbsolute}/utils/`,
      styles: `${srcPathAbsolute}/styles/`,
      process: "process/browser"
    },
    extensions: [".js", ".jsx"],
    modules: [srcPathAbsolute, "../node_modules"]
  }
};
