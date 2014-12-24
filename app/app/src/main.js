var saver = {};

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

    // create the main context
    var mainContext = Engine.createContext(document.getElementById('device-screen'));
    mainContext.setPerspective(1000);

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
    // Create a new instance of that class.

    var page22And23Model;

    var query = new Parse.Query(Page);
    query.get('w9zCNnEbfC', {
      success: function(page) {
        page22And23Model = page.toJSON();
        var appView = new AppView(page22And23Model);
        mainContext.add(appView);
        rivets.bind(document.getElementById('edit-section'), page22And23Model);
        saver.model = page22And23Model;
        saver.Page = Page;
      }
    });
});

saver.saveToParse = function() {
    var page22And23 = new this.Page();
    page22And23.save(this.model, {
      success: function() {
        alert('saved successfully!');
      }
    });
}
