define(function(require, exports, module) {
  var StatsTimer = require('helpers/StatsTimer');
  var OrientationController = require('helpers/OrientationController');
  var SoundController = require('helpers/SoundController');
  var Timer = require('famous/utilities/Timer');
  var Engine = require('famous/core/Engine');
  var AppView = require('views/AppView');

  function BlankyApp(isApp) {
    this.isApp = isApp;

    window.Engine = Engine;
    Engine.setOptions({appMode: false});

    window.initialPageId = 'UHGPYzstxO';
    window.blanky = this;

    window.appView = new AppView();

    window.mainContext = Engine.createContext(document.getElementById('device-screen'));
    window.mainContext.setPerspective(100);
    window.mainContext.add(window.appView);

    window.orientationController = new OrientationController();
    window.orientationController.startListening();

    this.soundController = new SoundController(isApp);
  }

  BlankyApp.prototype.clearPage = function() {
      window.appView.lightbox.hide();
      this.soundController.clearSounds();
    };

  BlankyApp.prototype.loadPage = function(pageID) {
      var pageModel = window.pagesModel.pages.filter(function(page) {
          return page.objectId === pageID;
      })[0];
      window.pageModel = pageModel;
      window.appView.createAndShowPage(pageModel);
      this.soundController.createSounds(window.pageModel.sounds);
  };

  module.exports = BlankyApp;

});
