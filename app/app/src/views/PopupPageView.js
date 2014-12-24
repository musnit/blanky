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

    function Page22And23View(model) {
        PageView.apply(this, arguments);
        this.popups = model.popups;

        _createPage.call(this);
    }

    Page22And23View.prototype = Object.create(PageView.prototype);
    Page22And23View.prototype.constructor = Page22And23View;

    module.exports = Page22And23View;
});
