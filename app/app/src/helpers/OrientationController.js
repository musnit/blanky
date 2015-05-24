// jscs:disable
define(function(require, exports, module) {

    function OrientationController() {
        this.reset();
    }
    OrientationController.prototype.constructor = OrientationController;

    OrientationController.prototype.reset = function() {
      this.started = false;
      this.baseOrientation = undefined;
      this.orientationDifference = [0,0,0];
      this.lastValue = {
          orientationDifference: this.orientationDifference,
          timeStamp: Date.now()
      };
      this.orientationDifferenceAt = function(time){
        return this.lastValue.orientationDifference;
      };
    };
    OrientationController.prototype.interpolate = function(x0, y0, x1, y1) {
        var result = function(x) {
           return y0 + (y1 - y0)*((x - x0)/(x1-x0));
        };
        result.m = (y1 - y0)/(x1 - x0);
        result.text = 'y = ' + result.m + 'x';
        return result;
    };
    OrientationController.prototype.makeOrientationFunction = function(reading) {
        var self = this;
        var point1 = this.lastValue;
        var point2 = reading;
        var functions = [undefined,undefined,undefined];
        functions = functions.map(function(value, index){
            var x0 = point1.timeStamp;
            var y0 = point1.orientationDifference[index];
            var x1 = point2.timeStamp;
            var y1 = point2.orientationDifference[index];
            var fx = self.interpolate(x0, y0, x1, y1);
            return fx;
        });
        window.watchh = functions;
        var orientationDifferenceAt = function(time){
            var orientation;
            if(time >= point2.timeStamp){
                orientation = point2.orientationDifference;
            }
            else{
                orientation = [functions[0](time), functions[1](time), functions[2](time)];
            }
            this.lastValue = {
                orientationDifference: orientation,
                timeStamp: time
            };
            return orientation;
        };
        return orientationDifferenceAt;
    };


    OrientationController.prototype.reInterpolate = function(x0, y0, x1, y1) {
        var result = function(x) {
           return y0 + (y1 - y0)*((x - x0)/(x1-x0));
        };
        return result;
    };

    OrientationController.prototype.normalize = function(orientation){
        orientation[0] = -orientation[0];
        return orientation;
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

              var orientationDifference = currentOrientation.map(function(value, index){
                if (value > 30){
                    return 30;
                }
                else if (value < -30){
                    return -30;
                }
                else{
                    return value;
                }
              });
              var reading = {
                orientationDifference: orientationDifference,
                timeStamp: eventData.timeStamp + 50
              };
              self.orientationDifferenceAt = self.makeOrientationFunction(reading);
          });
      }
    };
    module.exports = OrientationController;
});
