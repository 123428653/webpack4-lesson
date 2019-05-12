const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const webpackConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const resolve = (dir) =>  path.resolve(__dirname, dir)

module.exports = merge(webpackConfig, {
  mode: 'production',
  devtool: false,
  // 运行、打包输出配置
  output: {
    path: resolve('../dist'),
    filename: 'static/js/[name].[chunkhash:8].js'
  },

  // 压缩js、css资源、分包
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs', // 打包后生成的js文件名称
          test: /[\\/]node_modules[\\/]/,
          priority: 10, 
          chunks: 'initial' // 只打包初始时依赖的第三方
        },
        // elementUI选项暂时未使用到（参考elementUI中的配置）
        elementUI: {
          name: 'chunk-elementUI', // 单独将 elementUI 拆包
          priority: 21, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
          test: /[\\/]node_modules[\\/]element-ui[\\/]/
        },
        // commons选项暂时未使用到（参考elementUI中的配置）
        commons: {
          name: 'chunk-commons',
          test: resolve('../src/components'), // 可自定义拓展你的规则
          minChunks: 3, // 最小公用次数
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: 'single',
    minimizer: [ // 压缩js、压缩css配置
      new UglifyJsPlugin({
        sourceMap: false,
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  },

  // 定义模块规则
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass'),
              sourceMap: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      },
    ]
  },

  // 插件选项
  plugins: [
    // 清除上次构建的文件，清除目录是基于output出口目录
    new CleanWebpackPlugin(),
    // 创建html入口，无需手动引入js、css资源
    new HtmlWebpackPlugin({
      template: resolve('../public/index.html'),
      title: 'Lesson-06',
      favicon: resolve('../favicon.ico'),
      // cdn（自定义属性）加载的资源，不需要手动添加至index.html中,
      // 顺序按数组索引加载
      cdn: {
        css:['https://cdn.bootcss.com/element-ui/2.8.2/theme-chalk/index.css'],
        js: [
          'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
          'https://cdn.bootcss.com/element-ui/2.8.2/index.js'
        ]
      },
      // 压缩html
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
    }),

    // 提取至单独css文件
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].css'
    }),

    // 拷贝资源
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
        to: path.resolve(__dirname, '../dist')
      }
    ]),
    
    // 当chunk没有名字时，保持chunk.id稳定（缓存chunk）
    new webpack.NamedChunksPlugin(chunk => {
      if (chunk.name) {
        return chunk.name
      }
      const modules = Array.from(chunk.modulesIterable)
      if (modules.length > 1) {
        const hash = require('hash-sum')
        const joinedHash = hash(modules.map(m => m.id).join('_'))
        let len = 4
        const seen = new Set()
        while (seen.has(joinedHash.substr(0, len))) len++
        seen.add(joinedHash.substr(0, len))
        return `chunk-${joinedHash.substr(0, len)}`
      } else {
        return modules[0].id
      }
    }),

    // 当vender模块没有变化时，保持module.id稳定（缓存vender）
    new webpack.HashedModuleIdsPlugin()
  ]
})