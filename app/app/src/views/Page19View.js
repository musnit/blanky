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
        this.originMod = new Modifier({
            origin: [0, 0]
        });

        this.pageSurface = new ImageSurface({
            size: [undefined, undefined],
            classes: ["page"],
            content: '/content/images/pages/19/screenshot.png',
        });

        var modifier = new Modifier({
            transform: Transform.rotateY(0)
        });

        this._add(this.originMod).add(this.pageSurface);

        this.position = 0;

        this.createTouchBindings();
    }

    module.exports = Page19View;
});