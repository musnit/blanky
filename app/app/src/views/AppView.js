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
        window.mainContext.setPerspective(parseFloat(pageJSON.page.perspective));
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
                var perspectiveFunction;
                var pageSpeed = parseFloat(pageJSON.page.speed) || 1;
                var perspectiveZoomSpeed = pageSpeed * parseFloat(pageJSON.camera.perspectiveZoomSpeed);
                var perspectiveZoomAmount = parseFloat(pageJSON.camera.perspectiveZoomAmount);
                var perspectiveZoomCutStart = parseFloat(pageJSON.camera.perspectiveZoomCutStart);
                var perspectiveZoomCutEnd = parseFloat(pageJSON.camera.perspectiveZoomCutEnd);
                if (pageJSON.camera.perspectiveZoomType === 'triangle'){
                    perspectiveFunction = ParamaterTransformer.prototype.triangleFunction;
                }
                else if (pageJSON.camera.perspectiveZoomType === 'sawtooth'){
                    perspectiveFunction = ParamaterTransformer.prototype.sawToothFunction;
                }
                else if (pageJSON.camera.perspectiveZoomType === 'cos'){
                    perspectiveFunction = ParamaterTransformer.prototype.cosFunction;
                }
                else {
                    perspectiveFunction = ParamaterTransformer.prototype.sinFunction;
                }
                if (pageJSON.camera.perspectiveZoomCut){
                    perspectiveFunction = ParamaterTransformer.prototype.cutFunction(perspectiveFunction, perspectiveZoomCutStart, perspectiveZoomCutEnd, perspectiveFunction.period);
                }
                if (pageJSON.camera.perspectiveZoom){
                    var timePassed = parseFloat(Date.now())%pageSpeed;
                    var timeOffset = parseFloat(pageJSON.camera.timeOffset);
                    var perspective = pageJSON.page.perspective - perspectiveFunction((timePassed+timeOffset)/perspectiveZoomSpeed, perspectiveZoomAmount);
                    window.mainContext.setPerspective(perspective);
                }
                return transform;
            }
        });
        window.cameraModifier = cameraModifier;
        this.add(cameraModifier).add(this.lightbox);
        this.lightbox.show(this.contentView);
    };

    AppView.DEFAULT_OPTIONS = {};

    module.exports = AppView;
});
