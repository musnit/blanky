define(function(require, exports, module) {

    function ActionFunctions() {
    }

    ActionFunctions.prototype.constructor = ActionFunctions;
    ActionFunctions.prototype.translateCharacteristic = function(dimension) {
        if (dimension === 'x') {
            return 'changeX';
        }
        else {
            return 'changeY';
        }
    };
    ActionFunctions.prototype.rotateCharacteristic = function() {
        return 'changeRotateZ';
    };
    ActionFunctions.prototype.skewCharacteristic = function(dimension) {
        if (dimension === 'x') {
            return 'changeSkewX';
        }
        else {
            return 'changeSkewY';
        }
    };
    ActionFunctions.prototype.zoomCharacteristic = function() {
        return 'changeZoom';
    };
    ActionFunctions.prototype.frameAnimationCharacteristic = function() {
        return 'changeY';
    };

    ActionFunctions.prototype.timeFunction = function(timeOffset, speed, multiplier, functionType) {
        var newFunction = function(time) {
            var timeInput = time+timeOffset;
            var x = timeInput/speed;
            var y = functionType(x, multiplier);
            return y;
        };
        return newFunction;
    };

    ActionFunctions.prototype.accelerometerFunction = function(dimension, multiplier) {
        var newFunction = function(timePassed) {
            return window.orientationController.orientationDifferenceAt(timePassed)[dimension] * multiplier;
        };
        return newFunction;
    };

    module.exports = ActionFunctions;
});
