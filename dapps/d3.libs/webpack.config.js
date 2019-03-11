const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

const name = require('./dbcp.json').public.name;
module.exports = {
  entry: './src/index.ts',
  externals: {
    '@evan.network/api-blockchain-core': '@evan.network/api-blockchain-core',
    '@evan.network/ui-dapp-browser': '@evan.network/ui-dapp-browser',
    '@evan.network/smart-contracts-core': '@evan.network/smart-contracts-core',
  },
  devtool: '#eval-source-map',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
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
  module.exports.devtool = '#source-map';
  module.exports.plugins = (module.exports.plugins || []).concat([
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