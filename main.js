const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
let [ extractCSS , extractLESS , extractSASS ] = [ new ExtractTextPlugin('css/[name].css') , new ExtractTextPlugin('css/[name].css') , new ExtractTextPlugin('css/[name].css') ],
//生成模版配置
HtmlConfig = {
	title:'this title',
	template: './template/index.html',
	chunks: ['iantooDate'], //chunks主要用于多入口文件，当你有多个入口文件，那就回编译后生成多个打包后的文件，那么chunks 就能选择你要使用那些js文件
	filename: 'iantoo.html',
},



config = {
	mode:'production', //production || development
	entry: {
		'iantooweek':path.resolve(__dirname, './dev/iantooweek'),
		'iantooDate':path.resolve(__dirname, './dev/iantooDate'),
	},
	output: {
		path: path.resolve(__dirname, './build'), // var buildDir = path.resolve(__dirname, './build');
		publicPath: '/',//publicPath参数表示的是一个URL路径（指向生成文件的根目录），用于生成css/js/图片/字体文件等资源的路径，以确保网页能正确地加载到这些资源。
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
				test: /\.js$/,
				include: [
					path.resolve(__dirname, "dev"),
				],
				exclude:[
					path.resolve(__dirname, "node_modules"),
				],
				loader: "babel-loader"
			},{
				test: /\.css$/,
				exclude:[
					path.resolve(__dirname, "node_modules"),
				],
				use:ExtractTextPlugin.extract({
                    use:['css-loader']
                })//不再需要style-loader
			},{
				test: /\.less$/,
				exclude:[
					path.resolve(__dirname, "node_modules"),
				],
				use:ExtractTextPlugin.extract({
                    use:['css-loader','less-loader']
                })
			},{
				test: /\.scss$/,
				exclude:[
					path.resolve(__dirname, "node_modules"),
				],
				use:ExtractTextPlugin.extract({
                    use:['css-loader','sass-loader']
                })
			}
		]
	},
	plugins: [
    	new CleanWebpackPlugin(['./build']), //清除之前的缓存文件
    	//DOC : https://www.npmjs.com/package/uglifyjs-webpack-plugin
        new UglifyJsPlugin({
            test: /\.js($|\?)/i,
            exclude: [path.resolve(__dirname, "node_modules")],
            cache:false,
            parallel: true,
        }),
        extractCSS,extractLESS,extractSASS,

        new HtmlWebpackPlugin(HtmlConfig)
    ]
};







if(process.env.NODE_ENV == 'development'){
	config.mode = 'development',
	config.watch = true //开启实时监听
	config.watchOptions = { //监听配置
		aggregateTimeout: 300, //允许延迟编译,默认300
		poll: 1000, //在指定的毫秒内轮询编译
		ignored: ['node_modules','build'], //不监听的文件夹
	}
	config.devServer = {
		contentBase: path.join(__dirname, "assets"), //非webpack编译的文件来源
		port: 9000,
		// host:'localhost',
		// index:'index.html',


		headers: {  //设置请求头
			"X-Custom-Foo": "bar"
		},

		// /*
		// proxy: { //代理服务
		// 	"/api": "http://localhost:3000"
		// }
		// */


		// historyApiFallback: { //所有404页面转向
		// 	rewrites: [
		// 		{ from: /^\/$/, to: '/404.html' }
		// 	]
		// },
		open:true, //打开页面
		openPage:'iantoo.html',

		compress: true, //一切服务都启用gzip 压缩
		lazy: false,//惰性模式
		overlay: { //在存在编译器错误或警告时显示浏览器中的全屏覆盖
			warnings: true,
			errors: true
		}
	}
}


module.exports = config

