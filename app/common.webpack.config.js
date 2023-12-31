// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpackConfig = (sampleAppDir, env, babelConfig) => {
  const config = {
    entry: './src/index.tsx',
    ...(env.production || !env.development ? {} : { devtool: 'eval-source-map' }),
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    output: {
      path: path.join(sampleAppDir, env.production ? '/dist/build' : 'dist'),
      filename: 'build.js'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          },
          exclude: /dist/
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.svg/,
          type: 'asset/inline'
        },
        {
          test: /\.mp3$/,
          type: 'file-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(sampleAppDir, './public/manifest.json'),
            to: path.resolve(sampleAppDir, './dist/build')
          },
          { from: path.resolve(sampleAppDir, './public/favicon.ico'), to: path.resolve(sampleAppDir, './dist/build') },
          { from: path.resolve(sampleAppDir, './public/sounds'), to: path.resolve(sampleAppDir, './dist/build/sounds') }
        ]
      }),
      new webpack.DefinePlugin({
        'process.env.PRODUCTION': env.production || !env.development,
        'process.env.NAME': JSON.stringify(require(path.resolve(sampleAppDir, 'package.json')).name),
        'process.env.VERSION': JSON.stringify(require(path.resolve(sampleAppDir, 'package.json')).version),
        __CALLINGVERSION__: JSON.stringify(
          require(path.resolve(sampleAppDir, 'package.json')).dependencies['@azure/communication-calling']
        ),
        __COMMUNICATIONREACTVERSION__: JSON.stringify(
          require(path.resolve(sampleAppDir, 'package.json')).dependencies['@azure/communication-react']
        ),
        __BUILDTIME__: JSON.stringify(new Date().toLocaleString())
      })
    ],
    devServer: {
      port: 3000,
      hot: true,
      open: true,
      static: { directory: path.resolve(sampleAppDir, 'public') },
      proxy: [
        {
          path: '/token',
          target: 'http://[::1]:8080'
        },
        {
          path: '/refreshToken/*',
          target: 'http://[::1]:8080'
        },
        {
          path: '/isValidThread/*',
          target: 'http://[::1]:8080'
        },
        {
          path: '/userConfig/*',
          target: 'http://[::1]:8080'
        },
        {
          path: '/getEndpointUrl',
          target: 'http://[::1]:8080'
        },
        {
          path: '/addUser/*',
          target: 'http://[::1]:8080'
        },
        {
          path: '/getCallQueueId',
          target: 'http://[::1]:8080'
        },
        {
          path: '/getAutoAttendantId',
          target: 'http://[::1]:8080'
        }
      ]
    }
  };

  return config;
};

module.exports = webpackConfig;
