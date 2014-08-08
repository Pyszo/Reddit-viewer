'use strict';

module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			my_target:{
				files:{
					'minified/static/redditViewer.min.js': ['static/lib/angular.min.js','static/lib/bootstrap.min.js','static/lib/draganddrop.js','static/js/*.js']
				}
			}
		},
		cssmin:{
			combine:{
				files:{
					'minified/static/redditViewer.css': ['static/lib/bootstrap.min.css','static/css/css.css']
				}
			},
			minify:{
				files:{
					'minified/static/redditViewer.min.css': ['minified/static/redditViewer.css']
				}
			}		
		},
		htmlmin:{
			dist:{
				options:{
					removeComments: true,
					collapseWhitespace: true
				},
				files:{
					'minified/static/template/comment.html': 'static/js/template/comment.html',
					'minified/static/template/comments.html': 'static/js/template/comments.html',
					'minified/static/template/container.html': 'static/js/template/container.html',
					'minified/static/template/content.html': 'static/js/template/content.html',
					'minified/static/template/pager.html': 'static/js/template/pager.html',
					'minified/static/template/slot.html': 'static/js/template/slot.html',
					'minified/index.html': 'index.html'
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');

	grunt.registerTask('default', ['uglify','cssmin','htmlmin']);
};
