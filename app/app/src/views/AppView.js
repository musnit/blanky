/*** AppView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var PopupPageView = require('views/PopupPageView');
    var Lightbox = require('famous/views/Lightbox');
    var Modifier = require('famous/core/Modifier');
    var ParamaterTransformer = require('helpers/ParamaterTransformer');

    function AppView() {
        View.apply(this, arguments);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;
    AppView.prototype.createAndShowPage = function(pageJSON) {
        this.contentView = new PopupPageView(pageJSON);
        this.lightbox = new Lightbox({
        });

        var cameraModifier = new Modifier({
            origin: function() {
                var originX = parseFloat(pageJSON.camera.xOrigin) || 0;
                var originY = parseFloat(pageJSON.camera.yOrigin) || 0;
                return [originX,originY];
            },
            align: [0.5,0.5],
            transform: function() {
                var transformer = new ParamaterTransformer(pageJSON.camera, pageJSON);
                var transform = transformer.calculateTransform();
                return transform;
            }
        });

        this.add(cameraModifier).add(this.lightbox);
        this.lightbox.show(this.contentView);
    };

    AppView.DEFAULT_OPTIONS = {};

    module.exports = AppView;
});
