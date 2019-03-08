'use strict';

var modRewrite = require('connect-modrewrite'),
    extend = require('extend'),
    defaultConfigs = require('./config/default'),
    localConfigs = require('./config/local'),
    configs = extend(true, {}, defaultConfigs, localConfigs);

module.exports = function (grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin',
        ngtemplates: 'grunt-angular-templates',
        ngconstant: 'grunt-ng-constant'
    });

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        paths: configs.paths,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            compass: {
                files: ['<%= paths.app %>/sass/{,*/}*.{scss,sass}'],
                tasks: ['compass:dev']
            },
            views: {
                files: ['<%= paths.app %>/views/**/*.html'],
                tasks: ['ngtemplates']
            },
            index: {
                files: ['<%= paths.app %>/index.html'],
                tasks: ['replace:dev']
            }
        },

        // BrowserSync
        browserSync: {
            options: {
                notify: true,
                background: true,
                watchTask: true,
                ghostMode: false,
                port: configs.backend.port,
                host: configs.backend.host,
                watchOptions: {
                    awaitWriteFinish: true
                },
                middleware: [
                    modRewrite(['^[^\\.]*$ /index.html [L]'])
                ],
                snippetOptions: {
                    // just append the snippet to the end of the file
                    rule: {
                        match: /<body id="app-body">/i,
                        fn: function (snippet, match) {
                            return match+snippet;
                        }
                    }
                }
            },
            'dev': {
                options: {
                    files: [
                        '<%= paths.tmp %>/index.html',
                        '<%= paths.tmp %>/styles/**/*.css',
                        '<%= paths.app %>/fonts/**/*',
                        '<%= paths.app %>/images/**/*',
                        '<%= paths.app %>/scripts/**/*.js',
                        '<%= paths.tmp %>/scripts/**/*.js'
                    ],
                    server: {
                        baseDir: [configs.paths.tmp, configs.paths.app],
                        routes: {
                            '/node_modules': './node_modules'
                        }
                    },
                }
            },
            'dist': {
                options: {
                    files: [
                        '<%= paths.dist %>/**/*'
                    ],
                    server: configs.paths.dist
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            'dev': '<%= paths.tmp %>',
            'dist': {
                files: [{
                    dot: true,
                    src: [
                        '<%= paths.tmp %>',
                        '<%= paths.dist %>/{,*/}*',
                        '!<%= paths.dist %>/.git{,*/}*'
                    ]
                }]
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= paths.app %>/sass',
                cssDir: '<%= paths.tmp %>/styles',
                generatedImagesDir: '<%= paths.tmp %>/images/generated',
                imagesDir: '<%= paths.app %>/images',
                javascriptsDir: '<%= paths.app %>/scripts',
                fontsDir: '<%= paths.app %>/styles/fonts',
                importPath: './node_modules',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            'dev': {
                options: {
                    debugInfo: false
                }
            },
            'dist': {
                options: {
                    generatedImagesDir: '<%= paths.dist %>/images/generated'
                }
            },
        },

        // Renames files for browser caching purposes
        filerev: {
            'dist': {
                src: [
                    '<%= paths.dist %>/scripts/{,*/}*.js',
                    '<%= paths.dist %>/styles/{,*/}*.css',
                    '<%= paths.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '!<%= paths.dist %>/images/bg/{,*/}*.jpg',
                    '!<%= paths.dist %>/images/static/{,*/}*',
                    //'<%= paths.dist %>/fonts/**'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= paths.app %>/index.html',
            options: {
                dest: '<%= paths.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= paths.dist %>/{,*/}*.html'],
            css: ['<%= paths.dist %>/styles/**/*.css'],
            js: ['<%= paths.dist %>/scripts/**/*.js', '<%= paths.tmp %>/scripts/**/*.js'],
            options: {
                assetsDirs: [
                    '<%= paths.dist %>',
                    '<%= paths.dist %>/images',
                    '<%= paths.dist %>/styles',
                    '<%= paths.dist %>/scripts',
                ],
                patterns: {
                    js: [
                        [/(images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
                    ],
                    html: [
                        [/(images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the Html to reference our revved images']
                    ],
                }
            }
        },

        uglify: {
            options: {
                mangle: false,
                sourceMap: true
            }
        },

        imagemin: {
            'dist': {
                files: [{
                    expand: true,
                    cwd: '<%= paths.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= paths.dist %>/images'
                }]
            }
        },

        svgmin: {
            'dist': {
                files: [{
                    expand: true,
                    cwd: '<%= paths.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= paths.dist %>/images'
                }]
            }
        },

        htmlmin: {
            'dist': {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.dist %>',
                    src: ['*.html'],
                    dest: '<%= paths.dist %>'
                }]
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            'dist': {
                files: [{
                    expand: true,
                    cwd: '<%= paths.dist %>/scripts',
                    src: ['*.js', '!oldieshim.js'],
                    dest: '<%= paths.dist %>/scripts'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            'dev': {
                files: [
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap/dist/fonts',
                        src: ['{,*/}*.*'],
                        dest: '<%= paths.tmp %>/fonts/bootstrap'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: 'node_modules/font-awesome/fonts',
                        src: ['{,*/}*.*'],
                        dest: '<%= paths.tmp %>/fonts/fontawesome'
                    }
                ]
            },
            'dist': {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= paths.app %>',
                        dest: '<%= paths.dist %>',
                        src: [
                            '*.{ico,png,txt,xml}',
                            '.htaccess',
                            '*.html',
                            'favicons/**/*',
                            'images/**/*',
                            'fonts/**/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap/dist/fonts',
                        src: ['{,*/}*.*'],
                        dest: '<%= paths.dist %>/fonts/bootstrap'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: 'node_modules/font-awesome/fonts',
                        src: ['{,*/}*.*'],
                        dest: '<%= paths.dist %>/fonts/fontawesome'
                    }
                ]
            },
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            'dev': [
                'copy:dev',
                'compass:dev',
                'replace:dev',
                'ngconstant:dev',
                'ngtemplates'
            ],
            'dist': [
                'ngAnnotate:dist', // works on all js
                'ngconstant:dist', // create file configs.js
                'ngtemplates', // html to templates.js
                'compass:dist', // output styles/*.css
                'imagemin:dist', // works on images
                'svgmin:dist', // svg
                'replace:dist',
            ]
        },

        ngconstant: {
            // Options for all targets
            options: {
                space: '  ',
                wrap: '\'use strict\';\n\n {%= __ngModule %}',
                name: 'app-config',
            },
            'dev': {
                options: {
                    dest: '<%= paths.tmp %>/scripts/configs.js'
                },
                constants: {
                    configs: configs.frontend
                }
            },
            'dist': {
                options: {
                    dest: '<%= paths.tmp %>/scripts/configs.js'
                },
                constants: {
                    configs: defaultConfigs.frontend
                }
            }
        },

        ngtemplates:  {
            options: {
                module: 'bizawayApp',
                htmlmin: {
                    collapseBooleanAttributes:      true,
                    collapseWhitespace:             true,
                    removeAttributeQuotes:          true,
                    removeComments:                 true,
                    removeEmptyAttributes:          true,
                    removeRedundantAttributes:      true,
                    removeScriptTypeAttributes:     true,
                    removeStyleLinkTypeAttributes:  true
                }
            },
            app: {
                cwd: '<%= paths.app %>',
                src: 'views/**/*.html',
                dest: '<%= paths.tmp %>/scripts/templates.js'
            }
        },

        exec: {
            commit_dist: 'git add . && git commit -am "[Auto] - Compiled distribution files"',
            checkout: {
                cmd: function (branch) {
                    return 'git checkout '+branch;
                }
            },
            merge: {
                cmd: function (branch) {
                    return 'git merge '+branch;
                }
            },
            push: {
                cmd: function (branch) {
                    return 'git push origin '+branch;
                }
            }
        },
        replace: {
            'dev': {
                options: {
                    patterns: [
                        {
                            match: 'icomoon_style_path',
                            replacement: 'https://i.icomoon.io/public/e6ec1cca65/BizAway/style.css'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.app %>',
                        src: ['./index.html'],
                        dest: '<%= paths.tmp %>'
                    }
                ],
            },
            'dist': {
                options: {
                    patterns: [
                        {
                            match: 'icomoon_style_path',
                            replacement: 'https://d1azc1qln24ryf.cloudfront.net/126923/BizAway/style-cf.css?' + Math.floor(Math.random() * 10000)
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.app %>',
                        src: ['./index.html'],
                        dest: '<%= paths.dist %>'
                    }
                ],
            }
        }
    });

    grunt.registerTask('run', 'Run the server', function (env) {
        var tasks = [];
        if (env === 'prod') {
            tasks = [
                'browserSync:dist',
                'watch',
            ];
        } else {
            tasks = [
                'clean:dev',
                'concurrent:dev',
                'browserSync:dev',
                'watch'
            ];
        }

        grunt.task.run(tasks);
    });

    grunt.registerTask('default', ['run']);

    grunt.registerTask('build', 'Compile distribution files', function () {
        grunt.task.run([
            'clean:dist',
            'copy:dist',
            'useminPrepare',
            'concurrent:dist',
            'concat:generated',
            'uglify:generated',
            'cssmin:generated',
            'filerev',
            'usemin',
            'htmlmin'
        ]);
    });

    grunt.registerTask('deploy', 'Compile distribution files, merge develop into master and push for deploy', function (from_branch, to_branch) {
        if (!from_branch) {
            from_branch = 'develop';
        }
        if (!to_branch) {
            to_branch = 'master';
        }
        grunt.task.run([
            'build',
            'exec:commit_dist',
            'exec:checkout:'+to_branch,
            'exec:merge:'+from_branch,
            'exec:push:'+to_branch,
            'exec:checkout:'+from_branch
        ]);
    });
};
