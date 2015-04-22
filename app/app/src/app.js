/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var AppView = require('views/AppView');
    var Sound = require('soundjs');

    this.initialTime = Date.now();
    Engine.setOptions({appMode: false});

    var Fixtures = require('Fixtures');
    window.Fixtures = Fixtures;
    var initialPageId = 'Du6zsqF3x0';
    this.loopingIDs = ['Du6zsqF3x0','FnTu1Egg5v','w9zCNnEbfC'];
    this.loopNum = 1;
    window.initialPageId = initialPageId;

    // create the main context
    var mainContext = Engine.createContext(document.getElementById('device-screen'));
    mainContext.setPerspective(100);
    window.mainContext = mainContext;
    window.Engine = Engine;
    var appView = new AppView();
    mainContext.add(appView);
    window.appView = appView;

    var pagesModel = {};
    pagesModel.pages = Fixtures.results;
    window.pagesModel = pagesModel;

    this.clearPage = function() {
        window.appView.lightbox.hide();
        Sound.removeAllSounds();
    };

    this.loadPage = function(pageID) {
        var pageModel = pagesModel.pages.filter(function(page){
            return page.objectId === pageID
        })[0];
        window.pageModel = pageModel;
        window.appView.createAndShowPage(pageModel);

        var audioPath = 'content/sounds/';
        var manifest = window.pageModel.sounds;
        Sound.alternateExtensions = ['mp3'];
        var handleLoad = function(event) {
            var soundObject = window.pageModel.sounds.filter(function(sound) {
                return (event.src === (audioPath + sound.src));
            })[0];
            Sound.play(audioPath + soundObject.src, {
                loop: soundObject.loop,
                volume: soundObject.volume
            });
        };
        Sound.addEventListener('fileload', handleLoad);
        Sound.registerSounds(manifest, audioPath);
    };

    this.createMotionBindings = function() {

        if (window.DeviceOrientationEvent) {
            window.originalOrientation = false;
            window.orientationDifference = [0,0,0];
            window.addEventListener('deviceorientation', function(eventData) {
                // gamma is the left-to-right tilt in degrees, where right is positive
                var tiltLR = eventData.gamma;

                // beta is the front-to-back tilt in degrees, where front is positive
                var tiltFB = eventData.beta;

                // alpha is the compass direction the device is facing in degrees
                var dir = eventData.alpha;

                // call our orientation event handler
                if (!window.originalOrientation){
                    window.originalOrientation = [tiltLR, tiltFB, dir];
                }

                var changeInX = tiltLR-window.originalOrientation[0];
                var changeInY = tiltFB-window.originalOrientation[1];
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

                window.orientationDifference = [changeInX, changeInY];
            }, false);
        }
    };
    this.createMotionBindings();

    this.loadPage(initialPageId);

    var self = this;
    document.onclick= function(event) {
        self.clearPage();
        self.loadPage(self.loopingIDs[self.loopNum%3]);
        self.loopNum++;
    };
});
