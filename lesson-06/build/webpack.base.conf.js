const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')

const resolve = (dir) =>  path.resolve(__dirname, dir)
const jsonToStr = (json) => JSON.stringify(json)
const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  // 入口配置
  entry: {
    app: ['@babel/polyfill', resolve('../src/main.js')]
  },

  // 打包输出配置
  output: {
    path: resolve('../dist'),
    filename: 'bundle.js'     // filename是相对于path路径生成
  },

  // 引入资源省略后缀、资源别名配置
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      '@': resolve('../src')
    }
  },

  // 定义模块规则
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        // 指定目录去加载babel-loader，提升运行、打包速度
        include: [resolve('../src'), resolve('../node_modules/webpack-dev-server/client')],
        // 排除目录，提升运行、打包速度
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        )
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          // 指定生成的目录
          name: 'static/images/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  
  // 插件选项
  plugins: [
    // 定义环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isProd ? jsonToStr('production') : jsonToStr('development')
    }),
    new VueLoaderPlugin()
  ]
} 