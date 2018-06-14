const path = require('path')





module.exports = {
	entry: {
		'iantooweek':path.resolve(__dirname, './dev/iantooweek')
	},
	output: {
		path: path.resolve(__dirname, './build'), // var buildDir = path.resolve(__dirname, './build');
		publicPath: './build/',//publicPath参数表示的是一个URL路径（指向生成文件的根目录），用于生成css/js/图片/字体文件等资源的路径，以确保网页能正确地加载到这些资源。
		filename: 'js/[name].js',
		/* filename属性表示的是如何命名生成出来的入口文件，规则有以下三种：
		[name]，指代入口文件的name，也就是上面提到的entry参数的key
		[hash]，指代本次编译的一个hash版本
		[chunkhash]，指代的是当前chunk的一个hash版本，也就是说，在同一次编译中，每一个chunk的hash都是不一样的；而在两次编译中，如果某个chunk根本没有发生变化，那么该chunk的hash也就不会发生变化。
		 */
		chunkFilename: '[id].bundle.js',
		//chunkFilename参数与filename参数类似，都是用来定义生成文件的命名方式的，只不过，chunkFilename参数指定的是除入口文件外的chunk（这些chunk通常是由于webpack对代码的优化所形成的，比如因应实际运行的情况来异步加载）的命名。
	},
	module: {
		rules: [{
				test: /\.jsx$/,
				include: [
					path.resolve(__dirname, "dev"),
				],
				exclude:[
					path.resolve(__dirname, "node_modules"),
				],
				loader: "babel-loader"
			},
		]
	}
};

