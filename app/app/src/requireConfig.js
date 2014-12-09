/*globals require*/
require.config({
    shim: {

    },
    paths: {
        famous: '../lib/famous',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        rivets: '../lib/rivets/dist/rivets'
    },
    packages: [

    ]
});
require(['main']);
