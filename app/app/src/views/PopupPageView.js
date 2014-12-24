define(function(require, exports, module) {
    var PageView  = require('views/PageView');
    var PopupView  = require('views/PopupView');

    function _createPage() {
        var self = this;

        this.popupViews = [];
        this.popups.forEach(function(popup) {
            var popupView = new PopupView(popup);
            self.popupViews.push(popupView);
            self._add(popupView);
        });
    }

    function PopupPageView(model) {
        PageView.apply(this, arguments);
        this.popups = model.popups;

        _createPage.call(this);
    }

    PopupPageView.prototype = Object.create(PageView.prototype);
    PopupPageView.prototype.constructor = PopupPageView;

    module.exports = PopupPageView;
});
