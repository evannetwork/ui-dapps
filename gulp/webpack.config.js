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

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = function(name, dist, externals) {
  externals = externals || {
    '@evan.network/api-blockchain-core': '@evan.network/api-blockchain-core',
    '@evan.network/smart-contracts-core': '@evan.network/smart-contracts-core',
    '@evan.network/ui': '@evan.network/ui',
    '@evan.network/ui-dapp-browser': '@evan.network/ui-dapp-browser',
  };

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
              publicPath: './'
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
      })
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

  return webpackConfig;
}

