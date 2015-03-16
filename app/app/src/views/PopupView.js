define(function(require, exports, module) {
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var RenderController = require('famous/views/RenderController');

    function _createPopup() {
        var self = this;
        this.modifier = new Modifier({
            origin: function() {
                var originX = self.config.xOrigin || 0;
                var originY = self.config.yOrigin || 0;
                return [originX,originY];
            },
            transform: function() {
                var rotate, timePassed, x, y, xyRatio, scale, timeOffset, translateYSpeed,translateXSpeed, translateX, translateY, rotateSpeed, rotateAngle, zoom, zoomFunction, translateFunction, zoomSpeed, zoomAmount, height, zoomCutStart, zoomCutEnd, zoomRelativeMultiplier, animationSpeed;
                x = parseInt(self.config.initialX);
                y = parseInt(self.config.initialY);
                scale = parseFloat(self.config.scale);
                xyRatio = parseFloat(self.config.xyRatio);
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
                zoomCutStart = parseInt(self.config.zoomCutStart);
                zoomCutEnd = parseInt(self.config.zoomCutEnd);
                height = parseInt(self.config.height);
                zoomRelativeMultiplier = parseInt(self.config.zoomRelativeMultiplier);
                animationSpeed = parseInt(self.config.animationSpeed);
                if (self.config.motionType === 'triangle'){
                    translateFunction = self.triangleFunction;
                }
                else {
                    translateFunction = self.sinFunction;
                }
                zoomFunction = self.zeroOneSinFunction;
                var zoomFunctionPeriod = 2 * Math.PI;
                if (self.config.zoomTypeCut){
                    zoomFunction = self.cutFunction(zoomFunction, zoomCutStart, zoomCutEnd, zoomFunctionPeriod);
                }
                if (self.config.translate){
                    y += translateFunction((timePassed+timeOffset)/translateYSpeed, translateY);
                    x += translateFunction((timePassed+timeOffset)/translateXSpeed, translateX);
                }
                if (self.config.accel){
                    y += window.orientationDifference[0] * self.config.accelAmount;
                    x += window.orientationDifference[1] * self.config.accelAmount;
                }
                if (self.config.rotate){
                    rotate = Math.sin((timePassed+timeOffset)/rotateSpeed)/rotateAngle;
                }
                else {
                    rotate = 0;
                }
                if (self.config.zoom){
                    if (self.config.zoomRelativeTranslate){
                        zoom = 1+zoomFunction((timePassed+timeOffset)/zoomSpeed, zoomRelativeMultiplier/translateY);
                    }
                    else {
                        zoom = 1+zoomFunction((timePassed+timeOffset)/zoomSpeed, zoomAmount);
                    }
                }
                else {
                    zoom = 1;
                }
                if (self.config.animation){
                    var numFrames = self.config.frames.length;
                    animationSpeed = animationSpeed || 1;
                    var frameNumber = Math.floor(self.sawToothFunction((timePassed+timeOffset)/animationSpeed, numFrames));
                    self.renderController.show(self.frameSurfaces[frameNumber]);
                }
                return Transform.thenMove(
                    Transform.thenScale(
                        Transform.rotate(0,0,rotate),
                        [scale*xyRatio*zoom,scale*zoom,1])
                    ,[x,y,height]
                );
            },
            align: [0,0]
        });

        if (this.config.frames){
            this.frameSurfaces = this.config.frames.map(
                function(frame) {
                    return new ImageSurface({
                        size: [self.model.page.x, self.model.page.y],
                        content: frame.url
                    });
                }
            );
            this.renderController = new RenderController();
            this.renderController.options.inTransition = false;
            this.renderController.options.outTransition = false;
            this.renderController.options.overlap = false;
            this.renderController.show(this.frameSurfaces[0]);
            this.surface = this.renderController;
        }
        else {
            this.surface = new ImageSurface({
                size: [this.model.page.x, this.model.page.y],
                content: this.config.url
            });
        }

        this.renderNode = this._add(this.modifier).add(this.surface);

    }

    function PopupView(config, model) {
        View.apply(this, arguments);
        this.config = config;
        this.model = model;
        _createPopup.call(this);
    }

    PopupView.prototype = Object.create(View.prototype);
    PopupView.prototype.constructor = PopupView;
    PopupView.prototype.sinFunction = function(xPosition, range) {
        return Math.sin(xPosition)*range;
    };

    PopupView.prototype.zeroOneSinFunction = function(xPosition, range) {
        return (Math.sin(xPosition)+1)/2*range;
    };

    PopupView.prototype.absSinFunction = function(xPosition, range) {
        return -Math.abs(Math.sin(xPosition))*range;
    };

    PopupView.prototype.triangleFunction = function(xPosition, range) {
        return (2/Math.PI)*Math.asin(Math.sin(xPosition))*range;
    };

    PopupView.prototype.sawToothFunction = function(xPosition, range) {
        return range*(xPosition - Math.floor(xPosition));
    };

    PopupView.prototype.cutFunction = function(initialFunction, start, end, normalPeriod) {
        var newPeriodPercent = (end-start);
        var newPeriod = normalPeriod*newPeriodPercent/100;
        var newFunction = function(xPosition, range) {
            var startX = normalPeriod * start/100;
            var endX = normalPeriod * end/100;
            if (xPosition < startX || xPosition > endX){
                return 0;
            }
            else {
                return initialFunction((normalPeriod*xPosition)/newPeriod, range);
            }
        };
        return newFunction;
    };

    module.exports = PopupView;
});
