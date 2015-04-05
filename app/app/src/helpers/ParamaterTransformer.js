define(function(require, exports, module) {
    var Transform = require('famous/core/Transform');

    function ParamaterTransformer(config, model) {
        this.config = config;
        this.model = model;
    }

    ParamaterTransformer.prototype.constructor = ParamaterTransformer;
    ParamaterTransformer.prototype.calculateTransform = function() {
        var self = this;
        var pageSpeed, rotate, timePassed, x, y, xyRatio, scale, timeOffset, translateYSpeed,translateXSpeed, translateX, translateY, rotateSpeed, rotateAngle, zoom, zoomFunction, translateFunction, zoomSpeed, zoomAmount, height, zoomCutStart, zoomCutEnd, translateCutStart, translateCutEnd, zoomRelativeMultiplier, skewSpeed, skewAmount, skew, animationSpeed, numFrames;
        pageSpeed = parseFloat(self.model.page.speed) || 1;
        x = parseFloat(self.config.initialX);
        y = parseFloat(self.config.initialY);
        scale = parseFloat(self.config.scale);
        xyRatio = parseFloat(self.config.xyRatio);
        timePassed = parseFloat(Date.now());
        timeOffset = parseFloat(self.config.timeOffset);
        translateXSpeed = pageSpeed * parseFloat(self.config.translateXSpeed);
        translateYSpeed = pageSpeed * parseFloat(self.config.translateYSpeed);
        translateX = parseFloat(self.config.translateX);
        translateY = parseFloat(self.config.translateY);
        rotateSpeed = pageSpeed * parseFloat(self.config.rotateSpeed);
        rotateAngle = parseFloat(self.config.rotateAngle);
        skewSpeed = pageSpeed * parseFloat(self.config.skewSpeed);
        skewAmount = parseFloat(self.config.skewAmount);
        zoomSpeed = pageSpeed * parseFloat(self.config.zoomSpeed);
        zoomAmount = parseFloat(self.config.zoomAmount);
        zoomCutStart = parseFloat(self.config.zoomCutStart);
        zoomCutEnd = parseFloat(self.config.zoomCutEnd);
        translateCutStart = parseFloat(self.config.translateCutStart);
        translateCutEnd = parseFloat(self.config.translateCutEnd);
        height = parseFloat(self.config.height);
        zoomRelativeMultiplier = parseFloat(self.config.zoomRelativeMultiplier);
        animationSpeed = pageSpeed * parseFloat(self.config.animationSpeed) || 100;
        numFrames = parseFloat(self.config.numFrames);
        if (self.config.motionType === 'triangle'){
            translateFunction = self.triangleFunction;
        }
        else if (self.config.motionType === 'sawtooth'){
            translateFunction = self.sawToothFunction;
        }
        else {
            translateFunction = self.sinFunction;
        }
        zoomFunction = self.sawToothFunction;
        var skewFunction = self.sawToothFunction;
        if (self.config.zoomTypeCut){
            zoomFunction = self.cutFunction(zoomFunction, zoomCutStart, zoomCutEnd, zoomFunction.period);
        }
        if (self.config.translateTypeCut){
            translateFunction = self.cutFunction(translateFunction, translateCutStart, translateCutEnd, translateFunction.period);
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

    //amplitute: 2, about: 0, start: 0, period 2pi
    ParamaterTransformer.prototype.sinFunction = function(xPosition, range) {
        return Math.sin(xPosition)*range;
    };
    ParamaterTransformer.prototype.sinFunction.period = 2 * Math.PI;

    //amplitute: 1, about: 0.5, start: 0.5, period 2pi
    ParamaterTransformer.prototype.halfOneSinFunction = function(xPosition, range) {
        return (Math.sin(xPosition)+1)/2*range;
    };
    ParamaterTransformer.prototype.halfOneSinFunction.period = 2 * Math.PI;

    //amplitute: 1, about: 0.5, start: 0, period: 2pi
    ParamaterTransformer.prototype.zeroOneCosFunction = function(xPosition, range) {
        return ((1-Math.cos(xPosition))/2)*range;
    };
    ParamaterTransformer.prototype.zeroOneCosFunction.period = 2 * Math.PI;

    //amplitute: 1, about: 0.5, start: 0, period: pi
    ParamaterTransformer.prototype.absSinFunction = function(xPosition, range) {
        return -Math.abs(Math.sin(xPosition))*range;
    };
    ParamaterTransformer.prototype.absSinFunction.period = Math.PI;

    //amplitute: 2, about: 0, start: 0, period: 2pi
    ParamaterTransformer.prototype.triangleFunction = function(xPosition, range) {
        return (2/Math.PI)*Math.asin(Math.sin(xPosition))*range;
    };
    ParamaterTransformer.prototype.triangleFunction.period = 2 * Math.PI;

    //amplitute: 1, about: 0.5, start: 0, period: 1
    ParamaterTransformer.prototype.sawToothFunction = function(xPosition, range) {
        return range*(xPosition - Math.floor(xPosition));
    };
    ParamaterTransformer.prototype.sawToothFunction.period = 1;

    ParamaterTransformer.prototype.periodChangedFunction = function(initialFunction, change) {
        var newFunction = function(xPosition, range){
            return initialFunction(change*xPosition, range);
        };
        newFunction.period = initialFunction.period/change;
        return newFunction;
    }

    ParamaterTransformer.prototype.cutFunction = function(initialFunction, start, end, period) {
        var self = this;
        var factor = 100/(end-start);
        var newFunction = function(xPosition, range){
            var startX = period * start/100;
            var endX = period * end/100;
            var moddedXPosition = xPosition % period;
            if (moddedXPosition < startX || moddedXPosition > endX){
                return 0;
            }
            else {
                var modifiedFunction = self.periodChangedFunction(initialFunction, factor);
                return modifiedFunction(moddedXPosition-startX, range);
            }
        };
        newFunction.period = initialFunction.period/factor;
        return newFunction;
    }

    module.exports = ParamaterTransformer;
});