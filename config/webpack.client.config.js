const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const autoprefixer = require("autoprefixer");

const base = require("./webpack.base.config");
const isProduction = process.env.NODE_ENV === "production";
const srcPath = path.resolve(process.cwd(), "src/web");

module.exports = merge(base, {
  entry: {
    app: path.join(srcPath, "client-entry.js"),
  },
  output: {
    path: path.resolve(process.cwd(), "dist"),
    publicPath: "/public",
    filename: isProduction ? "[name].[hash:6].js" : "[name].js",
    sourceMapFilename: isProduction
      ? "[name].[hash:6].js.map"
      : "[name].js.map",
  },
  resolve: {
    extensions: [".js", ".vue"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: !isProduction,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [autoprefixer],
            },
          },
          "sass-loader",
        ],
      },
    ],
  },

  plugins: [
    new VueLoaderPlugin(),
    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
          }),
        ]
      : [
          new MiniCssExtractPlugin({
            filename: "[name].css",
            hmr: true,
          }),
          new webpack.HotModuleReplacementPlugin(),
        ]),
  ],
});
