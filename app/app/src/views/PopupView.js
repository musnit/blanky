define(function(require, exports, module) {
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');

    function _createPopup() {
        var self = this;
        this.modifier = new Modifier({
            origin: [0, 0],
            transform: function() {
                var rotate, timePassed, x, y, xyRatio, scale;
                x = parseInt(self.config.initialX);
                y = parseInt(self.config.initialY);
                scale = parseFloat(self.config.scale);
                xyRatio = parseFloat(self.config.xyRatio)
                timePassed = parseInt(Date.now());
                timeOffset = parseInt(self.config.timeOffset);
                translateXSpeed = parseInt(self.config.translateXSpeed);
                translateYSpeed = parseInt(self.config.translateYSpeed);
                translateX = parseInt(self.config.translateX);
                translateY = parseInt(self.config.translateY);
                rotateSpeed = parseInt(self.config.rotateSpeed);
                rotateAngle = parseInt(self.config.rotateAngle);
                if (self.config.translate){
                    y += Math.sin((timePassed+timeOffset)/translateYSpeed)*translateY;
                    x += Math.sin((timePassed+timeOffset)/translateXSpeed)*translateX;
                }
                else {
                    y += 0;
                    x += 0;
                }
                if (self.config.rotate){
                    rotate = Math.sin((timePassed+timeOffset)/rotateSpeed)/rotateAngle;
                }
                else {
                    rotate = 0;
                }
                return Transform.thenScale(
                    Transform.thenMove(
                        Transform.rotate(0,0,rotate),
                        [x,y,0])
                    ,[scale*xyRatio,scale,1]
                );
            },
            align: [0,0]
        });

        this.surface = new ImageSurface({
            size: [2048, 1040],
            content: this.config.url
        });

        this._add(this.modifier).add(this.surface);

    }

    function PopupView(config) {
        View.apply(this, arguments);
        this.config = config;
        _createPopup.call(this);
    }

    PopupView.prototype = Object.create(View.prototype);
    PopupView.prototype.constructor = PopupView;

    module.exports = PopupView;
});
