// const path = require('path');
// const webpack = require('webpack');

//
// module.exports = {
//   devtool: 'cheap-module-eval-source-map',
//   entry: [
//     'webpack-hot-middleware/client',
//     './index'
//   ],
//   output: {
//     path: path.join(__dirname, 'dist'),
//     filename: 'bundle.js',
//     publicPath: '/static/'
//   },
//   plugins: [

//   ],
//   postcss: [autoprefixer]
// }

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
const autoprefixer = require('autoprefixer')

const config = {
  devtool: 'cheap-eval-source-map',
  // context: __dirname + '/src',
  entry: [
    'webpack-hot-middleware/client',
    './index'
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static'
  },

  plugins: [
    new DashboardPlugin(),
    new HtmlWebpackPlugin({template: './index.html', inject: 'body'}),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [autoprefixer]
              }
            }
          }
        ]
      },
      {
        test: /(\.css)$/,
        loaders: ['style', 'css']
      }
    ]
  }
}

module.exports = config