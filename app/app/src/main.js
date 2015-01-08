
/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var AppView = require('views/AppView');
    this.initialTime = Date.now();
    Engine.setOptions({appMode: false});
    Parse.initialize('U0A3f3L3EHbQpF8Oig2zhlOasUF6PhJkTOQOvjoH', 'aNTIn2zXGxzAEl8BLOnHzuWvaOYySN5QqHPLgA1X');
    var Page = Parse.Object.extend('Page');
    var Fixtures = require('Fixtures');

    // create the main context
    var mainContext = Engine.createContext(document.getElementById('device-screen'));
    mainContext.setPerspective(1000);
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

    this.clearPage = function(){
        window.rivetsView.unbind();
        window.appView.lightbox.hide();
    };

    this.loadPage = function(pageID){
        var query = new Parse.Query(Page);
        query.get(pageID, {
          success: function(page) {
            window.saver.currentPageID = pageID;
            var pageModel = page.toJSON();
            window.pageModel = pageModel;
            window.appView.createAndShowPage(pageModel);
            window.originalBody = document.getElementById('body');
            var rivetsView = window.rivetsView || rivets.bind(document.getElementById('body'), pageModel);
            window.rivetsView = rivetsView;
            window.rivetsView.unbind();
            window.rivetsView.models = pageModel;
            window.rivetsView.bind();
            window.saver.model = pageModel;
            window.saver.Page = Page;
            var audioPath = 'content/sounds/';
            var manifest = [
                {id:'Music', src:'bgMusic.mp3'},
                {id:'Waves', src:'light_ocean_waves_on_rocks_001.mp3'}
            ];
            createjs.Sound.alternateExtensions = ['mp3'];
            var handleLoad = function(event) {
                if (event.src == 'content/sounds/bgMusic.mp3'){
                    createjs.Sound.play(event.src, { loop: -1 });
                }
                else if (event.src == 'content/sounds/light_ocean_waves_on_rocks_001.mp3'){
                   createjs.Sound.play(event.src, { loop:-1, volume: 0.1 });
                }
            };
            createjs.Sound.addEventListener('fileload', handleLoad);
            createjs.Sound.registerSounds(manifest, audioPath);
          }
        });
    };
    
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
        this.model.popups.push({});
    };
    window.saver = saver;

    var pageChanger = {};
    pageChanger.main = this;
    pageChanger.changePage = function() {
        var pageID = document.getElementById('page-chooser').value;
        this.main.clearPage();
        this.main.loadPage(pageID);
    }
    window.pageChanger = pageChanger;

    this.loadPage('w9zCNnEbfC');

});
