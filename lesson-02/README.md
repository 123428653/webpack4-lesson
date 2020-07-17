# webpack教程02-配置文件、资源加载器（sass、file）- loader

## 配置文件

上一节中讲了零配置也可以跑起打包js的操作，但是在实际项目中，不只是那么简单的打包，需要自定义配置打包的入口、输出的出口文件。

现在就开始我们的配置文件，新增目录如下：

```bash
  lesson-02
  |- node-modules
  |- package.json
  |- package-lock.json
  |- /src
    |- index.js
  |- index.html
+ |- webpack.config.js

```

webpack.config.js

```js
const path = require('path')

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
} 
```

上面配置中，mode选项就是我们的打包模式，上一节讲过的。

entry 就是打包的入口文件，值是一个路径。

output 就是打包的输出配置项，

filename 是最终要输出的js文件名

path 是输出到什么目录下，使用Nodejs的内置核心模块path，设置成绝对路径。


package.json

```bash
{
  "name": "lesson-02",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "npx webpack --config webpack.config.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.30.0",
    "webpack-cli": "^3.3.0"
  }
}

```

在scripts 选项中新增dev选项，用于npm运行的命令。

--config webpack.config.js

是设置webpack配置的参数项，运行webpack命令时，会读取此配置文件。

现在我们运行命令，如下：

```bash
npm run dev

Version: webpack 4.30.0
Time: 153ms
Built at: 2019-04-21 12:19:07
    Asset     Size  Chunks             Chunk Names
bundle.js  3.8 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./src/index.js] 28 bytes {main} [built]
```

会在dist目录下生成了bundle.js文件，对应的就是我们配置文件的配置文件。


## 资源加载器（loaders）

### 1. 加载CSS

webpack打包css,需要对应的加载器才能打包，否则会报错，安装加载器，如下：

```bash
npm i style-loader css-loader -D
```

webpack.config.js

```js
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: [
+           'style-loader',
+           'css-loader'
+         ]
+       }
+     ]
+   }
  };
```

在配置文件中，新增了module选项，webpack 根据正则表达式，来确定应该查找哪些文件，并将其提供给指定的 loader。在这种情况下，以 .css 结尾的全部文件，都将被提供给 style-loader 和 css-loader。

在src下新增style.css文件，目录如下：

```bash
  lesson-02
  |- node-modules
  |- package.json
  |- package-lock.json
  |- /src
+   |- style.css
    |- index.js
  |- index.html
+ |- webpack.config.js

```

style.css

```css
html,body{
	background: red;
}
```


修改index.js

```js
import './style.css'

console.log('Hello World!');
```


再次运行：

```bash
npm run dev

> lesson-02@1.0.0 dev C:\Users\Qin\Desktop\js-demo\webpack4-lesson\lesson-02
> npx webpack --config webpack.config.js

Hash: c146e67d4287c2ce96f5
Version: webpack 4.30.0
Time: 437ms
Built at: 2019-04-21 12:31:42
    Asset      Size  Chunks             Chunk Names
bundle.js  23.6 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./node_modules/css-loader/dist/cjs.js!./src/style.css] 176 bytes {main} [built]
[./src/index.js] 52 bytes {main} [built]
[./src/style.css] 1.06 KiB {main} [built]
    + 3 hidden modules
```

运行完成后，会将style.css打包进bundle.js内。


在浏览器中打开index.html，发现body背景颜色变成了红色，说明打包成功！！


### 2. 加载sass/scss

借助sass-loader、dart-sass，dart-sass将sass/scss转成浏览器可以解析的css代码。

安装：
```bash
npm i sass-loader dart-sass -D
```

修改：webpack.config.js

```js
const path = require('path')

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/,
        use: [
+          { loader: 'style-loader' },
+          { loader: 'css-loader' },
+          {
+            loader: 'sass-loader',
+            options: {
+              implementation: require('dart-sass')
+            }
+          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[path]/[name].[ext]',
        },
      }
    ]
  }
} 
```

新增index.scss

```bash
  lesson-02
  |- node-modules
  |- package.json
  |- package-lock.json
  |- /src
    |- style.css
+   |- index.scss
    |- index.js
  |- index.html
  |- webpack.config.js

```

index.scss

```scss
body {
	&{
		background-color: yellow;
	}
	#box {
		background-repeat: no-repeat;
	}
}
```

在index.js内引入

```js
import './style.css'
import './index.scss'

console.log('Hello World!');
```

运行
```bash
npm run dev
```

如果成功打包，打开index.html就能看到scss内的样式。


### 3. 加载图片

现在我们在style.css加入如下样式：

style.css
```css
html,body{
	background: red;
}

+ #box {
+	width: 200px;
+	height: 200px;
+	background-image: url(./F.png);
+ }
```

修改index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>配置文件、资源加载器（loaders）</title>
</head>
<body>
+	<div id="box"></div>
	<script src="./dist/bundle.js"></script>
</body>
</html>
```

再次运行命令：

```bash
npm run dev

> lesson-02@1.0.0 dev C:\Users\Qin\Desktop\js-demo\webpack4-lesson\lesson-02
> npx webpack --config webpack.config.js

Hash: 2adcd84d84a2ec8223c1
Version: webpack 4.30.0
Time: 401ms
Built at: 2019-04-21 12:44:34
    Asset      Size  Chunks             Chunk Names
bundle.js  25.3 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./node_modules/css-loader/dist/cjs.js!./src/style.css] 452 bytes {main} [built]
[./src/F.png] 177 bytes {main} [built] [failed] [1 error]
[./src/index.js] 52 bytes {main} [built]
[./src/style.css] 1.06 KiB {main} [built]
    + 4 hidden modules

ERROR in ./src/F.png 1:0
Module parse failed: Unexpected character '�' (1:0)
You may need an appropriate loader to handle this file type.
(Source code omitted for this binary file)
 @ ./src/style.css (./node_modules/css-loader/dist/cjs.js!./src/style.css) 4:41-59
 @ ./src/style.css
 @ ./src/index.js
npm ERR! code ELIFECYCLE
npm ERR! errno 2
npm ERR! lesson-02@1.0.0 dev: `npx webpack --config webpack.config.js`
npm ERR! Exit status 2
npm ERR!
npm ERR! Failed at the lesson-02@1.0.0 dev script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\Qin\AppData\Roaming\npm-cache\_logs\2019-04-21T04_44_34_802Z-debug.log
```

发现报错了，错误提示：您可能需要适当的加载程序来处理此文件类型。

其实是缺少图片加载器，现在我们去安装它。


#### 安装

需要安装
- [x] url-loader
- [x] file-loader

```bash
npm i url-loader file-loader -D
```

修改 webpack.config.js

- 2020-04-10出现新坑：在vue中引入图片文件时路径错误输出为[object-module]的bug,
解决方法:

```js
{
  test: /\.(png|svg|jpg|gif)$/,
  loader: 'url-loader',
  options: {
    limit: 4096,
    name: '[path]/[name].[ext]',
    esModule: false  // 解决[object-module]输出的问题
  }
}
```

```js
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
+       {
+         test: /\.(png|svg|jpg|gif)$/,
+         loader: 'url-loader',
+         options: {
+           // fallback: 'file-loader'  // 默认是依赖 file-loader，可以省略不写
+           limit: 4096,    // 文件小于4k时，转成base64编码
+           name: '[path]/[name].[ext]',
+         }
+       }
      ]
    }
  };
```

运行命令：

```bash
npm run dev

> lesson-02@1.0.0 dev C:\Users\Qin\Desktop\js-demo\webpack4-lesson\lesson-02
> npx webpack --config webpack.config.js

Hash: d33708d90a7ea8fc12b2
Version: webpack 4.30.0
Time: 449ms
Built at: 2019-04-21 13:35:16
     Asset       Size  Chunks             Chunk Names
 bundle.js   25.2 KiB    main  [emitted]  main
src//F.png  416 bytes          [emitted]
Entrypoint main = bundle.js
[./node_modules/css-loader/dist/cjs.js!./src/style.css] 452 bytes {main} [built]
[./src/F.png] 56 bytes {main} [built]
[./src/index.js] 52 bytes {main} [built]
[./src/style.css] 1.06 KiB {main} [built]
    + 4 hidden modules
```
<span style="color:red;">**注意：**</span>打包成功后，<span style="color:red;">index.html</span> 文件路径必须是跟打包的 <span style="color:red;">bundle.js</span> 同级，否则图片加载的路径会错误,后续index.html文件是通过 <span style="color:red;">webpack</span> 自动生成的,所以不用担心！

运行完成后，打开index.html，发现图片成功加载了。



## 完成


更多的资源加载器，可以点击查看 [官方文件](https://www.webpackjs.com/guides/asset-management/)

## 项目地址

源码地址点击这[GitHub](https://github.com/123428653/webpack4-lesson)
