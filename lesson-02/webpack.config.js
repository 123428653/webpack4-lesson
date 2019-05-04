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
          { loader: 'style-loader' },
          { loader: 'css-loader' },
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
          name: '[path]/[name].[ext]',
        },
      }
    ]
  }
} 