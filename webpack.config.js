var webpack = require('webpack');
var path = require('path');
var ClosureCompilerPlugin = require('webpack-closure-compiler');

var plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(false)
  ];

if (process.env.NODE_ENV != 'development')
  plugins.push(new ClosureCompilerPlugin());

module.exports = {
  context: path.join(__dirname, 'app'),
  entry: './index',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js'
  },

  plugins: plugins,

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        loose: 'all'
      }
    }]
  }
};