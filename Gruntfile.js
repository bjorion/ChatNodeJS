
// "Lint" the JS files
module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			allFiles: ['app/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('default', ['jshint']);
};