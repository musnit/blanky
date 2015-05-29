/* globals define */
define(function(require, exports, module) {
    var Famous = require('famous');

    var DOMElement = Famous.domRenderables.DOMElement;
    var FamousEngine = Famous.core.FamousEngine;
    FamousEngine.init();
    var scene = FamousEngine.createScene();
    var node1 = scene.addChild();

    var domEl1 = new DOMElement(node1, {
        content: '0'
    });

    node1.setSizeMode('absolute','absolute');
    node1.setAbsoluteSize(600,400);
    var num = 0;
    var changer = node1.addComponent({
        onUpdate: function(time) {
            node1.setPosition(200-150*Math.cos(time / 1000), 100, 0);
            if (time % 500 > 480){
                domEl1.setContent(num);
                num++;
            }
            node1.requestUpdateOnNextTick(changer);
        }
    });
    node1.requestUpdateOnNextTick(changer);
});
