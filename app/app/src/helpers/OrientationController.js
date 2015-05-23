// jscs:disable
define(function(require, exports, module) {

    function OrientationController() {
      this.started = false;
      this.baseOrientation = undefined;
      this.orientationDifference = [0,0,0];
    }
    OrientationController.prototype.constructor = OrientationController;

    OrientationController.prototype.interpolateOrientation = function() {
        var orientation = [undefined, undefined, undefined];
        orientation.forEach(function(value, index) {
            var yValue = function(xValue) {
                var x0 = window.prevOrientationDifferenceTime;
                var y0 = window.prevOrientationDifference[index];
                var x1 = window.orientationDifferenceTime;
                var y1 = window.orientationDifference[index];
            console.log(y0 +' + (' + y1 + ' - ' + y0 + ')*((' + xValue + ' - ' + x0+')/(' + x1 + ' - ' + x0+'))');
               return y0 + (y1 - y0)*((xValue - x0)/(x1-x0));
            };
            orientation[index] = yValue(Date.now());
        });
        return orientation;
    };

    OrientationController.prototype.normalize = function(orientation){
        orientation[0] = -orientation[0];
        return orientation;
    };

    OrientationController.prototype.orientationDifferenceNow = function(){
        return this.orientationDifference;
    };

    OrientationController.prototype.startListening = function() {
      var self = this;
      if (window.DeviceOrientationEvent) {
        self.started = true;
          window.addEventListener('deviceorientation', function(eventData) {
              var orientation = [eventData.gamma, eventData.beta, eventData.alpha];
              var currentOrientation = self.normalize(orientation);

              if (!self.baseOrientation){
                  self.baseOrientation = currentOrientation;
              }

              self.orientationDifference = currentOrientation.map(function(value, index){
                var difference = currentOrientation[index] - self.baseOrientation[index];
                var magnitute = Math.abs(difference);
                var sign = difference/magnitute;
                return sign * Math.min(difference, 30);
              });
          });
      }
    };
    module.exports = OrientationController;
});
