/*** AppView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Modifier = require('famous/core/Modifier');

    var PopupPageView = require('views/PopupPageView');
    var Transform = require('famous/core/Transform');
    var Lightbox = require('famous/views/Lightbox');

    function _createAppView() {
        this.lightbox = new Lightbox({
        });
        this.add(this.lightbox);
    }

    function AppView() {
        View.apply(this, arguments);

        _createAppView.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;
    AppView.prototype.createAndShowPage = function(pageJSON){
        this.contentView = new PopupPageView(pageJSON);
        self = this;
        this.cameraModifier = new Modifier({
            origin: [0, 0],
            transform: function() {
                var rotate, timePassed, x, y, xyRatio, scale, timeOffset, translateYSpeed,translateXSpeed, translateX, translateY, rotateSpeed, rotateAngle;
                x = parseInt(pageJSON.camera.initialX);
                y = parseInt(pageJSON.camera.initialY);
                scale = parseFloat(pageJSON.camera.scale);
                xyRatio = parseFloat(pageJSON.camera.xyRatio)
                timePassed = Date.now();
                if (pageJSON.camera.translate){
                    y += (Math.sin(timePassed/pageJSON.camera.translateYSpeed)+1)*pageJSON.camera.translateY;
                    x += (Math.sin(timePassed/pageJSON.camera.translateXSpeed)+1)*pageJSON.camera.translateX;
                }
                else {
                    y += 0;
                    x += 0;
                }
                if (pageJSON.camera.rotate){
                    rotate = Math.sin(timePassed/pageJSON.camera.rotateSpeed)/pageJSON.camera.rotateAngle;
                }
                else {
                    rotate = 0;
                }
                return Transform.thenScale(
                    Transform.thenMove(
                        Transform.rotate(0,0,rotate),
                        [x,y,0])
                    ,[scale*xyRatio,scale,1]
                );
            },
            align: [0,0]
        });
        var fullPage = new View();
        fullPage.add(this.cameraModifier).add(this.contentView)
        this.lightbox.show(fullPage);
    };


    AppView.DEFAULT_OPTIONS = {};

    module.exports = AppView;
});
