/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

const DeclarationBundlerPlugin = require('./declaration-bundler-webpack-plugin');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const getExternals = require('./webpack.externals');

/**
 * Returns the webpack configuration for the dapp to build
 *
 * @param      {string}         name                        dapp name
 * @param      {string}         dist                        destination folder
 * @param      {Array<string>}  [externals=getExternals()]  list of build externals that should be
 *                                                          excluded from the bundle
 * @param      {boolean}        [prodMode=false]            uglify, ...
 * @param      {boolean}        [transpileOnly=false]       disable d.ts filling, so build speed
 *                                                          will be increased drastically
 * @return     {any}            webpack config
 */
module.exports = function(
  name,
  dist,
  transpileOnly = false,
  prodMode = false,
  externals = getExternals(),
) {
  const packageJson = require(path.resolve(`${ dist }/../package.json`));

  const webpackConfig = {
    entry: './src/index.ts',
    externals: externals,
    devtool: '#eval-source-map',
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    output: {
      path: dist,
      publicPath: '/dist/',
      filename: `${ name }.js`,
      library: `${ name }.js`,
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            transpileOnly,
            appendTsSuffixTo: [/\.vue$/],
          }
        },
        {
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader, // process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
            // translates css into commonJS
            'css-loader',
            // https://github.com/bholloway/resolve-url-loader/blob/master/packages/resolve-url-loader/README.md
            'resolve-url-loader',
            // transpile scss and enable source maps to keep original relative path references using
            // resolve-url-loader
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sourceMapContents: false
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg|png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[ext]?[hash]',
              publicPath: (url, resourcePath, context) => url
            }
          }]
        },
        {
          test: /\.js$/,
          exclude: file => (/node_modules/.test(file) && !/\.vue\.js/.test(file)),
          loader: 'babel-loader'
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: `${ name }.css`,
        chunkFilename: `${ name }.css`,
      }),
      new DeclarationBundlerPlugin({
        moduleName: `'${ packageJson.name }'`,
        out: `${ name }.d.ts`,
      }),
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|de/),
    ],
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    devServer: {
      historyApiFallback: true,
      noInfo: true
    },
    performance: {
      hints: false
    }
  }

  if (process.env.NODE_ENV === 'production') {
    webpackConfig.devtool = '#source-map';
    webpackConfig.plugins = (webpackConfig.plugins || []).concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new UglifyJsPlugin({
        test: /\.js($|\?)/i,
        exclude: /(node_modules)/,
        parallel: true,
        sourceMap: false
      }),
      new OptimizeCSSAssetsPlugin({}),
    ])
  }

  // only rebuild d.ts files when we are running in production mode or they does not exists
  if (process.env.NODE_ENV === 'production' || prodMode ||
    !fs.existsSync(`${ dist }/${ name }.d.ts`)) {
    webpackConfig.plugins.push(new DeclarationBundlerPlugin({
      moduleName: `'${ packageJson.name }'`,
      out: `${ name }.d.ts`,
    }));
  }

  return webpackConfig;
}

