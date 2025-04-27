//@ts-check
'use strict';
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/
/** @type WebpackConfig */
const extensionConfig = {
  target: 'node', // VS Code extensions run in a Node.js-context
  mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
  entry: './src/extension.ts', // the entry point of this extension
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }]
      }
    ]
  },
  devtool: 'nosources-source-map',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  infrastructureLogging: {
    level: "log", // enables logging required for problem matchers
  }
};
/** @type WebpackConfig */
const webviewConfig = {
  target: 'web',
  mode: 'none',
  entry: {
    // Add entries for each webview page
    'localeloader': './src/webviews/localeloader.ts',
    'gradle2020importpage': './src/webviews/pages/gradle2020importpage.ts',
    'projectcreatorpage': './src/webviews/pages/projectcreatorpage.ts',
    'riologpage': './src/riolog/shared/sharedscript.ts',
  },
  output: {
    path: path.resolve(__dirname, 'resources', 'dist'),
    filename: '[name].js',
    libraryTarget: 'window'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      // Provide empty modules for Node.js built-in modules
      'net': false,
      'timers': false
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }]
      },
      {
        test: /\.js$/,
        include: [/node_modules/],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        // Copy CSS and other assets to the dist folder
        { from: 'media', to: '../media' }
      ]
    })
  ],
  devtool: 'inline-source-map',
  optimization: {
    minimize: false
  }
};
module.exports = [ extensionConfig, webviewConfig ];
