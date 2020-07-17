## 环境分析

### 开发环境
- 在开发环境中，我们需要具有强大的、具有实时重新加载(live reloading)、热模块替换(hot module replacement)能力的 source map(方便开发者调试代码) 和 localhost server（本地服务器）。

大致如下：
1. webpack-dev-server实时重载、热替换
2. 不压缩代码
3. css样式不提取至单独的文件中
4. 使用sourceMap配置，将源码映射会原始文件（方便调试）
5. 不压缩html


### 生产环境
- 在生产环境中，我们的目标则转向于关注更小的 bundle，更轻量的 source map，以及更优化的资源，以改善加载时间。。

大致如下：
1. 不需要实时重载、热替换
2. 压缩js、css
3. css样式提取至单独的文件中
4. sourceMap.
5. 代码分离（optimization）
6. 压缩html
7. 资源缓存（NamedChunksPlugin、HashedModuleIdsPlugin）
8. 清除dist目录文件



## 解决通用代码

在两个环境下，需要把通用的配置合并，所以需要用到 <code style="color:red">webpack-merge</code> 合并工具，解决代码重复的问题。

安装<code style="color:red">webpack-merge</code>

```bash
npm i webpack-merge -D
```



## 最新目录、文件

```bash
  lesson-05
    |- build
        |- webpack.base.conf.js     // + 通用配置
        |- webpack.dev.conf.js      // + 开发环境配置
        |- webpack.prod.conf.js     // + 生产环境
    |- node-modules
    |- pubilc
    |- package.json
    |- package-lock.json
    |- src
        |- print.js                 // + 用于测试缓存
    |- favicon.ico                  // + 网页icon
```


## 安装生产环境相关包

```bash
npm i cross-env copy-webpack-plugin mini-css-extract-plugin optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin -D
```
- cross-env：在命令行中配置环境变量（查看package.json）
- copy-webpack-plugin：拷贝资源
- mini-css-extract-plugin：单独提取至css文件
- optimize-css-assets-webpack-plugin：压缩css文件
- uglifyjs-webpack-plugin：压缩js文件


## 通用配置

**webpack.base.conf.js**

```js
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
```

## 开发环境配置

**webpack.dev.conf.js**

```js
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpack = require('./webpack.base.conf')

const resolve = (dir) =>  path.resolve(__dirname, dir)
module.exports = merge(baseWebpack, {
  mode: 'development',
  devtool: 'cheap-source-map',  // 开启cheap-source-map模式调试
  
  // 开启web服务器、热更新
  devServer: {
    open: true,
    hot: true,
    port: 3002,
    publicPath: '/',
    contentBase: resolve("../dist")   // 设置dist目录为服务器预览的内容
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
      template: resolve('../public/index.html')
    }),
    // 热替换插件
    new webpack.HotModuleReplacementPlugin(),
    // 在热加载时直接返回更新文件名，而不是文件的id。
    new webpack.NamedModulesPlugin()
  ]
})
```

## 生产环境配置

**webpack.prod.conf.js**

```js
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
```

## 动态CDN资源配置

在参考别人的配置过程中，发现一个可以在webpack中自定义配置CDN的方式，主要是利用 <code style="color:red">html-webpack-plugin</code> 插件的能力，可以新增自定义属性，将CDN资源链接，配置至此自定义属性中。通过在 <code style="color:red">index.html</code>  模板中遍历属性来自动生成CDN资源引入。

如下：

**webpack.dev.conf.js、webpack.prod.conf.js**

```js
  ...省略
  // 插件选项
  plugins: [
    // html模板、以及相关配置
    new HtmlWebpackPlugin({
      title: 'Lesson-06',
      template: resolve('../public/index.html'),
      // cdn（自定义属性）加载的资源，不需要手动添加至index.html中,
      // 顺序按数组索引加载
      cdn: {
        css:['https://cdn.bootcss.com/element-ui/2.8.2/theme-chalk/index.css'],
        js: [
          'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
          'https://cdn.bootcss.com/element-ui/2.8.2/index.js'
        ]
      }
    })
  ]
  ...省略
```

**public/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><%= htmlWebpackPlugin.options.title %></title>
	<!-- import cdn css -->
	<% if(htmlWebpackPlugin.options.cdn) {%>
		<% for(var css of htmlWebpackPlugin.options.cdn.css) { %>
			<link rel="stylesheet" href="<%=css%>">
		<% } %>
	<% } %>
</head>
<body>
	<div id="box"></div>
	<!-- import cdn js -->
	<% if(htmlWebpackPlugin.options.cdn) {%>
		<% for(var js of htmlWebpackPlugin.options.cdn.js) { %>
			<script src="<%=js%>"></script>
		<% } %>
	<% } %>
</body>
</html>
```

## 配置开发、生产环境命令

在package.json的scripts选项中新增，dev、build命令，分别是开发环境、生产环境的命令，

**package.json**

```json
{
  "name": "lesson-06",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "scripts": {
    "dev": "npx webpack-dev-server --config ./build/webpack.dev.conf.js",
    "build": "cross-env NODE_ENV=production npx webpack --config ./build/webpack.prod.conf.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.4.4",
    "@babel/polyfill": "^7.4.4",
    "@babel/preset-env": "^7.4.4",
    "autoprefixer": "^9.5.1",
    "babel-loader": "^8.0.5",
    "clean-webpack-plugin": "^2.0.1",
    "copy-webpack-plugin": "^5.0.3",
    "cross-env": "^5.2.0",
    "css-loader": "^2.1.1",
    "dart-sass": "^1.19.0",
    "file-loader": "^3.0.1",
    "html-webpack-plugin": "^3.2.0",
    "mini-css-extract-plugin": "^0.6.0",
    "optimize-css-assets-webpack-plugin": "^5.0.1",
    "postcss-loader": "^3.0.0",
    "sass-loader": "^7.1.0",
    "style-loader": "^0.23.1",
    "uglifyjs-webpack-plugin": "^2.1.2",
    "vue-loader": "^15.7.0",
    "vue-template-compiler": "^2.6.10",
    "webpack": "^4.30.0",
    "webpack-cli": "^3.3.0",
    "webpack-dev-server": "^3.3.1",
    "webpack-merge": "^4.2.1"
  },
  "dependencies": {
    "vue": "^2.6.10"
  }
}

```

## 完成

配置完成后，可尝试运行：

- 开发环境

```bash
npm run dev
```
- 生产环境

```bash
npm run build
```

如果没有什么问题，会分别开启本地服务器、生成生产环境的目录、文件（根目录的dist）。否则可以自行前往github进行clone项目查看源码，内有注释。


## 项目地址

源码地址点击这[GitHub](https://github.com/123428653/webpack4-lesson)

