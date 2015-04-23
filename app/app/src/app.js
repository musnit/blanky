/* globals define */
define(function(require, exports, module) {
    'use strict';
    var Fixtures = require('Fixtures');
    window.Fixtures = Fixtures;
    var pagesModel = {};
    pagesModel.pages = Fixtures.results;
    window.pagesModel = pagesModel;
    var loopingIDs = ['Du6zsqF3x0','FnTu1Egg5v','w9zCNnEbfC'];
    var loopNum = 1;

    var BlankyApp = require('BlankyApp');
    var blanky = new BlankyApp();

    blanky.loadPage(window.initialPageId);

    document.onclick= function(event) {
        blanky.clearPage();
        blanky.loadPage(loopingIDs[loopNum%3]);
        loopNum++;
    };
});
