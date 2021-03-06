const webpack = require("webpack");
const _ = require('lodash');
const ManifestPlugin = require('webpack-manifest-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

///////////////////////////////////////////////////////////////////////////////////////////////////
// read package.json and get dependencies' package ids
function getNPMPackageIds() {
  var packageManifest = {};
  try {
    packageManifest = require('./package.json');
  } catch (e) {
    // does not have a package.json manifest
  }
  return _.keys(packageManifest.dependencies) || []
}

module.exports = {
  watch: true,
  cache: true,
  bail: false,
  entry: {
    app: './app/jsx/App.jsx',
    lib: getNPMPackageIds()
  },
  output: {
    filename: '[name]-bundle-[chunkhash].js',
    path: __dirname + '/app/js',
    publicPath: "/js/"
  },
  plugins: [
    // Chunk up our vendor libraries
    new webpack.optimize.CommonsChunkPlugin("lib"),
    // Provides jQuery globally to all browser modules, so we can use jquery plugins like Trumbowyg
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    // Generates manifest.json so app can know the exact names of files for cache-busting
    new ManifestPlugin(),
    new ProgressPlugin( (percent, message) =>
      process.stdout.write(" [" + Math.round(percent*100) + "%] " + message + "                                \r")
    )
  ],
  resolve: {
    alias: {
      'pdfjs-lib': __dirname + '/node_modules/pdfjs-embed2/src/pdf.js'
    },
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
    {
      test: /node_modules.pdfjs-embed2.*\.js$/,
      exclude: /src\/core\/(glyphlist|unicode)/,
      loader: 'babel-loader'
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  performance : {
    hints : false
  }
}
