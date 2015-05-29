define(function(require, exports, module) {

    var Famous = require('famous');
    var Node = Famous.core.Node;

    function PagerNode() {
        Node.apply(this, arguments);
    }

    PagerNode.prototype = Object.create(Node.prototype);
    PagerNode.prototype.constructor = PagerNode;
    PagerNode.prototype.showPage = function(contentNode) {
      this.addChild(contentNode);
      this.currentContent = contentNode;
    };
    PagerNode.prototype.clearPage = function(contentNode) {
      this.removeChild(this.currentContent);
    };
    module.exports = PagerNode;
});
