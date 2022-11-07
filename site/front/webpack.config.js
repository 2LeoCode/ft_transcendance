const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const port = process.env.PORT || 3000;

module.exports = {
  target: 'node',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.[hash].js',
    path: __dirname + '/dist',
  },
  rules: [
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
        use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript'
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties'
          ]
        }
      }
    }
  ],
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
    }),
  ],
};
