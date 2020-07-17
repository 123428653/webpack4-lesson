# webpack4-08-配置ESLint

**该配置已包含Vue文件的检查**

## 安装依赖包

首先需要按照所需的包（5个）：

```bash
yarn add eslint eslint-loader babel-eslint eslint-friendly-formatter eslint-config-standard -D
```

安装插件包（6个）

```bash
yarn add eslint-plugin-html eslint-plugin-import eslint-plugin-node eslint-plugin-vue eslint-plugin-promise eslint-plugin-standard -D
```

## 修改webpack配置文件

**注意下面配置代码旁边的 + 号，为新增，复制需谨慎！**

**1. 修改 build/webapck.base.js 文件**

在模块规则新增eslint-loader的配置，主要检查 `.js` / `.vue`的语法

```js
const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')

const resolve = (dir) => path.resolve(__dirname, dir)
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
    filename: 'bundle.js' // filename是相对于path路径生成
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
+      {
+        test: /\.(js|vue)$/,
+        use: [{
+          loader: 'eslint-loader',
+          options: {
+            formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
*          }
*        }],
*        enforce: 'pre', // 编译前检查
+        exclude: [/node_modules/], // 不检测的文件
+        include: [resolve('../src')] // 指定检查的目录
+      },
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
          name: 'static/images/[name].[hash:7].[ext]'
        }
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

**2. 修改 build/webapck.dev.js 文件**

在 devServer 选项中添加 `overlay: true`， 方便再浏览器中直接提示ESLint的错误信息。
```js
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpack = require('./webpack.base.conf')

const resolve = (dir) => path.resolve(__dirname, dir)
module.exports = merge(baseWebpack, {
  mode: 'development',
  devtool: 'cheap-source-map', // 开启cheap-source-map模式调试

  // 开启web服务器、热更新
  devServer: {
    open: true,
    hot: true,
    port: 3002,
+    overlay: true, // 浏览器中提示ESLint错误信息(推荐打开)
    publicPath: '/',
    contentBase: resolve('../dist') // 设置dist目录为服务器预览的内容
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
```

**3. 添加ESLint配置文件**

```js
module.exports = {
  root: true, // 作用的目录是根目录
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:vue/essential'
  ],
  plugins: [
    'html', // 使用eslint-plugin-html
    'vue'
  ],
  parserOptions: {
    // 此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
    parser: 'babel-eslint',
    sourceType: 'module', // 按照模块的方式解析
    // "ecmaVersion": 6,
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true, // 开发环境配置表示可以使用浏览器的方法
    node: true, //
    commonjs: true,
    es6: true,
    amd: true
  },
  rules: { // 重新覆盖 extends: 'standard'的规则
    // 自定义的规则
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': [0, 'error', 'windows'],
    // indent: ['error', 4], // error类型，缩进4个空格
    'space-before-function-paren': 0, // 在函数左括号的前面是否有空格
    // 'eol-last': 0, // 不检测新文件末尾是否有空行
    // semi: ['error', 'always'], // 必须在语句后面加分号
    // quotes: 0, // ["error", "double"],// 字符串没有使用双引号
    // 'no-console': ['error', { allow: ['log', 'warn'] }], // 允许使用console.log()
    'arrow-parens': 0,
    'no-undef': 0, // 关闭全局变量检测
    'no-new': 0// 允许使用 new 关键字
  },
  globals: { // 允许全局变量,将$设置为true，表示允许使用全局变量$
    document: true,
    localStorage: true,
    window: true,
    jQuery: true,
    $: true
  }
}
```
启动项目：
```bash
yarn dev
```

会发现报了很多错误信息，根据提示一个个修改即可。

以上完成所有的ESLint的配置。

## 额外：新增开发环境默认打开本地ip作为调试

安装获取本地`ip` / `opn`

opn: 拼接IP，并且自动打开浏览器。

```bash
yarn add opn ip -D
```

修改 webpack.dev.js 文件

```js
const open = require('opn')// 打开浏览器
const ip = require('ip').address()  // 获取本地IP


module.exports = merge(baseWebpack, {
    ....
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
  }
    ....
})
```

## 项目地址

源码地址点击这[GitHub](https://github.com/123428653/webpack4-lesson)