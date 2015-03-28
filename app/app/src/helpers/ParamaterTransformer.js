define(function(require, exports, module) {
    var Transform = require('famous/core/Transform');

    function ParamaterTransformer(config, model) {
        this.config = config;
        this.model = model;
    }

    ParamaterTransformer.prototype.constructor = ParamaterTransformer;
    ParamaterTransformer.prototype.calculateTransform = function() {
        var self = this;
        var rotate, timePassed, x, y, xyRatio, scale, timeOffset, translateYSpeed,translateXSpeed, translateX, translateY, rotateSpeed, rotateAngle, zoom, zoomFunction, translateFunction, zoomSpeed, zoomAmount, height, zoomCutStart, zoomCutEnd, translateCutStart, translateCutEnd, zoomRelativeMultiplier, skewSpeed, skewAmount, skew, animationSpeed, numFrames;
        x = parseFloat(self.config.initialX);
        y = parseFloat(self.config.initialY);
        scale = parseFloat(self.config.scale);
        xyRatio = parseFloat(self.config.xyRatio);
        timePassed = parseFloat(Date.now());
        timeOffset = parseFloat(self.config.timeOffset);
        translateXSpeed = parseFloat(self.config.translateXSpeed);
        translateYSpeed = parseFloat(self.config.translateYSpeed);
        translateX = parseFloat(self.config.translateX);
        translateY = parseFloat(self.config.translateY);
        rotateSpeed = parseFloat(self.config.rotateSpeed);
        rotateAngle = parseFloat(self.config.rotateAngle);
        skewSpeed = parseFloat(self.config.skewSpeed);
        skewAmount = parseFloat(self.config.skewAmount);
        zoomSpeed = parseFloat(self.config.zoomSpeed);
        zoomAmount = parseFloat(self.config.zoomAmount);
        zoomCutStart = parseFloat(self.config.zoomCutStart);
        zoomCutEnd = parseFloat(self.config.zoomCutEnd);
        translateCutStart = parseFloat(self.config.translateCutStart);
        translateCutEnd = parseFloat(self.config.translateCutEnd);
        height = parseFloat(self.config.height);
        zoomRelativeMultiplier = parseFloat(self.config.zoomRelativeMultiplier);
        animationSpeed = parseFloat(self.config.animationSpeed) || 100;
        numFrames = parseFloat(self.config.numFrames);
        if (self.config.motionType === 'triangle'){
            translateFunction = self.triangleFunction;
        }
        else {
            translateFunction = self.sinFunction;
        }
        zoomFunction = self.zeroOneSinFunction;
        skewFunction = self.zeroOneSinFunction;
        var zoomFunctionPeriod = 2 * Math.PI;
        if (self.config.zoomTypeCut){
            zoomFunction = self.cutFunction(zoomFunction, zoomCutStart, zoomCutEnd, zoomFunctionPeriod);
        }
        var translateFunctionPeriod = 2 * Math.PI;
        if (self.config.translateTypeCut){
            translateFunction = self.cutFunction(translateFunction, translateCutStart, translateCutEnd, translateFunctionPeriod);
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
        if (self.config.skew){
            skew = 1+skewFunction((timePassed+timeOffset)/skewSpeed, skewAmount);
        }
        else {
            skew = 1;
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
            var frameNumber = Math.floor(self.sawToothFunction((timePassed+timeOffset)/animationSpeed, numFrames));
            y -= frameNumber * self.model.page.y * zoom;
        }
        return Transform.thenMove(
            Transform.thenScale(
                Transform.rotate(0,0,rotate),
                [scale*xyRatio*zoom*skew,scale*zoom,1])
            ,[x,y,height]
        );
    };

    ParamaterTransformer.prototype.sinFunction = function(xPosition, range) {
        return Math.sin(xPosition)*range;
    };

    ParamaterTransformer.prototype.zeroOneSinFunction = function(xPosition, range) {
        return (Math.sin(xPosition)+1)/2*range;
    };

    ParamaterTransformer.prototype.absSinFunction = function(xPosition, range) {
        return -Math.abs(Math.sin(xPosition))*range;
    };

    ParamaterTransformer.prototype.triangleFunction = function(xPosition, range) {
        return (2/Math.PI)*Math.asin(Math.sin(xPosition))*range;
    };

    ParamaterTransformer.prototype.sawToothFunction = function(xPosition, range) {
        return range*(xPosition - Math.floor(xPosition));
    };

    ParamaterTransformer.prototype.cutFunction = function(initialFunction, start, end, normalPeriod) {
        var newPeriodPercent = (end-start);
        var newPeriod = normalPeriod*newPeriodPercent/100;
        var newFunction = function(xPosition, range) {
            var startX = normalPeriod * start/100;
            var endX = normalPeriod * end/100;
            var normalXPosition = xPosition % normalPeriod;
            if (normalXPosition < startX || normalXPosition > endX){
                return 0;
            }
            else {
                return initialFunction((normalPeriod*normalXPosition)/newPeriod, range);
            }
        };
        return newFunction;
    };

    module.exports = ParamaterTransformer;
});
