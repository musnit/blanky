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
      this.recentReadings = [{
          orientationDifference: this.orientationDifference,
          timeStamp: Date.now()
      }];
      this.orientationDifferenceAt = function(time){
        return this.recentReadings[this.recentReadings.length-1].orientationDifference;
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
    OrientationController.prototype.makeOrientationFunction = function(readings) {
        var self = this;
        var reading1 = readings[readings.length-2];
        var reading2 = readings[readings.length-1];
        var functions = [undefined,undefined,undefined];
        functions = functions.map(function(value, index){
            var x0 = reading1.timeStamp;
            var y0 = reading1.orientationDifference[index];
            var x1 = reading2.timeStamp;
            var y1 = reading2.orientationDifference[index];
            var fx = self.interpolate(x0, y0, x1, y1);
            return fx;
        });
        window.watchh = functions;
        var orientationDifferenceAt = function(time){
            if((time - reading2.timeStamp) >= 50){
                return reading2.orientationDifference;
            }
            else{
                return [functions[0](time), functions[1](time), functions[2](time)];
            }
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
        orientation[1] = orientation[1];
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
                timeStamp: eventData.timeStamp
              };
              self.recentReadings.push(reading);
              if (self.recentReadings.length >= 5){
                self.recentReadings.shift();
              }
              self.orientationDifferenceAt = self.makeOrientationFunction(self.recentReadings);
          });
      }
    };
    module.exports = OrientationController;
});
