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
                var rotate, timePassed, x, y, xyRatio, scale, timeOffset, translateYSpeed,translateXSpeed, translateX, translateY, rotateSpeed, rotateAngle, zoom;
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
                zoomSpeed = parseInt(self.config.zoomSpeed);
                zoomAmount = parseInt(self.config.zoomAmount);
                height = parseInt(self.config.height);
                if (self.config.translate){
                    y += Math.sin((timePassed+timeOffset)/translateYSpeed)*translateY;
                    x += Math.sin((timePassed+timeOffset)/translateXSpeed)*translateX;
                }
                if (self.config.accel){
                    x += window.orientationDifference[0];
                    y += window.orientationDifference[1];
                }
                if (self.config.rotate){
                    rotate = Math.sin((timePassed+timeOffset)/rotateSpeed)/rotateAngle;
                }
                else {
                    rotate = 0;
                }
                if (self.config.zoom){
                    zoom = (Math.sin((timePassed+timeOffset)/zoomSpeed)+1)/2*zoomAmount;
                }
                else {
                    zoom = 0;
                }
                return Transform.thenScale(
                    Transform.thenMove(
                        Transform.rotate(0,0,rotate),
                        [x,y,height])
                    ,[scale*xyRatio+zoom,scale+zoom,1]
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
