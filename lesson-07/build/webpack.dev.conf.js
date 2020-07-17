const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const open = require('opn')// 打开浏览器
const ip = require('ip').address()
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpack = require('./webpack.base.conf')

const resolve = (dir) => path.resolve(__dirname, dir)
module.exports = merge(baseWebpack, {
  mode: 'development',
  devtool: 'cheap-source-map', // 开启cheap-source-map模式调试

  // 开启web服务器、热更新
  devServer: {
    // open: true,
    hot: true,
    host: ip,
    port: 3002,
    overlay: true, // 浏览器中提示ESLint错误信息(推荐打开)
    publicPath: '/',
    contentBase: resolve('../dist'), // 设置dist目录为服务器预览的内容
    after() {
      open(`http://${ip}:${this.port}`)
        .then(() => {
          console.log(`成功打开链接： http://${ip}:${this.port}`)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },

  // 定义模块规则
  module: {
    rules: [
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
      }
    ]
  },

  // 插件选项
  plugins: [
    // html模板、以及相关配置
    new HtmlWebpackPlugin({
      title: 'Lesson-06',
      template: resolve('../public/index.html'),
      // cdn（自定义属性）加载的资源，不需要手动添加至index.html中,
      // 顺序按数组索引加载
      cdn: {
        css: ['https://cdn.bootcss.com/element-ui/2.8.2/theme-chalk/index.css'],
        js: [
          'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
          'https://cdn.bootcss.com/element-ui/2.8.2/index.js'
        ]
      }
    }),
    // 热替换插件
    new webpack.HotModuleReplacementPlugin(),
    // 在热加载时直接返回更新文件名，而不是文件的id。
    new webpack.NamedModulesPlugin()
  ]
})
