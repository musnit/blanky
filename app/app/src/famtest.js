/* globals define */
define(function(require, exports, module) {
    var Famous = require('famous');

    //window.Engine = Engine;
    var DOMElement = Famous.domRenderables.DOMElement;
    var FamousEngine = Famous.core.FamousEngine;

    // Boilerplate code to make your life easier
    FamousEngine.init();

    // Initialize with a scene; then, add a 'node' to the scene root
    var scene = FamousEngine.createScene('#device-screen');
    var parent = scene.addChild();
    var logo = parent.addChild();

    // Create an [image] DOM element providing the logo 'node' with the 'src' path
    new DOMElement(logo, { tagName: 'img' })
        .setAttribute('src', './content/images/pages/19/george.png');

    // Chainable API
    parent
        .setAlign(0.5,0.5)
        .setSizeMode('absolute','absolute')
        .setAbsoluteSize(900, 1200)
        .setScale(1,1)
        .setOrigin(undefined, undefined)
        .setPosition(-21, -250);
    logo
        .setOrigin(0.5, 0.5)
        .setPosition(0, 0)
        .setScale(1, 1, 1);

    // Add a spinner component to the logo 'node' that is called, every frame
    var spinner = logo.addComponent({
        onUpdate: function(time) {
            logo.setRotation(0, time / 1000, 0);
            logo.requestUpdateOnNextTick(spinner);
        }
    });

    // Let the magic begin...
    //logo.requestUpdate(spinner);

});
