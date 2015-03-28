define(function(require, exports, module) {
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var Modifier = require('famous/core/Modifier');
    var View = require('famous/core/View');
    var ParamaterTransformer = require('helpers/ParamaterTransformer');

    function _createPopup() {
        var self = this;
        this.modifier = new Modifier({
            origin: function() {
                var originX = self.config.xOrigin || 0;
                var originY = self.config.yOrigin || 0;
                return [originX,originY];
            },
            transform: function() {
                var transformer = new ParamaterTransformer(self.config, self.model);
                var transform = transformer.calculateTransform();
                return transform;
            },
            align: [0,0]
        });

        var sizeY;
        if (this.config.animation && this.config.numFrames){
            sizeY = this.model.page.y*this.config.numFrames;
        }
        else {
            sizeY = this.model.page.y;
        }

        this.surface = new ImageSurface({
            size: [this.model.page.x, sizeY],
            content: this.config.url
        });

        this._add(this.modifier).add(this.surface);

    }

    function PopupView(config, model) {
        View.apply(this, arguments);
        this.config = config;
        this.model = model;
        _createPopup.call(this);
    }

    PopupView.prototype = Object.create(View.prototype);
    PopupView.prototype.constructor = PopupView;

    module.exports = PopupView;
});
