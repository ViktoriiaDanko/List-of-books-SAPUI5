var jsValidator = require("@sap/di.code-validation.js");
var xmlValidator = require("@sap/di.code-validation.xml");

module.exports = function (grunt) {
	"use strict";

	var webAppDir = "webapp";
	var targetDir = "dist";
	var tmpDir = targetDir + "/tmp";
	var tmpDirDbg = targetDir + "/tmp-dbg";
	var tmpDirBabel = targetDir + "/tmp-babel";

	// 	grunt.initConfig({
	// 		run: {
	// 			options: {
	// 				failOnError: true
	// 			},
	// 			build: {
	// 				exec: "npm run build-for-deploy"
	// 			},
	// 			clean: {
	// 				exec: "npm run clean"
	// 			}
	// 		}
	// 	});

	// Use Babel compiler
	var config = {
		run: {
			options: {
				failOnError: true
			},
			build: {
				exec: "npm run build-for-deploy"
			},
			clean: {
				exec: "npm run clean"
			}
		},
		babel: {
			options: {
				sourceMap: false,
				presets: ['env']
			},
			dist: {
				files: [{
					expand: true, // Enable dynamic expansion.
					cwd: 'webapp/', // Src matches are relative to this path.
					src: ['**/*.js'],
					dest: tmpDirBabel, // Destination path prefix.
					//ext: '.js',   // Dest filepaths will have this extension.
					//extDot: 'first',   // Extensions in filenames begin after the first dot
					filter: function (filepath) {
						return !filepath.match(new RegExp('webapp/libs', 'gi'));
					}
				}]
			}
		},
		clean: {
			build: [targetDir],
			cleanBabel: [tmpDirBabel]
		},
		copy: {
			copyToDbg: {
				files: [{
					expand: true,
					src: "**/*.js",
					dest: tmpDirDbg,
					cwd: tmpDirBabel,
					filter: function (filepath) {
						// prevent js from localService to be copied
						return !filepath.match(new RegExp(webAppDir + "(\\/|\\\\)localService", "gi"));
					}
				}, {
					expand: true,
					src: 'libs/**/*.js',
					dest: tmpDir,
					cwd: webAppDir
				}, {
					expand: true,
					src: "**/*.css",
					dest: tmpDirDbg,
					cwd: webAppDir
				}]
			},
			copyToTmp: {
				files: [{
					expand: true,
					src: '**/*.js',
					dest: tmpDir,
					cwd: tmpDirBabel,
					filter: function (filepath) {
						// prevent js from localService to be copied
						return !filepath.match(new RegExp('build' + '(\\/|\\\\)localService', 'gi'));
					}
				}, {
					expand: true,
					src: 'libs/**/*.js',
					dest: tmpDir,
					cwd: webAppDir
				}, {
					expand: true,
					src: '**/*.css',
					dest: tmpDir,
					cwd: webAppDir
				}, {
					expand: true,
					src: 'localService/metadata.xml',
					dest: tmpDir,
					cwd: webAppDir
				}, {
					expand: true,
					src: '**/*',
					dest: tmpDir,
					cwd: webAppDir,
					filter: function (filepath) {
						// prevent js and css files and contents of webapp/test from being copied
						return !filepath.match(new RegExp("(" + webAppDir +
							"(\\/|\\\\)test|${webAppDir}(\\/|\\\\)localService|\\.js$|\\.css$|\\.ts$|\\test.html$)", "gi"));
					}
				}]
			}
		}
	};

	grunt.loadNpmTasks("grunt-run");
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks("@sap/grunt-sapui5-bestpractice-build");
	grunt.config.merge(config);

	grunt.registerTask('default', 'runs my tasks', function () {
		var tasks = [
			'clean:build',
			'babel',
			'lint',
			'build',
			'clean:cleanBabel'
		];

		// Use the force option for all tasks declared in the previous line
		// grunt.option('force', true);
		grunt.option('stack', true);
		grunt.task.run(tasks);
	});

	grunt.registerTask("lint", function () {
		var issues = [];
		[xmlValidator, jsValidator].forEach(function (validator) {
			issues = issues.concat(validator.validateFiles().issues);
		});
		// 		if (issues.length) {
		// 			grunt.log.writeln("Linting issues: \n" + issues.map(JSON.stringify).join("\n"));
		// 		}
		if (issues.filter(function (issue) {

				return issue.severity === "error";
			}).map((issue) => grunt.log.writeln("Linting issue: " + JSON.stringify(issue))).length) {
			grunt.fail.fatal("Linting errors found");
		}
	});
};