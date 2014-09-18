define(function(require, exports, module) {
    var Surface = require('famous/core/Surface');
    var VideoSurface = require('famous/surfaces/VideoSurface');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var GenericSync = require('famous/inputs/GenericSync');
    var MouseSync = require('famous/inputs/MouseSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var Transitionable = require('famous/transitions/Transitionable');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');
    var PageView  = require('views/PageView');

    function Page19View() {
        PageView.apply(this, arguments);
        _createPage.call(this);
    }

    Page19View.prototype = Object.create(PageView.prototype);
    Page19View.prototype.constructor = Page19View;

    function _createPage() {
        this.backgroundMod = new Modifier({
            origin: [0.5, 0.5],
            transform: Transform.scale(1.1,1.1,1),
            align: [0.5,0.5]
        });

        this.backgroundSurface = new ImageSurface({
            size: [undefined, undefined],
            classes: ["page"],
            content: '/content/images/pages/19/background.png',
        });

        this.hand01Mod = new Modifier({
            origin: [0, 1],
            transform: Transform.scale(0.47,0.25,1)
        });

        this.hand01Surface = new ImageSurface({
            size: [undefined, undefined],
            classes: ["page"],
            content: '/content/images/pages/19/hand01.png',
        });

        this.hand02Mod = new Modifier({
            origin: [0, 0.33],
            transform: Transform.scale(0.39,0.54,1)
        });

        this.hand02Surface = new ImageSurface({
            size: [undefined, undefined],
            classes: ["page"],
            content: '/content/images/pages/19/hand02.png',
        });

        this.hand03Mod = new Modifier({
            origin: [0, 0],
            transform: Transform.scale(0.49,0.36,1)
        });

        this.hand03Surface = new ImageSurface({
            size: [undefined, undefined],
            classes: ["page"],
            content: '/content/images/pages/19/hand03.png',
        });

        this.hand04Mod = new Modifier({
            origin: [1, 0],
            transform: Transform.scale(0.3683,0.4775,1)
        });

        this.hand04Surface = new ImageSurface({
            size: [undefined, undefined],
            classes: ["page"],
            content: '/content/images/pages/19/hand04.png',
        });

        this.debugMod = new Modifier({
            origin: [0.5, 0.5]
        });

        this.debugSurface = new Surface({
            size: [200, 200],
            content: '<div class="debug">yay</div>',
        });

        this._add(this.backgroundMod).add(this.backgroundSurface);
        this._add(this.hand01Mod).add(this.hand01Surface);
        this._add(this.hand02Mod).add(this.hand02Surface);
        this._add(this.hand03Mod).add(this.hand03Surface);
        this._add(this.hand04Mod).add(this.hand04Surface);
        //this._add(this.debugMod).add(this.debugSurface);

        this.position = 0;

        this.createTouchBindings();
        this.createMotionBindings();
    }

    Page19View.prototype.adjustOrientation = function(tiltLR, tiltFB, dir){
        this.backgroundMod.setAlign([0.5,0.5]);
        changeInX = tiltLR-this.originalOrientation[0];
        changeInY = tiltFB-this.originalOrientation[1];
        if(changeInX >30) changeInX = 30;
        if(changeInY >30) changeInY = 30;
        if(changeInX <-30) changeInX = -30;
        if(changeInY <-30) changeInY = -30;
        percentChangeInX = (((changeInX + 60)*(100/60) - 100)*2)/100;
        percentChangeInY = (((changeInY + 60)*(100/60) - 100)*2)/100;
        alignChangeInX = 0.05*percentChangeInX;
        alignChangeInY = 0.05*percentChangeInY;
        this.backgroundMod.setAlign([0.5+alignChangeInX,0.5+alignChangeInY]);
        this.debugSurface.setContent('<div class="debug">'+ (alignChangeInX) +"<br/>"+(alignChangeInY) +'</div>');
    };

    Page19View.prototype.createMotionBindings = function(){

        if (window.DeviceOrientationEvent) {
            self = this;   
            this.originalOrientation = false;
            window.addEventListener('deviceorientation', function(eventData) {
                // gamma is the left-to-right tilt in degrees, where right is positive
                var tiltLR = eventData.gamma;

                // beta is the front-to-back tilt in degrees, where front is positive
                var tiltFB = eventData.beta;

                // alpha is the compass direction the device is facing in degrees
                var dir = eventData.alpha;

                // call our orientation event handler
                if(!self.originalOrientation){
                    self.originalOrientation = [tiltLR, tiltFB, dir];
                }
                self.adjustOrientation(tiltLR, tiltFB, dir);
            }, false);
        }
    };
    module.exports = Page19View;
});