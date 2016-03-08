/**
 * grunt-pagespeed-ngrok
 * http://www.jamescryer.com/grunt-pagespeed-ngrok
 *
 * Copyright (c) 2014 James Cryer
 * http://www.jamescryer.com
 */
'use strict'

var ngrok = require('ngrok');

module.exports = function(grunt) {

  // Load grunt tasks
  require('load-grunt-tasks')(grunt);
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  // Grunt configuration
  grunt.initConfig({
    clean: ['dist'],
    copy: {
      main: {
        expand: true,
        cwd: 'src',
        src: '**',
        dest: 'dist/',
      },
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: '**/*.html',
          dest: 'dist/'
        }]
      }
    },
    pagespeed: {
      options: {
        nokey: true,
        locale: "en_GB",
        threshold: 40
      },
      local: {
        options: {
          strategy: "desktop"
        }
      },
      mobile: {
        options: {
          strategy: "mobile"
        }
      }
    },
    cssmin: {
      sitecss: {
        options: {
          banner: '/* My minified css file */'
        },
        files: [{
          expand: true,
          cwd: 'src/views/css',
          src: '*.css',
          dest: 'dist/views/css'
        }]
      }
    },
    uncss: {
      dist: {
        options: {
          ignore: [/js-.+/, '.special-class'],
          ignoreSheets: [/fonts.googleapis/],
        },
        files: {
          'dist/css/unused-removed.css': ['src/index.html', 'src/views/pizza.html']
        }
      }
    },
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 5
        },
        files: [{
          expand: true,
          cwd: 'src/views/images',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/views/images'
        }]
      }
    },
    uglify: {
      options: {
        compress: true
      },
      my_target: {
        files: {
          'dist/views/js/main.js': 'src/views/js/main.js'
        }
      }
    }
  });

  // Register customer task for ngrok
  grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
    var done = this.async();
    var port = 8080;

    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.config.set('pagespeed.options.url', url);
      grunt.task.run('pagespeed');
      done();
    });
  });

  // Register default tasks
  grunt.registerTask('default', ['clean', 'copy', 'uglify', 'cssmin', 'htmlmin', 'uncss', 'imagemin']);
  // grunt.registerTask('default', ['psi-ngrok']);
};
