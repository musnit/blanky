define(function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var ConfigParser = require('helpers/ConfigParser');

    function ParameterTransformer(config, model) {
        this.model = model;
        this.parsedConfig = ConfigParser.prototype.parseConfig(config, model);
        this.initialTransform = Transform.thenMove(
            Transform.thenScale(
                Transform.identity,
                [this.parsedConfig.scale*this.parsedConfig.xyRatio,
                 this.parsedConfig.scale, 1])
            ,[this.parsedConfig.x,this.parsedConfig.y,this.parsedConfig.height]
        );
    }

    ParameterTransformer.prototype.constructor = ParameterTransformer;

    ParameterTransformer.prototype.calculateTransform = function() {
        var timePassed = parseFloat(Date.now());
        var changeX = 0, changeY = 0, changeRotate = 0, changeSkewX = 1, changeSkewY = 1,
            changeZoom = 1, changeHeight = 0;

        if (this.parsedConfig.translate){
            changeX += this.parsedConfig.translateFunction(
                (timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.translateXSpeed,
                this.parsedConfig.translateX
            );
            changeY += this.parsedConfig.translateFunction(
                (timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.translateYSpeed,
                this.parsedConfig.translateY
            );
        }
        if (this.parsedConfig.accel){
            changeX += window.orientationDifference[1] * this.parsedConfig.accelAmount;
            changeY += window.orientationDifference[0] * this.parsedConfig.accelAmount;
        }
        if (this.parsedConfig.rotate){
            changeRotate = this.parsedConfig.rotateFunction(
                (timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.rotateSpeed,
                1/this.parsedConfig.rotateAngle
            );
        }
        if (this.parsedConfig.skew){
            changeSkewX = 1 + this.parsedConfig.skewFunction(
                (timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.skewSpeedX,
                this.parsedConfig.skewAmountX
            );
            changeSkewY = 1 + this.parsedConfig.skewFunction(
                (timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.skewSpeedY,
                this.parsedConfig.skewAmountY
            );
        }
        if (this.parsedConfig.zoom){
            if (this.parsedConfig.zoomRelativeTranslate){
                changeZoom = 1 + this.parsedConfig.zoomFunction(
                    (timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.zoomSpeed,
                    this.parsedConfig.zoomRelativeMultiplier/this.parsedConfig.translateY
                );
            }
            else {
                changeZoom = 1 + this.parsedConfig.zoomFunction(
                    (timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.zoomSpeed,
                    this.parsedConfig.zoomAmount
                );
            }
        }
        if (this.parsedConfig.animation){
            var frameNumber = Math.floor(this.parsedConfig.animationFunction(
                    (timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.animationSpeed,
                    this.parsedConfig.numFrames
            ));
            changeY -= frameNumber * this.model.page.y * this.parsedConfig.scale;
        }
        if (this.parsedConfig.cameraBound){
            changeHeight = window.mainContext.getPerspective() + this.parsedConfig.cameraBoundOffset;
        }
        var finalTransform = Transform.thenMove(
            Transform.thenScale(
                Transform.multiply(Transform.rotate(0, 0, changeRotate), this.initialTransform),
                [changeZoom*changeSkewX,
                 changeZoom*changeSkewY, 1])
            ,[changeX,changeY,changeHeight]
        );
        return finalTransform;
    };

    module.exports = ParameterTransformer;
});
