const appVersion = require('./package.json').version
const gitRevision = require('git-rev-sync').long()
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const webpack = require('webpack')

// Filter out noisy css plugin messages from webpack stats output
// https://github.com/webpack-contrib/mini-css-extract-plugin/issues/168
class cleanUpStatsPlugin {
	shouldPickStatChild(child) {
		// eslint-disable-line class-methods-use-this
		return child.name.indexOf('mini-css-extract-plugin') !== 0
	}

	apply(compiler) {
		compiler.hooks.done.tap('CleanUpStatsPlugin', stats => {
			const children = stats.compilation.children
			if (Array.isArray(children)) {
				stats.compilation.children = children.filter(this.shouldPickStatChild)
			}
		})
	}
}

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'public/')
  },
  devtool: 'source-map',
  entry: {
    main: './src/main.entry.js'
  },
  module: {
    rules: [
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					miniCssExtractPlugin.loader,
					'css-loader'
				]
			},
      {
        test: /.js$/,
        exclude: [
          /node_modules/,
          /\.spec\.js$/
        ],
        use: [
					// https://github.com/webpack-contrib/cache-loader/
					'cache-loader',
          'babel-loader',
          'eslint-loader'
        ]
      }
    ]
  },
  optimization: {
    // Force this so we can debug production output
    minimize: false
  },
  output: {
		filename: '[name].bundle.[chunkhash].js'
  },
  plugins: [
		new cleanUpStatsPlugin(),
    new webpack.DefinePlugin({
      // Super useful values to know what revision your bundle was built from.
      // Perhaps you want to know if a production update has been pushed through yet.
      DEFINED_APP_VERSION: JSON.stringify(appVersion),
			DEFINED_GIT_REVISION: JSON.stringify(gitRevision)
    }),
    new htmlWebpackPlugin({
      chunks: ['main'],
      minify: false,
      template: 'src/index.html'
    }),
		// Any css loaded into the JS is extracted out and dumped into
		// a separate "app.css" bundle, otherwise CSS would be injected
		// by javascript and cause a temporary flash of unstyled content.
		new miniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].bundle.[chunkhash].css',
			chunkFilename: '[id].bundle.[chunkhash].css'
		})
  ],
  // Disable some junk in the webpack console output. Alternatively could
  // use a reporter plugin that gives you a better formatted output such
  // as friendly-errors-webpack-plugin. Maybe next time.
	stats: {
		colors: true,
		hash: false,
		version: false
	}
}
