define(function(require, exports, module) {
    var MathFunctions = require('helpers/MathFunctions');

    function ConfigParser() {
    }

    ConfigParser.prototype.constructor = ConfigParser;
    ConfigParser.prototype.parseConfig = function(config, model) {
        var parsedConfig = {};
        var rotate, rotateFunction, zoom, zoomFunction, skewX, skewY;
        parsedConfig.pageSpeed = parseFloat(model.page.speed) || 1;
        parsedConfig.x = parseFloat(config.initialX);
        parsedConfig.y = parseFloat(config.initialY);
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
        parsedConfig.animationFunction = MathFunctions.prototype.sawToothFunction;
        parsedConfig.translate = config.translate;
        parsedConfig.accel = config.accel;
        parsedConfig.rotate = config.rotate;
        parsedConfig.skew = config.skew;
        parsedConfig.zoom = config.zoom;
        parsedConfig.zoomRelativeTranslate = config.zoomRelativeTranslate;
        parsedConfig.animation = config.animation;
        parsedConfig.cameraBound = config.cameraBound;
        parsedConfig.accelAmount = parseFloat(config.accelAmount);

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

        return parsedConfig;
    }

    module.exports = ConfigParser;
});
