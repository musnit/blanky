/*** AppView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Modifier = require('famous/core/Modifier');

    var PopupPageView = require('views/PopupPageView');
    var Transform = require('famous/core/Transform');

    function _createPageView() {
        this.contentView = new PopupPageView(this.model);
        self = this;
        this.cameraModifier = new Modifier({
            origin: [0, 0],
            transform: function() {
                var rotate, timePassed, x, y, xyRatio, scale, timeOffset, translateYSpeed,translateXSpeed, translateX, translateY, rotateSpeed, rotateAngle;
                x = parseInt(self.model.camera.initialX);
                y = parseInt(self.model.camera.initialY);
                scale = parseFloat(self.model.camera.scale);
                xyRatio = parseFloat(self.model.camera.xyRatio)
                timePassed = Date.now();
                if (self.model.camera.translate){
                    y += (Math.sin(timePassed/self.model.camera.translateYSpeed)+1)*self.model.camera.translateY;
                    x += (Math.sin(timePassed/self.model.camera.translateXSpeed)+1)*self.model.camera.translateX;
                }
                else {
                    y += 0;
                    x += 0;
                }
                if (self.model.camera.rotate){
                    rotate = Math.sin(timePassed/self.model.camera.rotateSpeed)/self.model.camera.rotateAngle;
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

        this.add(this.cameraModifier).add(this.contentView);
        this.ipad = new ImageSurface({
            size: [961, 650],
            content: '/content/images/ipad.png'
        });
        this.ipadModifier = new Modifier({
            origin: [0.507, 0.5],
            align: [0.5,0.5]
        });
        this._add(this.ipadModifier).add(this.ipad);
    }

    function AppView(model) {
        View.apply(this, arguments);
        this.model = model;

        _createPageView.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {};

    module.exports = AppView;
});
