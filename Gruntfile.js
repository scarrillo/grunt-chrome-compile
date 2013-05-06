/*
* grunt-chrome-compile
* https://github.com/scarrillo/grunt-chrome-compile
*
* Copyright (c) 2013 scarrillo
* Licensed under the MIT license.
*/
'use strict';
module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc'
			},
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['tmp'],
		},

		// Configuration to be run (and then tested).
		'chrome-extension': {
			options: {
				name: "demo-ext",
				version: "0.0.1",
				id: "00000000000000000000000000000000",
				updateUrl: "http://example.com/extension/111111/",
				chrome: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				//buildDir: 'build',
				//certDir: 'cert',
				clean: true,
				resources: [
					"manifest.json",
					"js/**",
					"images/**",
					"lib/**",
					"!lib/closure/**",
					"!.cert/**"
				]
			}
		},
		/*chrome_compile: {
			default_options: {
				options: {
				},
				files: {
					'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123'],
				},
			},
			custom_options: {
				options: {
					separator: ': ',
					punctuation: ' !!!',
				},
				files: {
					'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123'],
				},
			},
		},*/

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js'],
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'chrome-extension', 'nodeunit']);

	// By default, lint and run all tests.
	// grunt.registerTask('default', ['jshint', 'test']);
	grunt.registerTask('default', ['chrome-extension']);
};