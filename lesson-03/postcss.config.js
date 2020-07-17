module.exports = {
	plugins: {
		// 方法一：直接在 webpack.config.js 中的postcss-loader配置
		// 方法二：或者使用根目录下的.browserslistrc配置文件
		// 方法三：编辑目标浏览器：使用package.json中的“browserslist”字段，
		// 方法三：新增postcss.config.js的plugins.autoprefixer.overrideBrowserslist
		
	    autoprefixer: {
	    	 overrideBrowserslist: ['> 1%', 'last 2 version', 'not ie <= 8']
	    }
  	}
}