/*globals require*/
require.config({
    shim: {
      soundjs: {
        exports: 'createjs.Sound'
      },
      parse: {
        exports: 'Parse'
      }
    },
    paths: {
        famous: '../lib/famous',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        soundjs: '../lib/sound/soundjs-0.6.0.min',
        parse: '../lib/parse/parse-1.3.2.min',
        rivets: '../lib/rivets/rivets.min',
        sightglass: '../lib/rivets/sightglass'
    },
    packages: [

    ]
});
require(['tool/animatortool']);
