var webpack=require('webpack');
var path=require('path');

var BUILD_PATH = path.resolve(__dirname + '/public');
var APP_PATH = path.resolve(__dirname + '/src');

var config = {
	entry : ["babel-polyfill", APP_PATH + '/main.js'],
	output:{
		path : BUILD_PATH,
		filename : 'bundle.js',
		publicPath : '/'
	}
	,module:{
		loaders:[
			{ test: /\.jsx?/ ,include: APP_PATH ,loader : 'babel-loader'},
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
            { test: /\.(woff|woff2)$/, loader:"url-loader?prefix=font/&limit=5000" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" }
     
		]
	}
	,plugins:[
		new webpack.optimize.UglifyJsPlugin({minimize:true})
	]
}

module.exports = config