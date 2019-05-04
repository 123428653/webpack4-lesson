const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const autoprefixer = require('autoprefixer')

const resolve = (dir) =>  path.resolve(__dirname, dir)
module.exports = {
  mode: 'development',
  entry: {
    app: ['@babel/polyfill', resolve('../src/index.js')]
  },
  output: {
    filename: 'bundle.js',
    path: resolve('../dist')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass')
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Lesson-04',
      template: resolve('../public/index.html')
    })
  ]
} 