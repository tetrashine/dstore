const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
	app: path.join(__dirname, 'src'),
	build: path.join(__dirname, 'dist'),
	test:  path.join(__dirname, 'test'),
};

const common = {
	entry: path.resolve(PATHS.test + '/test.js'),
	output: {
		path: PATHS.build,
		filename: 'bundle.js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			loader: 'babel-loader',
			include: PATHS.app,
			exclude: /node_modules/
		}]
	},
	resolve: {
		modules: [
			"node_modules",
			PATHS.app
		]
	},
	plugins: []
};

// Default configuration
if (TARGET === 'test') {
	console.log("TEST Configurations");
	module.exports = merge(common, {
	    devServer: {
			contentBase: PATHS.test,

			// Enable history API fallback so HTML5 History API based
			// routing works. This is a good default that will come
			// in handy in more complicated setups.
			compress: true,
			historyApiFallback: true,
			hot: true,
			inline: false,

			// Display only errors to reduce the amount of output.
			stats: 'errors-only',
    	},
	    devtool: 'inline-source-map',
	    plugins: [
    		new webpack.HotModuleReplacementPlugin()
	    ]
  	});
} else if (TARGET === 'start') {
	console.log("DEV Configurations");
	module.exports = merge(common, {
	    devServer: {
			contentBase: PATHS.build,

			// Enable history API fallback so HTML5 History API based
			// routing works. This is a good default that will come
			// in handy in more complicated setups.
			compress: true,
			historyApiFallback: true,
			hot: true,
			inline: false,

			// Display only errors to reduce the amount of output.
			stats: 'errors-only',

			// Parse host and port from env so this is easy to customize.
			//
			// If you use Vagrant or Cloud9, set
			// host: process.env.HOST || '0.0.0.0';
			//
			// 0.0.0.0 is available to all network devices unlike default
			// localhost
			host: process.env.HOST,
			port: process.env.PORT
    	},
	    devtool: 'inline-source-map',
	    plugins: [
    		new webpack.HotModuleReplacementPlugin()
	    ]
  	});
} else {
	console.log("PRD Configurations");
	module.exports = merge(common, {
		plugins: [
			new webpack.DefinePlugin({
      	'process.env': {
        	'NODE_ENV': JSON.stringify('production')
        }
      }),
			new webpack.optimize.OccurrenceOrderPlugin(true),
			new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
		]
	});
}
