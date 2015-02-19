// Karma configuration
module.exports = function(config) {
	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: '../../',

		background: true,

		// testing framework to use (jasmine/mocha/qunit/...)
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			'bower_components/jquery/dist/jquery.js',
			'bower_components/angular/angular.js',
			'bower_components/angular-sanitize/angular-sanitize.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'node_modules/socket.io/node_modules/socket.io-client/socket.io.js',
			'public/js/aes.js',
			'public/js/app.js',
			'public/js/services/*.js',
			'public/js/ChatModule*.js',
			'test/unit/**/*.spec.js'
		],

		// list of files / patterns to exclude
		exclude: [],

		// web server port
		port: 8081,

		// level of logging
		// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_DEBUG,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		reporters: ['spec', 'coverage'],

		colors: true,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['Chrome'],

		preprocessors: {
			'**/public/js/**/!(aes).js': ['coverage']
		},

		coverageReporter: {
			reporters: [
				{
					type: 'html',
					dir: 'coverage/'
				},
				{ 
					type: 'text'
				}
			]
		},

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false
	});
};