/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var AppView = require('views/AppView');
    var Sound = require('soundjs');
    var Parse = require('parse');
    this.initialTime = Date.now();
    Engine.setOptions({appMode: false});
    Parse.initialize('U0A3f3L3EHbQpF8Oig2zhlOasUF6PhJkTOQOvjoH', 'aNTIn2zXGxzAEl8BLOnHzuWvaOYySN5QqHPLgA1X');
    var Page = Parse.Object.extend('Page');
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

    rivets.binders.input = {
        publishes: true,
        routine: rivets.binders.value.routine,
        bind: function(el) {
            el.addEventListener('input', this.publish);
        },
        unbind: function(el) {
            el.removeEventListener('input', this.publish);
        }
    };

    var PageCollection = Parse.Collection.extend({
      model: Page
    });
    var pageCollection = new PageCollection();

    pageCollection.fetch({
      success: function(pages) {
        var pagesModel = {};
        pagesModel.pages = pages.toJSON();
        window.pagesModel = pagesModel;
        var pagesListView = window.pagesListView || rivets.bind(document.getElementById('editor-section'), pagesModel);
        window.pagesListView = pagesListView;
        window.pagesListView.unbind();
        window.pagesListView.models = pagesModel;
        window.pagesListView.bind();
        document.getElementById('page-chooser').value = window.initialPageId;
      },
      error: function(collection, error) {
        alert('error with fetching page list');
      }
    });

    this.clearPage = function() {
        window.rivetsView.unbind();
        window.appView.lightbox.hide();
        Sound.removeAllSounds();
    };

    this.loadPage = function(pageID) {
        var query = new Parse.Query(Page);
        query.get(pageID, {
          success: function(page) {
            window.saver.currentPageID = pageID;
            var pageModel = page.toJSON();
            window.pageModel = pageModel;
            window.appView.createAndShowPage(pageModel);

            var rivetsView = window.rivetsView || rivets.bind(document.getElementById('edit-section'), pageModel);
            window.rivetsView = rivetsView;
            window.rivetsView.unbind();
            window.rivetsView.models = pageModel;
            window.rivetsView.bind();

            window.saver.model = pageModel;
            window.saver.Page = Page;

            window.pageModel.editPopup = [window.pageModel.camera];
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
          },
          error: function() {
            window.saver.currentPageID = pageID;
            var pageModel = window.Fixtures[pageID].results[0];
            window.pageModel = pageModel;
            window.appView.createAndShowPage(pageModel);
            var rivetsView = window.rivetsView || rivets.bind(document.getElementById('edit-section'), pageModel);
            window.rivetsView = rivetsView;
            window.rivetsView.unbind();
            window.rivetsView.models = pageModel;
            window.rivetsView.bind();

            window.pageModel.editPopup = [window.pageModel.camera];
            window.saver.model = pageModel;
            window.saver.Page = Page;

            var audioPath = 'content/sounds/';
            var manifest = window.pageModel.sounds;
            Sound.alternateExtensions = ['mp3'];
            var handleLoad = function(event) {
                var soundObject = window.saver.model.sounds.filter(function(sound) {
                    return (event.src === (audioPath + sound.src));
                })[0];
                Sound.play(audioPath + soundObject.src, {
                    loop: soundObject.loop,
                    volume: soundObject.volume
                });
            };
            Sound.addEventListener('fileload', handleLoad);
            Sound.registerSounds(manifest, audioPath);
          }
        });
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

    var saver = {};
    saver.saveToParse = function() {
        var page = new this.Page();
        this.model.objectId = this.currentPageID;
        page.save(this.model, {
          success: function() {
            window.saver.model.objectId = this.currentPageID;
            alert('saved successfully!');
          }
        });
    };
    saver.addNewPopup = function() {
        var defaultPopup = {'accel':false,'accelAmount':'1','height':'1','initialX':'0','initialY':'0','name':'new','rotateAngle':'100','rotateSpeed':'2000','scale':'1','scaleX':'1','scaleY':'1','timeOffset':'0','timer':{'initialTime':1419434956210},'translate':false,'translateX':'0','translateXSpeed':'1000','translateY':'0','translateYSpeed':'1000','url':'','xyRatio':'1','zoomAmount':'0','zoomSpeed':'2000'};
        this.model.popups.push(defaultPopup);
    };
    saver.removePopup = function() {
        var editPopup = this.model.editPopup[0];
        var index = this.model.popups.indexOf(editPopup);
        this.model.popups.splice(index, 1);
        window.editChanger.changeEditing();
    };
    saver.addFrame = function() {
        var editPopup = this.model.editPopup[0];
        editPopup.frames = editPopup.frames || [];
        editPopup.frames.push({url:''});
    };
    saver.deleteFrame = function(frame) {
        var editPopup = this.model.editPopup[0];
        var frameTDs = frame.parentElement.parentElement.children;
        var frameTDsArray = [].slice.call(frameTDs);
        var clickedIndex = frameTDsArray.indexOf(frame.parentElement) - 1;
        editPopup.frames.splice(clickedIndex, 1);
    };
    saver.addSound = function() {
        this.model.sounds = this.model.sounds || [];
        this.model.sounds.push({name: '', url:''});
    };
    saver.deleteSound = function(sound) {
        var soundTDs = sound.parentElement.parentElement.children;
        var soundTDsArray = [].slice.call(soundTDs);
        var clickedIndex = soundTDsArray.indexOf(sound.parentElement) - 1;
        this.model.sounds.splice(clickedIndex, 1);
    };
    saver.dupePage = function() {
        var page = new this.Page();
        page.set('name', 'dup of ' + this.model.name);
        page.set('device', this.model.device);
        page.set('popups', this.model.popups);
        page.set('camera', this.model.camera);
        page.set('page', this.model.page);
        page.set('sounds', this.model.sounds);
        page.save(null, {
          success: function(page) {
            alert('Duplicate page created with objectId: ' + page.id);
          },
          error: function(page, error) {
            alert('Failed to create new page, with error code: ' + error.message);
          }
        });
    };
    saver.addNewPage = function() {
        var page = new this.Page();
        var defaultCamera = {'height':'0','initialX':'0','initialY':'0','motionType':'sine','name':'camera','rotateAngle':'100','rotateSpeed':'2000','scale':'1','timeOffset':'100','translate':false,'translateX':'0','translateXSpeed':'5000','translateY':'200','translateYSpeed':'18000','xyRatio':'1','zoomAmount':'0','zoomSpeed':'2000'};
        var defaultPage = {'name':'new','x':'900','y':'1200'};
        page.set('name', 'new');
        page.set('device', 'new');
        page.set('popups', []);
        page.set('camera', defaultCamera);
        page.set('page', defaultPage);

        page.save(null, {
          success: function(page) {
            alert('New page created with objectId: ' + page.id);
          },
          error: function(page, error) {
            alert('Failed to create new page, with error code: ' + error.message);
          }
        });
    };
    window.saver = saver;

    var pageChanger = {};
    pageChanger.main = this;
    pageChanger.changePage = function() {
        var pageID = document.getElementById('page-chooser').value;
        this.main.clearPage();
        this.main.loadPage(pageID);
    };
    window.pageChanger = pageChanger;

    var timeController = {};
    timeController.main = this;
    timeController.realTime = Date.now;
    timeController.pause = function() {
        var pauseButton = document.getElementById('pause-button');
        pauseButton.onclick = function onclick(event) {
          window.timeController.play();
        };
        pauseButton.textContent = 'Play';
        document.getElementById('time-chooser').hidden = false;
        Date.now = function() {
            return 0;
        };
    };
    timeController.update = function(newTime) {
        Date.now = function() {
            return parseInt(newTime);
        };
    };
    timeController.play = function() {
        var pauseButton = document.getElementById('pause-button');
        pauseButton.onclick = function onclick(event) {
          window.timeController.pause();
        };
        pauseButton.textContent = 'Pause';
        Date.now = this.realTime;
        document.getElementById('time-chooser').hidden = true;
    };
    window.timeController = timeController;

    var editChanger = {};
    editChanger.main = this;
    editChanger.changeEditing = function() {
        var itemID = document.querySelector('input[name="edit-chooser"]:checked').value;
        if (itemID !== 'camera'){
            var editPopup = window.pageModel.popups.filter(function(popup) {
                if (popup.name === itemID){
                    return true;
                }
                else {
                    return false;
                }
            });
            window.pageModel.editPopup = editPopup;
        }
        else {
            window.pageModel.editPopup = [window.pageModel.camera];
        }
    };
    window.editChanger = editChanger;

    this.loadPage(initialPageId);

    //var self = this;
    //document.onclick= function(event) {
    //    self.loadPage(self.loopingIDs[self.loopNum%3]);
    //    self.loopNum++;
    //};
});
