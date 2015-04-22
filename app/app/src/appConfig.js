/*globals require*/
require.config({
    shim: {
      soundjs: {
        exports: "createjs.Sound" 
      }
    },
    paths: {
        famous: '../lib/famous',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        soundjs: '../lib/sound/soundjs-0.6.0.min',
    },
    packages: [

    ]
});
require(['app']);
