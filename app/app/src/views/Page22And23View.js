define(function(require, exports, module) {
    var PageView  = require('views/PageView');
    var PopupView  = require('views/PopupView');

    function _createPage() {
        var self = this;
        this.initialTime = Date.now();

        this.popups = [
            {timer: this, url: '/content/images/pages/22and23/background.png'},
            {timer: this, url: '/content/images/pages/22and23/waves.png', translate: true, translateY: 100, translateX: 100},
            {timer: this, url: '/content/images/pages/22and23/ship.png', rotate: true, rotateAngle: 6},
            {timer: this, url: '/content/images/pages/22and23/main_pirate.png', rotate: true, rotateAngle: 5},
            {timer: this, url: '/content/images/pages/22and23/charlie.png', rotate: true, rotateAngle: 4},
            {timer: this, url: '/content/images/pages/22and23/front_rope.png', rotate: true, rotateAngle: 3}
        ];

        this.popupViews = [];
        this.popups.forEach(function(popup) {
            var popupView = new PopupView(popup);
            self.popupViews.push(popupView);
            self._add(popupView);
        });
    }

    function Page22And23View() {
        PageView.apply(this, arguments);
        _createPage.call(this);
    }

    Page22And23View.prototype = Object.create(PageView.prototype);
    Page22And23View.prototype.constructor = Page22And23View;

    module.exports = Page22And23View;
});
