/*** AppView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');

    var PopupPageView = require('views/PopupPageView');
    var Transform = require('famous/core/Transform');
    var Lightbox = require('famous/views/Lightbox');
    var ParamaterTransformer = require('helpers/ParamaterTransformer');

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
    AppView.prototype.createAndShowPage = function(pageJSON) {
        this.contentView = new PopupPageView(pageJSON);
        this.cameraModifier = new Modifier({
            origin: [0, 0],
            transform: function() {
                var transformer = new ParamaterTransformer(pageJSON.camera, null);
                var transform = transformer.calculateTransform();
                return transform;
            },
            align: [0,0]
        });
        var fullPage = new View();
        fullPage.add(this.cameraModifier).add(this.contentView);
        this.lightbox.show(fullPage);
    };

    AppView.DEFAULT_OPTIONS = {};

    module.exports = AppView;
});
