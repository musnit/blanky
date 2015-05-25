/* globals define */
define(function(require, exports, module) {
    'use strict';
    var Fixtures = require('Fixtures');
    window.Fixtures = Fixtures;
    var pagesModel = {};
    pagesModel.pages = Fixtures.results;
    window.pagesModel = pagesModel;
    var loopingIDs = ['UHGPYzstxO','gBqF9PtfBm','w9zCNnEbfC','Du6zsqF3x0'];
    var loopNum = 1;
    var BlankyApp = require('BlankyApp');
    var startApp = function(){
        var blanky = new BlankyApp();

        blanky.loadPage(window.initialPageId);
    };

    var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    if (app) {
        document.addEventListener("deviceready", startApp, false);
    }
    else {
        startApp();
    }

    document.onclick= function(event) {
        var x = event.clientX;
        if (x < window.screen.width/2){
            window.orientationController.reset();
        }
        else {
            blanky.clearPage();
            blanky.loadPage(loopingIDs[loopNum%loopingIDs.length]);
            loopNum++;
        }
    };
});
