module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			default : ['public/js/**/*.js', '!public/js/aes.js', '!public/js/**/*.min.js'] 
		},
		
		karma: {
			options: {
				configFile: 'test/unit/karma.conf.js',
			},
			unit: {
				singleRun: false
			}
		},

		bower_concat: {
			default: {
				dest: 'public/dist/js/_bower.js',
				cssDest: 'public/dist/style/_bower.css',
				dependencies: {
				},
				bowerOptions: {
					relative: false
				}
			}
		},

		watch: {
			js : {
				files: ['public/js/**/*.js'],
				tasks: ['jshint', 'uglify'],
				options: {
					spawn: false,
				}
			},
			css : {
				files: ['public/css/**/*'],
				tasks: ['sass'],
				options: {
					spawn: false,
				}
			}
		},		

		// watch our node server for changes
		nodemon: {
			default: {
				script: 'index.js',
				options : {
					ignore : ['coverage/**', 'node_modules/**', 'public/**', '.sass_cache/']
				}
				//watch: ['server.js', 'routes/*.js', 'lib/**/*', 'config/**/*']
			}
		},

		// run watch and nodemon at the same time
		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			tasks: ['nodemon', 'watch']
		},

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-karma');
	
	grunt.registerTask('default', ['jshint', 'concurrent']);
	grunt.registerTask('test-unit', ['jshint', 'karma']);

};