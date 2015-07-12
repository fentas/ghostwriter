/*
 * grunt-devtools
 * https://github.com/vladikoff/grunt-devtools
 *
 * Copyright (c) 2013 vladikoff
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'grunt-plugin/tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: ['tmp', 'extension/build'],

    jst: {
      chrome: {
        files: {
          "extension/build/build-chrome/tmp/templates.js": ["extension/src/templates/**/*.*"]
        }
      },
      mozilla: {
        files: {
          "extension/build/build-mozilla/tmp/templates.js": ["extension/src/templates/**/*.*"]
        }
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      chrome: {
        src: [
          'extension/src/js/vendor/lodash.min.js',
          'extension/src/js/vendor/jquery.min.js',
          'extension/src/js/vendor/jquery-ui.min.js',
          'extension/src/js/vendor/jquery.layout-latest.js',
          'extension/src/js/vendor/jstree.min.js',
          'extension/src/js/vendor/ace.js',
          'extension/src/js/utils/*.js',
          'extension/src/js/lib/*.js',

          'extension/src-chrome/js/lib/*.js',
          'extension/build/build-chrome/tmp/templates.js',

          'extension/src/js/*.js'
        ],
        dest: 'extension/build/build-chrome/ghostwriter/js/devtools.js'
      },
      mozilla: {
        src: [
          'extension/src/js/vendor/lodash.min.js',
          'extension/src/js/vendor/jquery.min.js',
          'extension/src/js/vendor/jquery-ui.min.js',
          'extension/src/js/vendor/jquery.layout-latest.js',
          'extension/src/js/vendor/jstree.min.js',
          'extension/src/js/vendor/ace.js',
          'extension/src/js/utils/*.js',
          'extension/src/js/lib/*.js',
          
          'extension/src-mozilla/js/lib/*.js',
          'extension/build/build-mozilla/tmp/templates.js',

          'extension/src/js/*.js'
        ],
        dest: 'extension/build/build-mozilla/ghostwriter/js/devtools.js'
      }
    },

    copy: {
      chrome: {
        files: [
          { expand: true, cwd: 'extension/src/',
            src: ['*', 'css/**', 'img/**', 'fonts/**', '!less', '!templates'],
            dest: 'extension/build/build-chrome/ghostwriter'},
          { expand: true, cwd: 'extension/src-chrome/',
            src: ['*'],
            dest: 'extension/build/build-chrome/ghostwriter'}
        ]
      },
      mozilla: {
        files: [
          { expand: true, cwd: 'extension/src/',
            src: ['*', 'css/**', 'img/**', 'fonts/**', '!less', '!templates'],
            dest: 'extension/build/build-mozilla/ghostwriter'},
          { expand: true, cwd: 'extension/src-mozilla/',
            src: ['*'],
            dest: 'extension/build/build-mozilla/ghostwriter'}
        ]
      }
    },

    less: {
      options: {
        strictMath: true
      },
      chrome: {
        files: {
          "extension/build/build-chrome/ghostwriter/css/devtools.css": "extension/src/less/devtools.less",
          "extension/build/build-chrome/ghostwriter/css/jquery-ui.min.css": "extension/src/less/vendor/jquery-ui.min.css",
          "extension/build/build-chrome/ghostwriter/css/font-awesome.css": "extension/src/less/vendor/font-awesome.css",
          "extension/build/build-chrome/ghostwriter/css/jstree.css": "extension/src/less/vendor/jstree.css"
        }
      },
      mozilla: {
        files: {
          "extension/build/build-mozilla/ghostwriter/css/devtools.css": "extension/src/less/devtools.less",
          "extension/build/build-mozilla/ghostwriter/css/jquery-ui.min.css": "extension/src/less/vendor/jquery-ui.min.css",
          "extension/build/build-mozilla/ghostwriter/css/font-awesome.css": "extension/src/less/vendor/font-awesome.css",
          "extension/build/build-mozilla/ghostwriter/css/jstree.css": "extension/src/less/vendor/jstree.css"
        }
      }
    },

    watch: {
      extension: {
        options: {
          atBegin: true
        },
        files: [
          'extension/src/**/*',
          'extension/src-chrome/**/*',
          'extension/src-mozilla/**/*',
        ],
        tasks: ['build']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-devtools');

  grunt.registerTask('dev', ['watch']);

  grunt.registerTask('default', ['clean', 'build']);

  grunt.registerTask('build:chrome', [
    'copy:chrome',
    'jst:chrome',
    'concat:chrome',
    'less:chrome'
  ]);

  grunt.registerTask('build:mozilla', [
   'copy:mozilla',
   'jst:mozilla',
   'concat:mozilla',
   'less:mozilla'
 ]);

  // build all extensions
  grunt.registerTask('build', ['build:chrome', 'build:mozilla']);
};
