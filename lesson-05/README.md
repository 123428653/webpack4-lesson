
## vue安装相关

webpack解析vue会用到的两个包分别为：
<code style="color:red">vue-loader</code>、<code style="color:red">vue-template-compiler</code>

还有我们的主角<code style="color:red">vue</code>

- 安装：
```bash
npm i vue-loader vue-template-compiler -D

npm i vue -S
```
- <code style="color:red">vue-loader</code>用于加载 .vue 后缀文件

- <code style="color:red">vue-template-compiler</code>用于编译模板


- **注意：**

在安装<code style="color:red">vue-template-compiler</code>、<code style="color:red">vue</code>包时，两个包的版本必须保持同步，这样 <code style="color:red">vue-loader</code> 就会生成兼容运行时的代码。这意味着你每次升级项目中的 <code style="color:red">vue</code> 包时，也应该匹配升级 <code style="color:red">vue-template-compiler</code>。


## 最新目录

```bash
  lesson-05
    |- build
    |- node-modules
    |- pubilc
    |- package.json
    |- package-lock.json
    |- /src
        |- assets
            |- images
                |- logon.png    // 新增
        |- App.vue              // 新增
        |- index.js
        |- main.js              // 新增

```


## 配置文件、App.vue、main.js

build/wbpack.config.js

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')   // 新增

const resolve = (dir) =>  path.resolve(__dirname, dir)
module.exports = {
  mode: 'development',
  entry: {
    // app: ['@babel/polyfill', resolve('../src/index.js')]     
     app: ['@babel/polyfill', resolve('../src/main.js')]   // 修改入口文件
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
        test: /\.vue$/,             // 新增
        loader: 'vue-loader'        // 新增
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),          // 新增
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Lesson-05',
      template: resolve('../public/index.html')
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
} 
```

App.vue：

```html
<style lang="scss" scoped>
  #app {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 35px;
  }
</style>


<template>
  <div id="app">
    <div><img src="./assets/images/logo.png"></div>
    <h1>Hello Vue</h1>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
```

main.js:

```js
import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#box', 
  render: h => h(App)
})
```

现在可以尝试运行 
```bash
npm run serve
```

发现完美的跑起了一个简单的vue项目。

## 完美 +1

到这里其实还没有完，其实需要解决掉两个小问题。

1. 可以看<code style="color:red">main.js</code>中，引入的App.vue是携带了后缀名的，在实际开发中，其实是省略掉这个后缀的。
2. 如果用过vue-cli的同学会发现，当我们引入资源的时候，在路径前面会多一个@符号。例如：<code><img src="@/assets/images/logo.png"\></code>，这个是怎么做到的呢？

其实这两个问题，都是用配置文件中 <code style="color:red"> resolve </code> 选项配置。

- 2020-04-10出现新坑：在resolve的extensions忽略后缀名中，必须把.vue放在最前面否则会报如下错误：

```js
// 浏览器
[Vue warn]: Cannot find element: #app

// 开发工具控制台
// 会提示App.js无法找到，其实默认是吧App当作js看了，只要把.vue放到前面即可

extensions:['.vue', '.js', '.json']
```

配置如下：

build/webpack.config.js

```js
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
  resolve: {                                // 新增
    // 2020-04-10坑一：这里的忽略后缀名，
    // 必须把.vue放在最前面否则会报错
    extensions:['.vue', '.js', '.json'],    // 新增
    alias:{                                 // 新增
      '@': resolve('../src')                // 新增
    }                                       // 新增
  },                                        // 新增
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
    // 2020-04-10坑二：如果在package.json中配置了--hot参数，
    // 会与这个HotModuleReplacementPlugin方法冲突，需要去掉一个
    new webpack.HotModuleReplacementPlugin()
  ]
} 
```

App.vue

```html
...省略

<template>
  <div id="app">
    <div><img src="@/assets/images/logo.png"></div>     // 新增@
    <h1>Hello Vue</h1>
  </div>
</template>

...省略
```

main.js

```js
import Vue from 'vue'
import App from './App'     // 省略了.vue后缀

new Vue({
  el: '#box',
  render: h => h(App)
})

```

再次运行

```bash
npm run serve
```

能正常预览说明成功了！最终完成了vue配置。

更多相关的配置可以参[vue-loader官方文档](https://vue-loader.vuejs.org/zh/)

## 项目地址

源码地址点击这[GitHub](https://github.com/123428653/webpack4-lesson)