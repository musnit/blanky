module.exports = function (grunt) {
  'use strict';
  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'processhtml:dev',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('buildtool', [
    'clean:dist',
    'lint',
    'processhtml:dist',
    'useminPrepare',
    'requirejs:compiletool',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('buildapp', [
    'clean:dist',
    'lint',
    'processhtml:dist',
    'useminPrepare',
    'requirejs:compileapp',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('build', [
    'buildtool'
  ]);

  grunt.registerTask('lint', [
    'jscs',
    'eslint'
  ]);
  
  grunt.registerTask('test', [
    'lint'
  ]);

  grunt.registerTask('default', [
    'buildtool'
  ]);
};
