var webpack=require('webpack');
var path=require('path');

var BUILD_PATH = path.resolve(__dirname + '/public');
var APP_PATH = path.resolve(__dirname + '/src');

var config = {
	entry : APP_PATH + '/main.js',
	output:{
		path : BUILD_PATH,
		filename : 'bundle.js',
		publicPath : '/'
	}
	,module:{
		loaders:[
			{
				test: /\.jsx?/
				,include: APP_PATH
				,loader : 'babel-loader'
				,query:{
					presets:["es2015"]
				}
			}
		]
	}
	,plugins:[
		new webpack.optimize.UglifyJsPlugin({minimize:true})
	]
}

module.exports = config