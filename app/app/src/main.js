/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var AppView = require('views/AppView');

    // create the main context
    var mainContext = Engine.createContext();
    mainContext.setPerspective(1000);
    var appView = new AppView();

    mainContext.add(appView);
});
