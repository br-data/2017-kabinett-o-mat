module.exports = function (grunt) {

    'use strict';

    var autoprefixer = require('autoprefixer-core');

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: {

            dist: {
                src: ['dist']
            }
        },

        uglify: {

            dist: {

                files: {
                    
                    'dist/js/app.min.js': [
                        'app/js/config.js',
                        'app/js/utils.js',
                        'app/js/common.js',
                        'app/js/tracking.js',
                        'app/js/sharing.js',
                        'app/js/dragging.js',
                        'app/js/list.js',
                        'app/js/lineup.js',
                        'app/js/app.js'
                    ]
                }
            }
        },

        sass: {

            dist: {

                options: {

                    style:'compressed'
                },
                
                files: {

                    'dist/css/main.min.css' : 'app/scss/main.scss'
                }
            },

            dev: {

                options: {

                    style:'expanded'
                },

                files: {

                    'app/css/main.css' : 'app/scss/main.scss'
                }
            }
        },

        postcss: {

            options: {

                processors: [

                    require('autoprefixer-core')({
                        
                        browsers: ['> 5%', 'last 2 versions', 'IE 7', 'IE 9']
                    })
                ],
                map: true
            },
            dist: {

                files: {

                    'dist/css/main.min.css': 'dist/css/main.min.css'
                }
            },

            dev: {

                files: {

                    'app/css/main.css' : 'app/css/main.css'
                }
            }
        },

        copy: {

            dist: {

                files: [

                    { expand: true, flatten: true, src: ['app/index.html'], dest: 'dist/', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['app/favicon.ico'], dest: 'dist/', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['app/data/*'], dest: 'dist/data/', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['app/font/*'], dest: 'dist/font/', filter: 'isFile' },
                    { expand: true, cwd: 'app/img/', src: ['**/*'], dest: 'dist/img/' },

                    { expand: true, flatten: true, src: ['bower_components/interact/interact.min.js'],
                        dest: 'dist/js/lib/', filter: 'isFile' },

                    { expand: true, flatten: true, src: ['bower_components/classList/index.js'],
                        dest: 'dist/js/lib/', filter: 'isFile', rename: function(dest, src) {
                            return dest + src.replace('index','classList.min');
                        }
                    },
                ]
            }
        },

        useminPrepare: {

            html: 'app/index.html'
        },

        usemin: {

            html: 'dist/index.html'
        },

        watch: {

            scripts: {

                options: {

                    interrupt: true,
                },
                files: ['app/scss/**/*.scss'],
                tasks: ['sass:dev', 'postcss:dev'],
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('dist', ['clean', 'useminPrepare', 'uglify:dist', 'sass:dist', 'postcss', 'copy', 'usemin']);
};
