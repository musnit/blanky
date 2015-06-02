/*** AppNode.js ***/

define(function(require, exports, module) {
    var Famous = require('famous');
    var Node          = Famous.core.Node;
    var PopupPageNode = require('nodes/PopupPageNode');
    var PagerNode = require('nodes/PagerNode');

    function AppNode(scene, topScene) {
        Node.apply(this, arguments);
        scene.addChild(this);
        this.pagerNode = new PagerNode();
        this.addChild(this.pagerNode);
        this.scene = scene;
        this.topScene = topScene;
    }

    AppNode.prototype = Object.create(Node.prototype);
    AppNode.prototype.constructor = AppNode;
    AppNode.prototype.createAndShowPage = function(pageJSON) {
        this.contentNode = new PopupPageNode(pageJSON, this.scene, this.topScene);
        this.pagerNode.showPage(this.contentNode);
    };
    AppNode.prototype.clearPage = function() {
        this.pagerNode.clearPage();
    };
    AppNode.DEFAULT_OPTIONS = {};

    module.exports = AppNode;
});
