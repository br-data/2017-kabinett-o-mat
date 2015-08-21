module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: {

            build: {
                src: ['dist']
            }
        },

        uglify: {

            build: {

                files: {
                    
                    'dist/js/app.min.js': [
                        'app/js/config.js',
                        'app/js/utils.js',
                        'app/js/tracking.js',
                        'app/js/sharing.js',
                        'app/js/app.js'
                    ]
                }
            }
        },

        sass: {

            build: {

                options: {

                    style: 'expanded'
                },
                files: {

                    'app/css/main.css': 'app/scss/main.scss'
                }
            }
        },

        postcss: {

            options: {

                map: true,
                processors: [
                    require('autoprefixer-core')({ browsers: 'last 2 versions' })
                ]},

            build: {

                src: 'app/css/*.css'
            }
        },

        cssmin: {

            build: {

                src: 'app/css/*',
                dest: 'dist/css/main.min.css'
            }
        },

        copy: {

            build: {

                files: [

                    { expand: true, flatten: true, src: ['app/index.html'], dest: 'dist/', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['app/data/*'], dest: 'dist/data/', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['app/font/*'], dest: 'dist/font/', filter: 'isFile' },
                    { expand: true, cwd: 'app/img/', src: ['**/*'], dest: 'dist/img/' }
                ]
            }
        },

        useminPrepare: {

            html: 'app/index.html'
        },

        usemin: {

            html: 'dist/index.html'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('build', ['clean:build', 'useminPrepare', 'uglify:build', 'sass:build', 'postcss:build', 'cssmin:build', 'copy:build', 'usemin']);
};