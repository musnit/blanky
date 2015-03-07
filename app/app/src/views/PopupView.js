define(function(require, exports, module) {
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');

    function _createPopup() {
        var self = this;
        this.modifier = new Modifier({
            origin: function() {
                var originX = self.config.xOrigin || 0;
                var originY = self.config.yOrigin || 0;
                return [originX,originY];
            },
            transform: function() {
                var rotate, timePassed, x, y, xyRatio, scale, timeOffset, translateYSpeed,translateXSpeed, translateX, translateY, rotateSpeed, rotateAngle, zoom, zoomFunction, translateFunction, zoomSpeed, zoomAmount, height;
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
                height = parseInt(self.config.height);
                if (self.config.motionType === 'triangle'){
                    translateFunction = self.triangleFunction;
                }
                else {
                    translateFunction = self.sinFunction;
                }
                zoomFunction = self.zeroOneSinFunction;
                var zoomFunctionPeriod = 2 * Math.PI;
                if (self.config.zoomTypeCut){
                    zoomFunction = self.cutFunction(zoomFunction, self.config.zoomCutStart, zoomCutEnd, zoomFunctionPeriod);
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
                    zoom = 1+zoomFunction((timePassed+timeOffset)/zoomSpeed, (1/(translateY/-580))/15);
                }
                else {
                    zoom = 1;
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

        this.surface = new ImageSurface({
            size: [this.model.page.x, this.model.page.y],
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

    PopupView.prototype.cutFunction = function(initialFunction, start, end, normalPeriod) {
        var newPeriod = (end-start)/2;
        var newFunction = function(xPosition, range){
            if(xPosition < start || xPosition > end){
                return 0;
            }
            else{
                return initialFunction((normalPeriod*xPosition)/newPeriod, range)
            }
        }
        return newFunction;
    };

    module.exports = PopupView;
});
