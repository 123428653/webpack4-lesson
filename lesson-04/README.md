

## 配置devServer服务器、热更新

在实际开发过程中，我们希望每次修改文件都会帮我们自动的刷新修改的页面或者部分被修改的内容，让开发更加高效，所以我们就需要为我们的项目提供一个简单的web服务器（<code style="color:red">webpack-dev-server</code>），该服务器能够实现时重新加载(live reloading)、热替换的功能。

**安装**

```bash
npm i webpack-dev-server -D
```

**修改  <code style="color:red">webpack.config.js</code>**

```js
...
const webpack = require('webpack')  // 新增

const resolve = (dir) =>  path.resolve(__dirname, dir)
module.exports = {
  mode: 'development',
  entry: {
    ...
  },
  output: {
    ...
  },
  devServer: {                  // 新增
    open: true,                 // +
    hot: true,                  // +
    port: 3002,                 // +
    publicPath: '/',            // +
    contentBase: './dist'       // +
  },                            // 新增
  module: {
    ...
  },
  plugins: [
    ...
    new webpack.NamedModulesPlugin(),           // +
    new webpack.HotModuleReplacementPlugin()    // +
  ]
} 
```
- 在配置中新增<code>devServer</code>选项

1. <code style="color:red">open</code>：服务器启动成功后，将自动打开浏览器
2. <code style="color:red">hot</code>：启用模块热替换功能（备注①）
3. <code style="color:red">port</code>：指定要监听的端口号
4. <code style="color:red">publicPath</code>：将用于确定应该从哪里提供资源、此路径下的打包文件可在浏览器中访问，优先级高于<code style="color:red">contentBase</code>
5. <code style="color:red">contentBase</code>：告诉服务器从哪里提供内容。
6. .....更多参数请[前往官网](https://www.webpackjs.com/configuration/dev-server/)


 <span style="color:red">备注①：</span>在配置文件中开启hot时，需要配合<code style="color:red">HotModuleReplacementPlugin</code>才能完全启用HMR。
如果使用package.json内联--hot选项启动webpack或webpack-dev-server，则会自动添加此插件，因此您可能不需要将其添加到webpack.config.js。

内联如下：
```json
{
    ...
    "scripts": {
        "serve": "npx webpack-dev-server --hot --config ./build/webpack.config.js"
    }
    ...
}
```

- 新增webpack内置插件

1. <code style="color:red">NamedModulesPlugin</code>：在热加载时直接返回更新文件名，而不是文件的id。
2. <code style="color:red">HotModuleReplacementPlugin</code>：热替换插件


**修改 package.json**

在scripts中添加serve选项，如下:
```json
{
  "name": "lesson-04",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "serve": "npx webpack-dev-server --config ./build/webpack.config.js",
    "dev": "npx webpack --config ./build/webpack.config.js"
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
    "css-loader": "^2.1.1",
    "dart-sass": "^1.19.0",
    "file-loader": "^3.0.1",
    "html-webpack-plugin": "^3.2.0",
    "postcss-loader": "^3.0.0",
    "sass-loader": "^7.1.0",
    "style-loader": "^0.23.1",
    "webpack": "^4.30.0",
    "webpack-cli": "^3.3.0",
    "webpack-dev-server": "^3.3.1"
  }
}
```

运行serve

```bash
npm run serve
```

即可自动打开浏览器，启动我们的项目。。

## 项目地址

源码地址点击这[GitHub](https://github.com/123428653/webpack4-lesson)
