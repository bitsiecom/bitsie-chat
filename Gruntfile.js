module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// JS TASKS ================================================================
		// check all js files for errors
		jshint: {
			all : ['public/js/**/*.js', '!public/js/aes.js', '!public/js/**/*.min.js'] 
		},
		
		karma: {
			options: {
				configFile: 'test/unit/karma.conf.js',
			},
			unit: {
				singleRun: false
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-karma');
	
	grunt.registerTask('test-unit', ['jshint', 'karma']);

};