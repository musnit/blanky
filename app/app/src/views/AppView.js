/*** AppView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var StateModifier = require('famous/modifiers/StateModifier');

    var PopupPageView = require('views/PopupPageView');

    function _createPageView() {
        this.contentView = new PopupPageView(this.model);
        this.pageModifier = new StateModifier();

        this.add(this.pageModifier).add(this.contentView);
    }

    function AppView(model) {
        View.apply(this, arguments);
        this.model = model;

        _createPageView.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {};

    module.exports = AppView;
});
