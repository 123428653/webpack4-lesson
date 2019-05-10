const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')

const resolve = (dir) =>  path.resolve(__dirname, dir)
module.exports = {
  mode: 'development',
  entry: {
    app: ['@babel/polyfill', resolve('../src/main.js')]
  },
  output: {
    filename: 'bundle.js',
    path: resolve('../dist')
  },
  devServer: {
    open: true,
    hot: true,
    port: 3002,
    contentBase: resolve(__dirname, "./dist")
  },
  resolve: {
    extensions:['.js', '.json', '.vue'],
    alias:{
      '@': resolve('../src')
    }
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
          // {
          //   loader: 'vue-style-loader'
          // },
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
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Lesson-05',
      template: resolve('../public/index.html')
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
} 