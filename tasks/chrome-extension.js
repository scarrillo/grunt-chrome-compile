/*
 * grunt-chrome-compile
 * https://github.com/scarrillo/grunt-chrome-compile
 *
 * Copyright (c) 2013 scarrillo
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {


	grunt.registerTask('chrome-extension', 'Package a google chrome extension', function() {
		grunt.config.requires('chrome-extension.options.name');
		grunt.config.requires('chrome-extension.options.version');
		grunt.config.requires('chrome-extension.options.id');
		grunt.config.requires('chrome-extension.options.version');
		grunt.config.requires('chrome-extension.options.chrome');

		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			buildDir: 'build',
			certDir: '.cert',
			resources: [
				"manifest.json"
			]
		});

		var buildDir = options.buildDir; //'build/';
		var extPath = buildDir +"/"+ options.name +'/';
		var extCert = options.certDir +"/"+ options.name +'.pem';
		var extCodebase = options.updateUrl +""+ options.name +'.crx';
		var extDeployZip = options.name +'.zip';

		//console.dir(options);
		grunt.log.writeln('chrome-extension: config: ');
		grunt.log.writeln('\tchrome: '+options.chrome);
		grunt.log.writeln('\tpath: '+extPath);
		grunt.log.writeln('\tcert: '+extCert);
		grunt.log.writeln('\tupdate path: '+extCodebase);
		grunt.log.writeln('\tcws zip: '+extDeployZip);
		grunt.task.run(
			'chrome-extension-copy:'+extPath+":"+options.resources+":"+extCert,
			'chrome-extension-compress:'+extPath+":"+(buildDir+extDeployZip)+":"+options.name,
			'chrome-extension-compile:'+options.chrome+":"+extPath+":"+extCert);
	});

	grunt.registerTask('chrome-extension-copy', '', function(path, resources, cert) {
		if(grunt.file.exists(path)) {
			grunt.file['delete'](path);
		}
		grunt.file.mkdir(path);
		grunt.config.set("copy.extension", { files: [
			{expand: true, cwd: '.', src: resources, dest: path},
			{flatten:true, expand: true, cwd: '.', src: cert, dest: path,
				rename: function(dest) {//, matchedSrcPath, options
					return dest + 'key.pem';
				}
			}
		]});
		grunt.task.run('copy:extension');
	});

	grunt.registerTask('chrome-extension-compress', '', function(path, archive, name){
		grunt.config.set("compress.extension", {
			options: { archive: archive },
			files: [
				// dest == the folder name within the zip. explicit here, but equivilant to passing empty string 
				{expand: true, cwd: path,  src: ["**/*"], dest: name }
			]
		});
		grunt.task.run('compress:extension');

		var certPath = path + "key.pem";
		if(grunt.file.exists(certPath)) {
			// remove cert, before compiling crx. It's only required by the chrome web store in the zip
			grunt.file['delete'](certPath);
		}
	});

	grunt.registerTask('chrome-extension-compile', '', function(chrome, path, cert) {
		var done = this.async();
		var chromeOptions = {
			cmd: chrome,
			args: [
				'--pack-extension='+path,
				'--pack-extension-key='+cert,
				'--no-message-box'
			]
		};
		//chromeOptions = {cmd: 'ls', args:['-ltra', chrome]};
		grunt.util.spawn(chromeOptions, function(error, result, code) {
			if(error && code !== 0) {
				//console.dir(result);
				grunt.log.write(result.stdout+" ").error();
			} else {
				grunt.log.write(result+" ").ok();
			}
			done(true);
		});
	});

/*
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('chrome_compile', 'Your task description goes here.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(options.separator));

      // Handle options.
      src += options.punctuation;

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });
 */

};
