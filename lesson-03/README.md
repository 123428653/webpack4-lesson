# webpack教程03-生成html、css3前缀、babel配置等..

## 修改目录文件

```bash
  lesson-03
   |- build
     |- webpack-config.js   // 配置文件
   |- dist                  // 生成打包结果
   |- node-modules
   |- public                // 静态资源
     |- index.html          // 模板文件
   |- package.json
   |- package-lock.json
   |- /src
     |- assets
        |- images           
        |- style
     |- index.js
```


## 创建html、清除dist目录文件

1. 使用 <code style="color:red">html-webpack-plugin</code>  来创建html页面，并自动引入打包生成的 <code style="color:red">js</code> 文件
2. 使用 <code style="color:red">clean-webpack-plugin</code> 清除出口目录的文件

- 安装

```bash
npm i html-webpack-plugin clean-webpack-plugin -D
```

- 配置文件新增 <code style="color:red">html-webpack-plugin</code>
 

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')    // +
// const { CleanWebpackPlugin } = require('clean-webpack-plugin') // + 3.x版本
const CleanWebpackPlugin = require('clean-webpack-plugin') // + 2.x版本

const resolve = (dir) =>  path.resolve(__dirname, dir)
module.exports = {
  mode: 'development',
  entry: resolve('../src/index.js'),
  output: {
    filename: 'bundle.js',
    path: resolve('../dist')
  },
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass')
            }
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
  plugins: [                    // +
    new CleanWebpackPlugin(),   // +
    new HtmlWebpackPlugin({     // +
      title: 'Lesson-03',         // +
      template: resolve('../public/index.html') // +
    })                          // +
  ]                             // +
} 
```

- index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
	<div id="box"></div>
</body>
</html>
```

运行webpack

```bash
npm run dev


> lesson-02@1.0.0 dev C:\Users\Qin\Desktop\js-demo\webpack4-lesson\lesson-03
> npx webpack --config ./build/webpack.config.js

Hash: fed721cbb72ce9b765de
Version: webpack 4.30.0
Time: 2379ms
Built at: 2019-05-04 09:22:31
     Asset       Size  Chunks             Chunk Names
     F.png  416 bytes          [emitted]
 bundle.js   28.5 KiB    main  [emitted]  main
index.html  205 bytes          [emitted]
Entrypoint main = bundle.js
[./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/lib/loader.js?!./src/assets/style/index.scss] ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/lib/loader.js??ref--5-2!./src/assets/style/index.scss 334 bytes {main} [built]
[./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/lib/loader.js?!./src/assets/style/style.css] ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/lib/loader.js??ref--5-2!./src/assets/style/style.css 458 bytes {main} [built]
[./src/assets/images/F.png] 51 bytes {main} [built]
[./src/assets/style/index.scss] 1.25 KiB {main} [built]
[./src/assets/style/style.css] 1.25 KiB {main} [built]
[./src/index.js] 259 bytes {main} [built]
    + 4 hidden modules
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [./node_modules/html-webpack-plugin/lib/loader.js!./public/index.html] 426 bytes {0} [built]
    [./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 878 bytes {0} [built]
    [./node_modules/webpack/buildin/module.js] (webpack)/buildin/module.js 552 bytes {0} [built]
        + 1 hidden module
```

运行成功后，会在dist文件夹内生成index.html


## 配置自动添加css3前缀

- 安装

```bash
npm i postcss-loader autoprefixer -D
```

- 修改 webpack.config.js

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const autoprefixer = require('autoprefixer')  // +

const resolve = (dir) =>  path.resolve(__dirname, dir)
module.exports = {
  mode: 'development',
  entry: resolve('../src/index.js'),
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
            options: {              // +
              importLoaders: 1      // +
            }                       // +
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
      title: 'Lesson-03',
      template: resolve('../public/index.html')
    })
  ]
} 
```

在根目录新增  <code style="color:red">postcss.config.js</code>

```js
module.exports = {
	plugins: {
    autoprefixer: {}
  }
}
```

修改   <code style="color:red">index.scss</code>

```scss
body {
	display: flex;
	justify-content: center;
	align-items: center;
	#box {
		background-color: yellow;
		background-repeat: no-repeat;
		transform: translateX(50px);
	}
}
```

运行webpack

```bash
npm run dev
```

再打开dist/index.html文件时，发现只有 <code style="color:red">transform</code> 添加了前缀,

```css
-webkit-transform: translateX(50px);
transform: translateX(50px);
```
而 <code style="color:red">display: flex...</code> 并没有添加前缀

```css
display: flex;
justify-content: center;
align-items: center;
```
上面的问题，主要原因是需要配置指定浏览器的范围内添加CSS前缀才能给 <code style="color:red">display: flex</code>等，添加前缀。

现在有四种配置方法可以解决上面的问题。

### 方法一

直接在  <code style="color:red">webpack.config.js</code> 中配置

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const autoprefixer = require('autoprefixer')

const resolve = (dir) =>  path.resolve(__dirname, dir)
module.exports = {
  mode: 'development',
  entry: resolve('../src/index.js'),
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
              importLoaders: 2
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass')
            }
          },
          {
            loader: 'postcss-loader',
            options: {                  // +
              plugins: [                // +
                autoprefixer({          // +
                  browsers: [           // +
                    "> 1%",             // +
                    "last 2 version",   // +
                    "not ie <= 8"       // +
                  ]                     // +
                })                      // +
              ]                         // +
            }                           // +
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
      title: 'Lesson-03',
      template: resolve('../public/index.html')
    })
  ]
} 
```

### 方法二

在跟目录新增  <code style="color:red">.browserslistrc</code>  配置文件。

 <code style="color:red">.browserslistrc</code>  内容如下：
```bash
> 1%
last 2 versions
not ie <= 8
```

### 方法三

在 <code style="color:red">package.json</code> 中配置

```json
{
  "name": "lesson-03",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "npx webpack --config ./build/webpack.config.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    ...
  },
  "browserslist": [         // +
    "> 1%",                 // +
    "last 2 version",       // +
    "not ie <= 8"           // +
  ]                         // +
}
```

### 方法四（教程最终选择了此方法）

选择此方法的目的主要是为了减少根目录的配置文件。

在 <code style="color:red">postcss.config.js</code> 中配置

```js
module.exports = {
	plugins: {
        autoprefixer: {
    	    browsers: ['> 1%', 'last 2 version', 'not ie <= 8']    // +
        }
    }
}
```

目录如下：

```bash
  lesson-03
   |- /build
   |- /dist                  // 生成打包结果
   |- /node-modules
   |- /public                // 静态资源
   |- package.json
   |- package-lock.json
   |- /src
   |- .browserslistrc       // +
   |- .gitignore
   |- package.json
   |- postcss.config.js
   |- README.md
```

四种办法不能同时出现，否则会报错，配置其中一种即可。

运行
```bash
npm run dev
```

再打开dist/index.html, 在控制台查看样式:

```css
body {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
```

可发现已经成功添加了厂商的前缀，还添加了display:flex低版本浏览器的旧版flex样式。最终得到我们想要的效果了！！！！

## 配置babel,ES6/7/8  转 ES5 语法

- 安装

```bash
npm install babel-loader @babel/core @babel/preset-env -D
```

- 修改  <code style="color:red">webpack.config.js</code>

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const autoprefixer = require('autoprefixer')

const resolve = (dir) =>  path.resolve(__dirname, dir)
module.exports = {
  mode: 'development',
  entry: resolve('../src/index.js'),
  output: {
    filename: 'bundle.js',
    path: resolve('../dist')
  },
  module: {
    rules: [
      {                         // +
        test: /\.jsx?$/,        // +
        loader: 'babel-loader'  // +
      },                        // +
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
      title: 'Lesson-03',
      template: resolve('../public/index.html')
    })
  ]
} 
```

- 根目录新增  <code style="color:red">babel.config.js</code> 文件

```js
module.exports = {
	presets: [
		'@babel/preset-env'
	]
}
```

运行webpack
```bash
npm run dev
```

可以看到 ES6语法被转成了ES5语法了。

到这里其实还没有完成，只是转了语法，并没有把api转成ES5。

### ES6/7/8 Api 转ES5

<code style="color:red">@babel/core、@babel/preset-env</code> 只会将 ES6/7/8语法转换为ES5语法，但是对新api并不会转换。

我们可以通过 <code style="color:red">babel-polyfill</code>  对一些不支持新语法的客户端提供新语法的实现。

- 安装

```bash
npm install @babel/polyfill -D
```

- 修改 <code style="color:red">webpack.config.js</code> 配置
- 在 <code style="color:red">entry</code>  中添加  <code style="color:red">@babel-polyfill</code> 

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const autoprefixer = require('autoprefixer')

const resolve = (dir) =>  path.resolve(__dirname, dir)
module.exports = {
  mode: 'development',
  entry: {
    app: ['@babel/polyfill', resolve('../src/index.js')]    // +
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
      title: 'Lesson-03',
      template: resolve('../public/index.html')
    })
  ]
} 
```

最后运行webpack
```bash
npm run dev
```

即可查看代码已成功转换ES语法、Api  !!!

## 项目地址

源码地址点击这[GitHub](https://github.com/123428653/webpack4-lesson)

