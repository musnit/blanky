/*** AppView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var StateModifier = require('famous/modifiers/StateModifier');

    var Page19View = require('views/Page19View');

    function _createPageView() {
        this.contentView = new Page19View();
        this.pageModifier = new StateModifier();

        this.add(this.pageModifier).add(this.contentView);
    }

    function AppView() {
        View.apply(this, arguments);

        _createPageView.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {};

    module.exports = AppView;
});
