/* globals define */
define(function(require, exports, module) {
    var Famous = require('famous');

    var DOMElement = Famous.domRenderables.DOMElement;
    var FamousEngine = Famous.core.FamousEngine;
    FamousEngine.init();
    var scene = FamousEngine.createScene('#device-screen');
    var node1 = scene.addChild();
    var domEl1 = new DOMElement(node1, {
        content: 'first place'
    });

    var scene2 = FamousEngine.createScene('#device-screen2');
    var node2 = scene2.addChild();

    var domEl2 = new DOMElement(node2, {
        content: 'first place'
    });
});
