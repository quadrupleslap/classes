var webpack = require('webpack');
var path = require('path');
var ClosureCompilerPlugin = require('webpack-closure-compiler');
var AppCachePlugin = require('appcache-webpack-plugin');
var fs = require('fs');

var plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(false),
    new AppCachePlugin({
      output: 'main.appcache',
      cache: fs.readdirSync('public/fonts')
        .filter(f => f[0] != '.')
        .map(f => 'fonts/' + f)
        .concat(['main.css'])
    })
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
      test: /\.css$/,
      loader: 'style!css?modules&camelcase!postcss'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel?loose=all'
    }]
  },

  postcss: function () {
    var autoprefixer = require('autoprefixer'),
        precss = require('precss'),
        inlinesvg = require('postcss-inline-svg'),
        cssnano = require('cssnano');

    return [
        precss(),
        inlinesvg(),
        autoprefixer({ browsers: ['last 1 version'] }),
        cssnano()
      ];
  }
};