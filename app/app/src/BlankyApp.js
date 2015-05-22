define(function(require, exports, module) {

  function BlankyApp() {
    window.blanky = this;
    this.Engine = require('famous/core/Engine');
    this.AppView = require('views/AppView');
    this.Sound = require('soundjs');
    this.Engine.setOptions({appMode: false});

    this.initialPageId = 'gBqF9PtfBm';
    window.initialPageId = this.initialPageId;

    // create the main context
    this.mainContext = this.Engine.createContext(document.getElementById('device-screen'));
    this.mainContext.setPerspective(100);
    window.mainContext = this.mainContext;
    window.Engine = this.Engine;
    this.appView = new this.AppView();
    this.mainContext.add(this.appView);
    window.appView = this.appView;
    this.createMotionBindings();
  }

  BlankyApp.prototype.clearPage = function() {
      window.appView.lightbox.hide();
      this.Sound.removeAllSounds();
  };

  BlankyApp.prototype.loadPage = function(pageID) {
      var pageModel = window.pagesModel.pages.filter(function(page) {
          return page.objectId === pageID;
      })[0];
      window.pageModel = pageModel;
      window.appView.createAndShowPage(pageModel);

      var audioPath = 'content/sounds/';
      var manifest = window.pageModel.sounds;
      if (manifest){
        this.Sound.alternateExtensions = ['mp3'];
        var handleLoad = function(event) {
            var soundObject = window.pageModel.sounds.filter(function(sound) {
                return (event.src === (audioPath + sound.src));
            })[0];
            window.blanky.Sound.play(audioPath + soundObject.src, {
                loop: soundObject.loop,
                volume: soundObject.volume
            });
        };
        this.Sound.addEventListener('fileload', handleLoad);
        this.Sound.registerSounds(manifest, audioPath);
      }
  };

  BlankyApp.prototype.createMotionBindings = function() {

      if (window.DeviceOrientationEvent) {
          window.originalOrientation = false;
          window.orientationDifference = [0,0,0];
          window.addEventListener('deviceorientation', function(eventData) {
              // gamma is the left-to-right tilt in degrees, where right is positive
              var rotateX = eventData.gamma;

              // beta is the front-to-back tilt in degrees, where front is positive
              var rotateY = eventData.beta;

              // alpha is the compass direction the device is facing in degrees
              var rotateZ = eventData.alpha;

              // call our orientation event handler
              if (!window.originalOrientation){
                  window.originalOrientation = [rotateX, rotateY, rotateZ];
              }

              var changeInX = rotateX-window.originalOrientation[0];
              var changeInY = rotateY-window.originalOrientation[1];
              var changeInZ = rotateZ-window.originalOrientation[2];
              if (changeInX >30) {
                  changeInX = 30;
              }
              if (changeInY >30) {
                  changeInY = 30;
              }
              if (changeInX <-30) {
                  changeInX = -30;
              }
              if (changeInY <-30) {
                  changeInY = -30;
              }
              if (changeInZ <-30) {
                  changeInY = -30;
              }

              if (changeInZ <-30) {
                  changeInY = -30;
              }

              window.orientationDifference = [changeInX, changeInY, changeInZ];
          }, false);
      }
  };

  module.exports = BlankyApp;

});
