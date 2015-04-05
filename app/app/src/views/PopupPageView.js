define(function(require, exports, module) {
    var View = require('famous/core/View');
    var PopupView  = require('views/PopupView');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ParamaterTransformer = require('helpers/ParamaterTransformer');

    function _createPage() {
        var self = this;
        this.popupViews = [];
        self.model.camera.scale = self.model.camera.scale * self.model.camera.scale;
        this.popups.forEach(function(popup) {
            var popupView = new PopupView(popup, self.model);
            self.popupViews.push(popupView);
            var modifier = new Modifier({
                        origin: function() {
                            var originX = parseFloat(self.model.camera.xOrigin) || 0;
                            var originY = parseFloat(self.model.camera.yOrigin) || 0;
                            return [originX,originY];
                        },
                        align: [0.5,0.5],
                        transform: function() {
                            var transformer = new ParamaterTransformer(self.model.camera, self.model);
                            var transform = transformer.calculateTransform();
                            return transform;
                        },
            });

            self._add(modifier).add(popupView);
        });
    }

    function PopupPageView(model) {
        View.apply(this, arguments);
        this.popups = model.popups;
        this.model = model;

        _createPage.call(this);
    }

    PopupPageView.prototype = Object.create(View.prototype);
    PopupPageView.prototype.constructor = PopupPageView;

    module.exports = PopupPageView;
});
