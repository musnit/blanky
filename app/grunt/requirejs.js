module.exports =  {
  compiletool: {
    options: {
      optimize: 'uglify2',
      uglify2: {
        mangler: {
          toplevel: true
        }
      },
      baseUrl: '<%= config.app %>/src',
      mainConfigFile: '<%= config.app %>/src/toolConfig.js',
      name: 'almond',
      include: 'tool/animatortool',
      insertRequire: ['tool/animatortool'],
      out: '<%= config.dist %>/src/main.js',
      wrap: true
    }
  }
};
