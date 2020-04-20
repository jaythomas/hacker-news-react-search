module.exports = function(api) {
	api.assertVersion('7')
	api.cache.forever()

	return {
		plugins: [
		],
		presets: [
      ['@babel/preset-react'],
			['@babel/preset-env', { corejs: 3, useBuiltIns: 'usage' }]
		]
	}
}
