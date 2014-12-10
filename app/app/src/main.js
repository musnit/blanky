/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var AppView = require('views/AppView');
    this.initialTime = Date.now();
    Engine.setOptions({appMode: false});

    var page22And23Model = { popups: [
            {name: 'background', timer: this, url: '/content/images/pages/22and23/background.png'},
            {name: 'wave', timer: this, url: '/content/images/pages/22and23/waves.png', translate: true, translateY: 100, translateX: 100, translateYSpeed: 1000, translateXSpeed: 2000},
            {name: 'ship', timer: this, url: '/content/images/pages/22and23/ship.png', rotate: true, rotateAngle: 12, rotateSpeed: 2000},
            {name: 'main_pirate', timer: this, url: '/content/images/pages/22and23/main_pirate.png', translate: true, translateY: 0, translateX: -20, translateYSpeed: 1000, translateXSpeed: 2000, rotate: true, rotateAngle: 20, rotateSpeed: 2000},
            {name: 'charlie', timer: this, url: '/content/images/pages/22and23/charlie.png', translate: true, translateY: 0, translateX: 20, translateYSpeed: 1000, translateXSpeed: 2000, rotate: true, rotateAngle: 10, rotateSpeed: 2000},
            {name: 'front_rope', timer: this, url: '/content/images/pages/22and23/front_rope.png', rotate: true, rotateAngle: 8, rotateSpeed: 2000}
        ]};


    // create the main context
    var mainContext = Engine.createContext(document.getElementById('device-screen'));
    mainContext.setPerspective(1000);
    var appView = new AppView(page22And23Model);

    mainContext.add(appView);

    rivets.binders.input = {
        publishes: true,
        routine: rivets.binders.value.routine,
        bind: function (el) {
            el.addEventListener('input', this.publish);
        },
        unbind: function (el) {
            el.removeEventListener('input', this.publish);
        }
    };

    rivets.bind(document.getElementById('edit-section'), page22And23Model);
});
