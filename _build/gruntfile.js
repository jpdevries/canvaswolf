module.exports = function(grunt) {
  grunt.initConfig({
    dirs:{
        'lib':'./lib/',
        theme: '../',
        assets:'assets/',
        scss:'./scss/',
        css:'css/',
        js:'js/'
    },
    copy: {
      canvg: {
        files: [
          {src:'canvg/**/*',cwd:'<%= dirs.lib %>',dest:'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>vendor/',expand:true}
        ]
      }
    },
    sass: {
        dist: {
    		options:{
        		style: 'compressed',
        		compass: false
    		},
    		files: {
    			'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css': '<%= dirs.scss %>main.scss'
    		}
        }
    },
    autoprefixer: {
      options: {
          browsers: ['last 2 versions', 'ie 8', 'ie 9']
      },
      dist: {
  		files: {
  			'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css'
  		}
      },
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.min.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css'
        }
      }
    },
    uglify: {
        js: {
          files: {
            '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>app.es5.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>app.es5.js',
              '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>app.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>app.js',
          }
        }
    },
    watch: {
		options: {
			livereload: true
		},
        scss: {
            files:['<%= dirs.scss %>*.scss'],
            tasks:['sass','autoprefixer','growl:scss']
        },
        js: {
            files:['<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>*.js'],
            tasks:['react','babel','growl:jsx']
        }
    },
	growl: { /* optional growl notifications requires terminal-notifer: gem install terminal-notifier */
		build: {
			title: "grunt",
			message: "Build complete."
		},
		scss: {
			title: "grunt",
			message: "Stylesheets created."
		},
		watch: {
			title: "grunt",
			message: "Watching. Grunt has its eye on you."
		},
		jsx: {
			title: "grunt",
			message: "Compiled JSX files."
		}
	}
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.loadNpmTasks('grunt-growl');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['growl:watch', 'watch']);
  grunt.registerTask('build', ['sass','autoprefixer','cssmin', 'uglify', 'growl:build']);
};
