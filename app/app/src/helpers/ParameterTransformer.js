define(function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var ConfigParser = require('helpers/ConfigParser');

    function PerfParameterTransformer(config, model) {
        this.model = model;
        this.parsedConfig = ConfigParser.prototype.parseConfig(config, model);
    }

    PerfParameterTransformer.prototype.constructor = PerfParameterTransformer;
    PerfParameterTransformer.prototype.resetCurrentTransform = function() {
        var currentTransform = {};
        currentTransform.rotate = 0;
        currentTransform.zoom = 1;
        currentTransform.skewX = 1;
        currentTransform.skewY = 1;
        currentTransform.x = this.parsedConfig.x;
        currentTransform.y = this.parsedConfig.y;
        currentTransform.height = this.parsedConfig.height;
        currentTransform.timePassed = parseFloat(Date.now());
        return currentTransform;
    };

    PerfParameterTransformer.prototype.calculateTransform = function() {
        var currentTransform = this.resetCurrentTransform();

        if (this.parsedConfig.translate){
            currentTransform.x += this.parsedConfig.translateFunction(
                (currentTransform.timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.translateXSpeed,
                this.parsedConfig.translateX
            );
            currentTransform.y += this.parsedConfig.translateFunction(
                (currentTransform.timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.translateYSpeed,
                this.parsedConfig.translateY
            );
        }
        if (this.parsedConfig.accel){
            currentTransform.x += window.orientationDifference[1] * this.parsedConfig.accelAmount;
            currentTransform.y += window.orientationDifference[0] * this.parsedConfig.accelAmount;
        }
        if (this.parsedConfig.rotate){
            currentTransform.rotate = this.parsedConfig.rotateFunction(
                (currentTransform.timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.rotateSpeed,
                1/this.parsedConfig.rotateAngle
            );
        }
        if (this.parsedConfig.skew){
            currentTransform.skewX = 1 + this.parsedConfig.skewFunction(
                (currentTransform.timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.skewSpeedX,
                this.parsedConfig.skewAmountX
            );
            currentTransform.skewY = 1 + this.parsedConfig.skewFunction(
                (currentTransform.timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.skewSpeedY,
                this.parsedConfig.skewAmountY
            );
        }
        if (this.parsedConfig.zoom){
            if (this.parsedConfig.zoomRelativeTranslate){
                currentTransform.zoom = 1 + this.parsedConfig.zoomFunction(
                    (currentTransform.timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.zoomSpeed,
                    this.parsedConfig.zoomRelativeMultiplier/this.parsedConfig.translateY
                );
            }
            else {
                currentTransform.zoom = 1 + this.parsedConfig.zoomFunction(
                    (currentTransform.timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.zoomSpeed,
                    this.parsedConfig.zoomAmount
                );
            }
        }
        if (this.parsedConfig.animation){
            var frameNumber = Math.floor(this.parsedConfig.animationFunction(
                    (currentTransform.timePassed+this.parsedConfig.timeOffset)/this.parsedConfig.animationSpeed,
                    this.parsedConfig.numFrames
            ));
            currentTransform.y -= frameNumber * this.model.page.y * this.parsedConfig.scale * currentTransform.zoom;
        }
        if (this.parsedConfig.cameraBound){
            currentTransform.height = window.mainContext.getPerspective() + this.parsedConfig.cameraBoundOffset;
        }
        var finalTransform = Transform.thenMove(
            Transform.thenScale(
                Transform.rotate(0,0,currentTransform.rotate),
                [this.parsedConfig.scale*this.parsedConfig.xyRatio*currentTransform.zoom*currentTransform.skewX,
                 this.parsedConfig.scale*currentTransform.zoom*currentTransform.skewY, 1])
            ,[currentTransform.x,currentTransform.y,currentTransform.height]
        );
        return finalTransform;
    };

    module.exports = PerfParameterTransformer;
});
