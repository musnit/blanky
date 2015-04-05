/*** AppView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');

    var PopupPageView = require('views/PopupPageView');
    var Lightbox = require('famous/views/Lightbox');
    var ParamaterTransformer = require('helpers/ParamaterTransformer');

    function _createAppView() {
        this.lightbox = new Lightbox({
        });
        this.add(this.lightbox);
    }

    function AppView() {
        View.apply(this, arguments);

        _createAppView.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;
    AppView.prototype.createAndShowPage = function(pageJSON) {
        this.contentView = new PopupPageView(pageJSON);
        this.lightbox.show(this.contentView);
    };

    AppView.DEFAULT_OPTIONS = {};

    module.exports = AppView;
});
