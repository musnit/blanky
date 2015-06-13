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
    };

    ParameterTransformer.prototype.setInitialValues = function() {
        this.initialPosition = [this.parsedConfig.x,this.parsedConfig.y,this.parsedConfig.height];
        this.initialOrigin = [this.parsedConfig.xOrigin,this.parsedConfig.yOrigin, 0];
        this.initialScale = [this.parsedConfig.scale*this.parsedConfig.xyRatio,
                 this.parsedConfig.scale, 1];
        this.initialSize = [this.parsedConfig.sizeX, this.parsedConfig.sizeY];
        this.initialRotate = [this.parsedConfig.xRotate, this.parsedConfig.yRotate, this.parsedConfig.zRotate];
        this.initialOpacity = this.parsedConfig.opacity;
    };

    ParameterTransformer.prototype.calculateTransform = function() {
        var timePassed = this.timeKeeper.timePassed;
        var characteristics = {
            changeX: 0,
            changeY: 0,
            changeZ: 0,
            changeRotateX: 0,
            changeRotateY: 0,
            changeRotateZ: 0,
            changeSkewX: 1,
            changeSkewY: 1,
            changeZoom: 1,
            changeHeight: 0
        };
        this.parsedConfig.changingFunctions.forEach(function(changingFunction) {
            characteristics[changingFunction.characteristic] += changingFunction.fn(timePassed);
        });
        var newTransformations = {
            rotate: [this.initialRotate[0] + characteristics.changeRotateX, this.initialRotate[1] + characteristics.changeRotateY, this.initialRotate[2] + characteristics.changeRotateZ],
            scale: [this.initialScale[0]*characteristics.changeZoom*characteristics.changeSkewX, this.initialScale[1]*characteristics.changeZoom*characteristics.changeSkewY, this.initialScale[2]],
            position: [this.initialPosition[0] + characteristics.changeX, this.initialPosition[1] + characteristics.changeY, this.initialPosition[2] + characteristics.changeHeight]
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
