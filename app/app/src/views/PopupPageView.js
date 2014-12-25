define(function(require, exports, module) {
    var PageView  = require('views/PageView');
    var PopupView  = require('views/PopupView');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    function _createPage() {
        var self = this;
        this.popupViews = [];
        this.popups.forEach(function(popup) {
            var popupView = new PopupView(popup);
            self.popupViews.push(popupView);
            var modifier = new Modifier({
                        origin: [0.5, 0.5],
                        align: [0.5,0.5],
                        transform: function(){
                            return Transform.scale(self.model.camera.scale,self.model.camera.scale,1);
                        }
            });

            self._add(modifier).add(popupView);
        });
        this.ipad = new ImageSurface({
            size: [960, 650],
            content: '/content/images/ipad.png'
        });
        this.ipadModifier = new Modifier({
            origin: [0.506, 0.5],
            align: [0.5,0.5]
        });
        this._add(this.ipadModifier).add(this.ipad);
    }

    function PopupPageView(model) {
        PageView.apply(this, arguments);
        this.popups = model.popups;
        this.model = model;

        _createPage.call(this);
    }

    PopupPageView.prototype = Object.create(PageView.prototype);
    PopupPageView.prototype.constructor = PopupPageView;

    module.exports = PopupPageView;
});
