define(function(require, exports, module) {
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var PageView  = require('views/PageView');
    var Transitionable = require('famous/transitions/Transitionable');

    function _createPage() {
        var self = this;
        this.initialTime = Date.now();

        this.backgroundMod = new Modifier({
            origin: [0.5, 0.5],
            transform: Transform.scale(1,1,1),
            align: [0.5,0.5]
        });

        this.backgroundSurface = new ImageSurface({
            size: [undefined, undefined],
            classes: ['page'],
            content: '/content/images//pages/22and23/background.png'
        });

        this.wavesMod = new Modifier({
            origin: [0.5, 0.5],
            transform: function(){
                timePassed = Date.now() - self.initialTime;
                var y = Math.sin(timePassed/250)*100;
                var x = Math.sin(timePassed/500)*100;
                return Transform.translate(x,y,0);
            },
            align: [0.5,0.5]
        });

        this.wavesSurface = new ImageSurface({
            size: [undefined, undefined],
            classes: ['page'],
            content: '/content/images//pages/22and23/waves.png'
        });

        this.shipMod = new Modifier({
            origin: [0.5, 0.5],
            transform: function(){
                timePassed = Date.now() - self.initialTime;
                var rotate = Math.sin(timePassed/1000)/6;
                return Transform.rotate(0,0,rotate);
            },
            align: [0.5,0.5]
        });

        this.shipSurface = new ImageSurface({
            size: [undefined, undefined],
            classes: ['page'],
            content: '/content/images//pages/22and23/ship.png'
        });

        this.mainPirateMod = new Modifier({
            origin: [0.5, 0.5],
            transform: function(){
                timePassed = Date.now() - self.initialTime;
                var rotate = Math.sin(timePassed/1000)/5;
                return Transform.rotate(0,0,rotate);
            },
            align: [0.5,0.5]
        });

        this.mainPirateSurface = new ImageSurface({
            size: [undefined, undefined],
            classes: ['page'],
            content: '/content/images//pages/22and23/main_pirate.png'
        });

        this.charlieMod = new Modifier({
            origin: [0.5, 0.5],
            transform: function(){
                timePassed = Date.now() - self.initialTime;
                var rotate = Math.sin(timePassed/1000)/4;
                return Transform.rotate(0,0,rotate);
            },
            align: [0.5,0.5]
        });

        this.charlieSurface = new ImageSurface({
            size: [undefined, undefined],
            classes: ['page'],
            content: '/content/images//pages/22and23/charlie.png'
        });

        this.frontRopeMod = new Modifier({
            origin: [0.5, 0.5],
            transform: function(){
                timePassed = Date.now() - self.initialTime;
                var rotate = Math.sin(timePassed/1000)/3;
                return Transform.rotate(0,0,rotate);
            },
            align: [0.5,0.5]
        });

        this.frontRopeSurface = new ImageSurface({
            size: [undefined, undefined],
            classes: ['page'],
            content: '/content/images//pages/22and23/front_rope.png'
        });

        this._add(this.backgroundMod).add(this.backgroundSurface);
        this._add(this.wavesMod).add(this.wavesSurface);
        this._add(this.shipMod).add(this.shipSurface);
        this._add(this.mainPirateMod).add(this.mainPirateSurface);
        this._add(this.charlieMod).add(this.charlieSurface);
        this._add(this.frontRopeMod).add(this.frontRopeSurface);

        this.position = 0;

        //this.createTouchBindings();
        //this.createMotionBindings();
        this.createAnimationBindings();
    }

    function Page22And23View() {
        PageView.apply(this, arguments);
        _createPage.call(this);
    }

    Page22And23View.prototype = Object.create(PageView.prototype);
    Page22And23View.prototype.constructor = Page22And23View;

    Page22And23View.prototype.createAnimationBindings = function() {
        var self = this;

    };

    module.exports = Page22And23View;
});
