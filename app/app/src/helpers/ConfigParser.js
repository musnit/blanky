define(function(require, exports, module) {
    var MathFunctions = require('helpers/MathFunctions');

    function ConfigParser() {
    }

    ConfigParser.prototype.constructor = ConfigParser;
    ConfigParser.prototype.parseConfig = function(config, model) {
        var parsedConfig = {};
        parsedConfig.name = config.name;
        parsedConfig.url = config.url;
        parsedConfig.text = (config.text || '').replace(/"/g,'&quot;');
        parsedConfig.pageSpeed = parseFloat(model.page.speed) || 1;
        parsedConfig.numFrames = parseFloat(config.numFrames);
        parsedConfig.opacity = parseFloat(config.opacity) || 1;
        parsedConfig.sizeX = parseFloat(config.sizeX);
        parsedConfig.sizeY = parseFloat(config.sizeY);
        parsedConfig.x = parseFloat(config.initialX);
        parsedConfig.y = parseFloat(config.initialY);
        parsedConfig.xRotate = parseFloat(config.initialRotateX) || 0;
        parsedConfig.yRotate = parseFloat(config.initialRotateY) || 0;
        parsedConfig.zRotate = parseFloat(config.initialRotateZ) || 0;
        parsedConfig.xOrigin = parseFloat(config.xOrigin) || 0;
        parsedConfig.yOrigin = parseFloat(config.yOrigin) || 0;
        parsedConfig.scale = parseFloat(config.scale);
        parsedConfig.xyRatio = parseFloat(config.xyRatio);
        parsedConfig.timeOffset = parseFloat(config.timeOffset);
        parsedConfig.translateXSpeed = parsedConfig.pageSpeed * parseFloat(config.translateXSpeed);
        parsedConfig.translateYSpeed = parsedConfig.pageSpeed * parseFloat(config.translateYSpeed);
        parsedConfig.translateX = parseFloat(config.translateX);
        parsedConfig.translateY = parseFloat(config.translateY);
        parsedConfig.rotateSpeed = parsedConfig.pageSpeed * parseFloat(config.rotateSpeed);
        parsedConfig.rotateAngle = parseFloat(config.rotateAngle);
        parsedConfig.skewSpeedX = parsedConfig.pageSpeed * parseFloat(config.skewSpeedX);
        parsedConfig.skewAmountX = parseFloat(config.skewAmountX);
        parsedConfig.skewSpeedY = parsedConfig.pageSpeed * parseFloat(config.skewSpeedY);
        parsedConfig.skewAmountY = parseFloat(config.skewAmountY);
        parsedConfig.zoomSpeed = parsedConfig.pageSpeed * parseFloat(config.zoomSpeed);
        parsedConfig.zoomAmount = parseFloat(config.zoomAmount);
        parsedConfig.zoomCutStart = parseFloat(config.zoomCutStart);
        parsedConfig.zoomCutEnd = parseFloat(config.zoomCutEnd);
        parsedConfig.translateCutStart = parseFloat(config.translateCutStart);
        parsedConfig.translateCutEnd = parseFloat(config.translateCutEnd);
        parsedConfig.height = parseFloat(config.height);
        parsedConfig.cameraBoundOffset = parseFloat(config.cameraBoundOffset);
        parsedConfig.zoomRelativeMultiplier = parseFloat(config.zoomRelativeMultiplier);
        parsedConfig.animationSpeed = parsedConfig.pageSpeed * parseFloat(config.animationSpeed) || 100;
        parsedConfig.numFrames = parseFloat(config.numFrames);
        parsedConfig.motionType = config.motionType;
        parsedConfig.zoomType = config.zoomType;
        parsedConfig.rotateType = config.rotateType;
        parsedConfig.zoomTypeCut = config.zoomTypeCut;
        parsedConfig.translateTypeCut = config.translateTypeCut;
        parsedConfig.translateFunction = undefined;
        parsedConfig.zoomFunction = undefined;
        parsedConfig.rotateFunction = undefined;
        parsedConfig.skewFunction = undefined;
        parsedConfig.animationFunction = function() {
            return Math.floor(MathFunctions.prototype.sawToothFunction.apply(this, arguments));
        };
        parsedConfig.translate = config.translate;
        parsedConfig.accel = config.accel;
        parsedConfig.accelAmount = parseFloat(config.accelAmount) || 1;
        parsedConfig.accelRotate = config.accelRotate;
        parsedConfig.accelRotateAmount = parseFloat(config.accelRotateAmount) || 1;
        parsedConfig.rotate = config.rotate;
        parsedConfig.skew = config.skew;
        parsedConfig.zoom = config.zoom;
        parsedConfig.zoomRelativeTranslate = config.zoomRelativeTranslate;
        parsedConfig.animation = config.animation;
        parsedConfig.cameraBound = config.cameraBound;

        if (parsedConfig.motionType === 'triangle'){
            parsedConfig.translateFunction = MathFunctions.prototype.triangleFunction;
        }
        else if (parsedConfig.motionType === 'sawtooth'){
            parsedConfig.translateFunction = MathFunctions.prototype.sawToothFunction;
        }
        else if (parsedConfig.motionType === 'cos'){
            parsedConfig.translateFunction = MathFunctions.prototype.cosFunction;
        }
        else {
            parsedConfig.translateFunction = MathFunctions.prototype.sinFunction;
        }

        if (parsedConfig.zoomType === 'triangle'){
            parsedConfig.zoomFunction = MathFunctions.prototype.triangleFunction;
        }
        else if (parsedConfig.zoomType === 'sin'){
            parsedConfig.zoomFunction = MathFunctions.prototype.sinFunction;
        }
        else if (parsedConfig.zoomType === 'cos'){
            parsedConfig.zoomFunction = MathFunctions.prototype.cosFunction;
        }
        else {
            parsedConfig.zoomFunction = MathFunctions.prototype.sawToothFunction;
        }

        if (parsedConfig.rotateType === 'triangle'){
            parsedConfig.rotateFunction = MathFunctions.prototype.triangleFunction;
        }
        else if (parsedConfig.rotateType === 'sawToothFunction'){
            parsedConfig.rotateFunction = MathFunctions.prototype.sawToothFunction;
        }
        else if (parsedConfig.rotateType === 'cos'){
            parsedConfig.rotateFunction = MathFunctions.prototype.cosFunction;
        }
        else {
            parsedConfig.rotateFunction = MathFunctions.prototype.sinFunction;
        }

        parsedConfig.skewFunction = MathFunctions.prototype.cosFunction;
        if (parsedConfig.zoomTypeCut){
            parsedConfig.zoomFunction = MathFunctions.prototype.cutFunction(parsedConfig.zoomFunction,
                parsedConfig.zoomCutStart, parsedConfig.zoomCutEnd, parsedConfig.zoomFunction.period);
        }
        if (parsedConfig.translateTypeCut){
            parsedConfig.translateFunction = MathFunctions.prototype.cutFunction(parsedConfig.translateFunction,
                parsedConfig.translateCutStart, parsedConfig.translateCutEnd, parsedConfig.translateFunction.period);
        }

        parsedConfig.functionsConfigs = [];

        if (parsedConfig.translate){
            parsedConfig.functionsConfigs.push({
                characteristic:'changeX',
                timeOffset: parsedConfig.timeOffset,
                speed: parsedConfig.translateXSpeed,
                multiplier: parsedConfig.translateX,
                functionType: parsedConfig.translateFunction
            });
            parsedConfig.functionsConfigs.push({
                characteristic:'changeY',
                timeOffset: parsedConfig.timeOffset,
                speed: parsedConfig.translateYSpeed,
                multiplier: parsedConfig.translateY,
                functionType: parsedConfig.translateFunction
            });
        }
        if (parsedConfig.rotate){
            parsedConfig.functionsConfigs.push({
                characteristic:'changeRotateZ',
                timeOffset: parsedConfig.timeOffset,
                speed: parsedConfig.rotateSpeed,
                multiplier: 1/parsedConfig.rotateAngle,
                functionType: parsedConfig.rotateFunction
            });
        }
        if (parsedConfig.skew){
            parsedConfig.functionsConfigs.push({
                characteristic:'changeSkewX',
                timeOffset: parsedConfig.timeOffset,
                speed: parsedConfig.skewSpeedX,
                multiplier: parsedConfig.skewAmountX,
                functionType: parsedConfig.skewFunction
            });
            parsedConfig.functionsConfigs.push({
                characteristic:'changeSkewY',
                timeOffset: parsedConfig.timeOffset,
                speed: parsedConfig.skewSpeedY,
                multiplier: parsedConfig.skewAmountY,
                functionType: parsedConfig.skewFunction
            });
        }
        if (parsedConfig.zoom){
            if (parsedConfig.zoomRelativeTranslate){
                parsedConfig.functionsConfigs.push({
                    characteristic:'changeZoom',
                    timeOffset: parsedConfig.timeOffset,
                    speed: parsedConfig.zoomSpeed,
                    multiplier: parsedConfig.zoomRelativeMultiplier/parsedConfig.translateY,
                    functionType: parsedConfig.zoomFunction
                });
            }
            else {
                parsedConfig.functionsConfigs.push({
                    characteristic:'changeZoom',
                    timeOffset: parsedConfig.timeOffset,
                    speed: parsedConfig.zoomSpeed,
                    multiplier: parsedConfig.zoomAmount,
                    functionType: parsedConfig.zoomFunction
                });
            }
        }

        parsedConfig.changingFunctions = parsedConfig.functionsConfigs.map(function(functionConfig) {
            return {
                characteristic: functionConfig.characteristic,
                fn: MathFunctions.prototype.timeFunction(functionConfig.timeOffset,
                               functionConfig.speed, functionConfig.multiplier, functionConfig.functionType)
            };
        });

        if (parsedConfig.animation){
            var frameNumberFunction = MathFunctions.prototype.timeFunction(parsedConfig.timeOffset, parsedConfig.animationSpeed,
                       parsedConfig.numFrames, parsedConfig.animationFunction);
            var animationChangeYFunction = function(timePassed) {
                return -frameNumberFunction(timePassed) * model.page.y * parsedConfig.scale;
            };
            parsedConfig.changingFunctions.push({
                characteristic: 'changeY',
                fn: animationChangeYFunction
            });
        }
        var orientationFunction = function(timePassed) {
            return window.orientationController.orientationDifferenceAt(timePassed);
        };
        if (parsedConfig.accel){
            var orientationChangeXFunction = function(timePassed) {
                return orientationFunction(timePassed)[1] * parsedConfig.accelAmount;
            };
            var orientationChangeYFunction = function(timePassed) {
                return orientationFunction(timePassed)[0] * parsedConfig.accelAmount;
            };
            parsedConfig.changingFunctions.push({
                characteristic: 'changeX',
                fn: orientationChangeXFunction
            });
            parsedConfig.changingFunctions.push({
                characteristic: 'changeY',
                fn: orientationChangeYFunction
            });
        }
        if (parsedConfig.accelRotate){
            var orientationChangeRotateXFunction = function(timePassed) {
                return orientationFunction(timePassed)[0] * parsedConfig.accelRotateAmount;
            };
            var orientationChangeRotateYFunction = function(timePassed) {
                return orientationFunction(timePassed)[1] * parsedConfig.accelRotateAmount;
            };
            parsedConfig.changingFunctions.push({
                characteristic: 'changeRotateX',
                fn: orientationChangeRotateXFunction
            });
            parsedConfig.changingFunctions.push({
                characteristic: 'changeRotateY',
                fn: orientationChangeRotateYFunction
            });
        }

        return parsedConfig;
    };

    module.exports = ConfigParser;
});
