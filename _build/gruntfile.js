module.exports = function(grunt) {
  grunt.initConfig({
    dirs:{
        lib:'./lib/',
        theme: '../',
        assets:'assets/',
        js:'js/'
    },
    uglify: {
        js: {
          files: {
            '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>app.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>app.js'
          }
        }
    },
    watch: {
  		options: {
  			livereload: true
  		},
      js: {
          files:['<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>*.js','!*.min.js'],
          tasks:['uglify','growl:uglify']
      }
    },
	growl: { /* optional growl notifications requires terminal-notifer: gem install terminal-notifier */
		build: {
			title: "grunt",
			message: "Build complete."
		},
		watch: {
			title: "grunt",
			message: "Watching. Grunt has its eye on you."
		},
		uglify: {
			title: "grunt",
			message: "JavaScript minified."
		}
	}
  });

  grunt.loadNpmTasks('grunt-growl');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['growl:watch', 'watch']);
  grunt.registerTask('build', ['uglify', 'growl:build']);
};
