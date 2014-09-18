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

    function Page16View() {
        PageView.apply(this, arguments);
        _createPage.call(this);
    }

    Page16View.prototype = Object.create(PageView.prototype);
    Page16View.prototype.constructor = Page16View;

    function _createPage() {
        this.originMod = new Modifier({
            origin: [0, 0]
        });

        this.pageSurface = new ImageSurface({
            size: [undefined, undefined],
            classes: ["page"],
            content: '/content/images/pages/16/screenshot.png',
        });

        var modifier = new Modifier({
            transform: Transform.thenScale(Transform.rotateY(0), [1,1,1])
        });

        this.add(modifier).add(this.originMod).add(this.pageSurface);

        this.position = 0;

        this.createTouchBindings();
    }

    module.exports = Page16View;
});