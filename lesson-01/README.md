# webpack教程01-概念与零配置Hello World
## 前提

本人才疏学浅，如有描述不对，或者理解错误的地方欢迎指出。会及时改正！

此教程基于windows 64位操作系统
- Nodejs 版本：v10.15.1
- npm : 6.4.1
- webpack : 4.30.0

## 概念

本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

从 webpack v4.0.0 开始，可以不用引入一个配置文件也能完成简陋的打包效果。

在开始之前，请确保安装了[Node.js](https://nodejs.org/en/)的最新版本。使用 Node.js 最新的长期支持版本(LTS - Long Term Support)，理想的起步。使用旧版本，你可能遇到各种问题，因为它们可能缺少 webpack 功能以及/或者缺少相关 package 包。

## 本地安装

webpack v4+ 开始需要与webpack-cli（此工具用于在命令行中运行 webpack）一起安装：

```bash
mkdir lesson-01 && cd lesson-01
npm init -y
npm i webpack webpack-cli -D
```

补充：

- npm init -y  中 <code style="color:red">-y</code>是 <code style="color:red">--yes</code> 的简写，如果不加会一直让你敲回车，省去敲回车的过程。
- <code style="color:red">-D</code> 是 <code style="color:red">--save-dev</code> 的简写，意思是包的依赖出现在到根目录下的 <code style="color:red">package.json</code> 内的  <code style="color:red">devDependencies</code> 对象中,此对象是用于开发环境所依赖的包。
- <code style="color:red">-S</code>  是 <code style="color:red">--save</code> 的简写，包的依赖出现在 <code style="color:red">dependencies</code> 对象中，此对象是生产环境锁依赖的包。
 

## 注意点

当安装完成webpack、webpack-cli后，运行时：

```bash
webpack -v

'webpack' 不是内部或外部命令，也不是可运行的程序
或批处理文件。
```

发现webpack不是内部指令，其实是没有全局webpack变量的原因，但是<strong style="color:red;">官方不推荐全局安装 webpack</strong>，因为这样这会将你项目中的 webpack 锁定到指定版本，并且在使用不同的 webpack 版本的项目中，可能会导致构建失败。

## 解决办法

我们在安装Node.js的时候,顺带的把npm、<strong style="color:red;">npx</strong>安装了，
在这里重点是<strong style="color:red;">npx</strong>，所以我们需要使用npx运行webpack的命令。如下：

```bash
npx webpack -v

4.30.0
```

这样就解决了不安装全局webpack导致的问题。


## Hello World

解决上面问题后，进入正题，零配置Hello World。

新增src/index.js、index.hmtl文件。目录如下：

```bash
  lesson-01
  |- node-modules
  |- package.json
  |- package-lock.json
+ |- /src
+   |- index.js
+ |- index.html

```

src/index.js 

```js
console.log('Hello World!');
```


index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<script src="./dist/main.js"></script>
</body>
</html>
```

现在使用npx运行webpack命令：

```bash
npx webpack

Hash: 512808a97d0c43adbe09
Version: webpack 4.30.0
Time: 602ms
Built at: 2019-04-21 10:51:34
  Asset       Size  Chunks             Chunk Names
main.js  957 bytes       0  [emitted]  main
Entrypoint main = main.js
[0] ./src/index.js 28 bytes {0} [built]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/concepts/mode/
```

运行后，会看到根目录下生成了dist/main.js目录及文件。这是webpack v4+ 默认导出打包的路径以及文件名称，而默认打包的入口既是src/index.js。

在看看上面的打包结果发现有一个警告，意思是在webpack v4+ 开始需要一个mode的配置选项，此选择是用来选择打包的模式，选项有两个值，分别为：development、production，开发环境、生产环境。不配置默使用的是production，但是不写参数会有此警告。所以尽可能的写上mode参数！

在运行命令之前，观察dist/main.js文件的变化，即可知道参数值不同的打包效果。

现在我们再次运行一下webpack命令：

```bash
npx webpack --mode development

Hash: 44b171184298522aaf01
Version: webpack 4.30.0
Time: 128ms
Built at: 2019-04-21 11:04:20
  Asset     Size  Chunks             Chunk Names
main.js  3.8 KiB    main  [emitted]  main
Entrypoint main = main.js
[./src/index.js] 28 bytes {main} [built]
```

现在已经解决警告的问题。


## 完成

现在，在浏览器打开目录下index.html就看到控制台打印 “Hello World！” 字样，这就是零配置！！！！


## 项目地址

源码地址点击这[GitHub](https://github.com/123428653/webpack4-lesson)



