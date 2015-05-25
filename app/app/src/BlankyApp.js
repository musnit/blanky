define(function(require, exports, module) {
  var StatsTimer = require('helpers/StatsTimer');
  var OrientationController = require('helpers/OrientationController');
  var SoundController = require('helpers/SoundController');
  var Timer = require('famous/utilities/Timer');

  function BlankyApp(isApp) {
    window.blanky = this;
    this.isApp = isApp;
    this.Engine = require('famous/core/Engine');
    this.AppView = require('views/AppView');
    this.Engine.setOptions({appMode: false});
    this.soundController = new SoundController(isApp);
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
