define(function(require, exports, module) {
  var Famous = require('famous');

  var StatsTimer = require('helpers/StatsTimer');
  var OrientationController = require('helpers/OrientationController');
  var SoundController = require('helpers/SoundController');
  var Timer = Famous.Clock;
  var FamousEngine = Famous.core.FamousEngine;
  var AppNode = require('nodes/AppNode');

  function BlankyApp(isApp) {
    this.isApp = isApp;
    FamousEngine.init();

    window.initialPageId = 'FL2phpD5tr';
    window.blanky = this;

    var mainScene = FamousEngine.createScene('#device-screen');
    var topScene = FamousEngine.createScene('#top-screen');
    window.appNode = new AppNode(mainScene, topScene);

    window.orientationController = new OrientationController();
    window.orientationController.startListening();

    this.soundController = new SoundController(isApp);
  }

  BlankyApp.prototype.clearPage = function() {
      window.appNode.clearPage();
      this.soundController.clearSounds();
    };

  BlankyApp.prototype.loadPage = function(pageID) {
      var pageModel = window.pagesModel.pages.filter(function(page) {
          return page.objectId === pageID;
      })[0];
      window.pageModel = pageModel;
      window.appNode.createAndShowPage(pageModel);
      this.soundController.createSounds(window.pageModel.sounds);
  };

  module.exports = BlankyApp;

});
