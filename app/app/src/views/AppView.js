/*** AppView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var ContentView = require('views/ContentView');
    var Page19View = require('views/Page19View');

    function AppView() {
        View.apply(this, arguments);

        _createPageView.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {};

    function _createPageView() {
        this.contentView = new Page19View();
        this.pageModifier = new StateModifier();

        this.add(this.pageModifier).add(this.contentView);
    }

    module.exports = AppView;
});
