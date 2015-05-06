define(function(require, exports, module) {
    var View = require('famous/core/View');
    var PopupView  = require('views/PopupView');

    function _createPage() {
        var self = this;
        this.popupViews = [];
        this.popups.forEach(function(popup) {
            var popupView = new PopupView(popup, self.model);
            self.popupViews.push(popupView);

            self.add(popupView);
        });
    }

    function PopupPageView(model) {
        View.apply(this, arguments);
        this.popups = model.popups;
        this.model = model;

        _createPage.call(this);
        var self = this;
        this.contentInserted = function() {
            self.popupViews.forEach(function(popupView) {
                popupView.needsUpdating = true;
            });
        };
    }

    PopupPageView.prototype = Object.create(View.prototype);
    PopupPageView.prototype.constructor = PopupPageView;

    module.exports = PopupPageView;
});
