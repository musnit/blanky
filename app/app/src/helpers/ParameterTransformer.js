define(function(require, exports, module) {

    function ParameterTransformer(parsedConfig, model, timeKeeper) {
        this.model = model;
        this.timeKeeper = timeKeeper;
        this.setParsedConfig(parsedConfig);
    }

    ParameterTransformer.prototype.constructor = ParameterTransformer;

    ParameterTransformer.prototype.setParsedConfig = function(parsedConfig) {
        this.parsedConfig = parsedConfig;
        this.setInitialValues();
    }

    ParameterTransformer.prototype.setInitialValues = function() {
        this.initialPosition = [this.parsedConfig.x,this.parsedConfig.y,this.parsedConfig.height];
        this.initialOrigin = [this.parsedConfig.xOrigin,this.parsedConfig.yOrigin, 0];
        this.initialScale = [this.parsedConfig.scale*this.parsedConfig.xyRatio,
                 this.parsedConfig.scale, 1];
        this.initialSize = [this.parsedConfig.sizeX, this.parsedConfig.sizeY];
        this.initialRotate = [this.parsedConfig.xRotate, this.parsedConfig.yRotate, this.parsedConfig.zRotate];
        this.initialOpacity = this.parsedConfig.opacity;
    }

    ParameterTransformer.prototype.calculateTransform = function() {
        var orientation;
        var timePassed = this.timeKeeper.timePassed;
        var changeX = 0, changeY = 0, changeZ = 0, changeRotateX = 0, changeRotateY = 0, changeRotateZ = 0,
         changeSkewX = 1, changeSkewY = 1, changeZoom = 1, changeHeight = 0;

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
            orientation = window.orientationController.orientationDifferenceAt(timePassed);
            changeX += orientation[1] * this.parsedConfig.accelAmount;
            changeY += orientation[0] * this.parsedConfig.accelAmount;
        }
        if (this.parsedConfig.accelRotate){
            orientation = window.orientationController.orientationDifferenceAt(timePassed);
            changeRotateX += orientation[0] * this.parsedConfig.accelRotateAmount;
            changeRotateY += orientation[1] * this.parsedConfig.accelRotateAmount;
        }
        if (this.parsedConfig.rotate){
            changeRotateZ = this.parsedConfig.rotateFunction(
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
        var newTransformations = {
            rotate: [this.initialRotate[0] + changeRotateX, this.initialRotate[1] + changeRotateY, this.initialRotate[2] + changeRotateZ],
            scale: [this.initialScale[0]*changeZoom*changeSkewX, this.initialScale[1]*changeZoom*changeSkewY, this.initialScale[2]],
            position: [this.initialPosition[0] + changeX, this.initialPosition[1] + changeY, this.initialPosition[2] + changeHeight]
        };
        return newTransformations;
    };
    ParameterTransformer.prototype.createComponent = function(node) {
        this.node = node;
        var self = this;
        var component = {
            onUpdate: function(time) {
                var updatedTransform = self.calculateTransform();
                node.setRotation(updatedTransform.rotate[0], updatedTransform.rotate[1], updatedTransform.rotate[2]);
                node.setScale(updatedTransform.scale[0], updatedTransform.scale[1], updatedTransform.scale[2]);
                node.setPosition(updatedTransform.position[0], updatedTransform.position[1], updatedTransform.position[2]);
                node.requestUpdate(this.id);
            }
        };
        var id = node.addComponent(component);
        component.id = id;
        return id;
    };

    module.exports = ParameterTransformer;
});
