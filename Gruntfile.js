module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: ['./public/patterns'],

    patternlab: {
      options: {
        src: './source',
        dest: './public',
        assetRoot: '/source/_patternlab-files/styleguide'
      }
    },

		sync: {
			main: {
				files: [
					{ expand: true, cwd: './source/js/', src: '*', dest: './public/js/'},
					{ expand: true, cwd: './source/css/', src: 'style.css', dest: './public/css/' },
					{ expand: true, cwd: './source/images/', src: ['*.png', '*.jpg', '*.gif', '*.jpeg'], dest: './public/images/' },
					{ expand: true, cwd: './source/images/sample/', src: ['*.png', '*.jpg', '*.gif', '*.jpeg'], dest: './public/images/sample/'},
					{ expand: true, cwd: './source/fonts/', src: '*', dest: './public/fonts/'},
					{ expand: true, cwd: './source/_data/', src: 'annotations.js', dest: './public/data/' }
				]
			}
		},
    
		watch: {
			mustache: {
				files: ['source/_patterns/**/*.mustache'],
				tasks: ['default'],
				options: { 
          livereload: '<%= connect.options.livereload %>',
          spawn: false 
        }
			},
			data: {
				files: ['source/_patterns/**/*.json', 'source/_data/*.json'],
				tasks: ['default'],
        options: {
          livereload: '<%= connect.options.livereload %>',
          spawn: false
        },
			},
			livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>',
          spawn: false
        },
        files: [
          'public/index.html',
          'public/patterns/*/*.html',
          'public/css/*.css',
          'public/js/*.js'
        ]
      }
		},

		connect: {
			options: {
        port: 9000,
        livereload: 35729,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          // open: true,
          base: ['.']
        }
      },
		},

		sass: {
			build: {
				options: {
					style: 'expanded',
					precision: 8
				},
				files: {
					'./source/css/style.css': './source/css/style.scss',
					'./public/styleguide/css/static.css': './public/styleguide/css/static.scss',
					'./public/styleguide/css/styleguide.css': './public/styleguide/css/styleguide.scss'
				}
			}
		}

	});

	// load all grunt tasks
 	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	//load the patternlab task
	grunt.task.loadTasks('./builder/');

	//if you choose to use scss, or any preprocessor, you can add it here
  grunt.registerTask('default', ['patternlab', /*'sass',*/ 'sync']);

	// serve the project
	grunt.registerTask('serve', ['default', 'connect:livereload', 'watch']);

	//travis CI task
	grunt.registerTask('travis', ['clean', 'concat', 'patternlab', /*'sass',*/ 'copy', 'qunit'])
};