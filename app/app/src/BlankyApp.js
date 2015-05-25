define(function(require, exports, module) {
  var StatsTimer = require('helpers/StatsTimer');
  var OrientationController = require('helpers/OrientationController');
  var Timer = require('famous/utilities/Timer');

  function BlankyApp() {
    window.blanky = this;
    this.Engine = require('famous/core/Engine');
    this.AppView = require('views/AppView');
    this.Sound = require('soundjs');
    this.Engine.setOptions({appMode: false});

    this.initialPageId = 'UHGPYzstxO';
    window.initialPageId = this.initialPageId;

    // create the main context
    this.mainContext = this.Engine.createContext(document.getElementById('device-screen'));
    this.mainContext.setPerspective(100);
    window.mainContext = this.mainContext;
    window.Engine = this.Engine;
    this.appView = new this.AppView();
    this.mainContext.add(this.appView);
    window.appView = this.appView;
    window.orientationController = new OrientationController();
    window.orientationController.startListening();
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

  module.exports = BlankyApp;

});
