/*** AppView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var PopupPageView = require('views/PopupPageView');
    var Lightbox = require('famous/views/Lightbox');
    var Modifier = require('famous/core/Modifier');
    var ParameterTransformer = require('helpers/ParameterTransformer');
    var MathFunctions = require('helpers/MathFunctions');

    function AppView() {
        View.apply(this, arguments);
        var cameraModifier = new Modifier({align: [0.5,0.5]});
        window.cameraModifier = cameraModifier;
        this.lightbox = new Lightbox({
        });
        this.add(cameraModifier).add(this.lightbox);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;
    AppView.prototype.createAndShowPage = function(pageJSON) {
        window.mainContext.setPerspective(parseFloat(pageJSON.page.perspective));
        this.contentView = new PopupPageView(pageJSON);

        var originFunction = function() {
            var originX = parseFloat(pageJSON.camera.xOrigin) || 0;
            var originY = parseFloat(pageJSON.camera.yOrigin) || 0;
            return [originX,originY];
        };
        var transformFunction = function() {
            var transformer = new ParameterTransformer(pageJSON.camera, pageJSON);
            var transform = transformer.calculateTransform();
            var perspectiveFunction;
            var pageSpeed = parseFloat(pageJSON.page.speed) || 1;
            var perspectiveZoomSpeed = pageSpeed * parseFloat(pageJSON.camera.perspectiveZoomSpeed);
            var perspectiveZoomAmount = parseFloat(pageJSON.camera.perspectiveZoomAmount);
            var perspectiveZoomCutStart = parseFloat(pageJSON.camera.perspectiveZoomCutStart);
            var perspectiveZoomCutEnd = parseFloat(pageJSON.camera.perspectiveZoomCutEnd);
            if (pageJSON.camera.perspectiveZoomType === 'triangle'){
                perspectiveFunction = MathFunctions.prototype.triangleFunction;
            }
            else if (pageJSON.camera.perspectiveZoomType === 'sawtooth'){
                perspectiveFunction = MathFunctions.prototype.sawToothFunction;
            }
            else if (pageJSON.camera.perspectiveZoomType === 'cos'){
                perspectiveFunction = MathFunctions.prototype.cosFunction;
            }
            else {
                perspectiveFunction = MathFunctions.prototype.sinFunction;
            }
            if (pageJSON.camera.perspectiveZoomCut){
                perspectiveFunction = MathFunctions.prototype.cutFunction(perspectiveFunction, perspectiveZoomCutStart, perspectiveZoomCutEnd, perspectiveFunction.period);
            }
            if (pageJSON.camera.perspectiveZoom){
                var timePassed = parseFloat(Date.now())%pageSpeed;
                var timeOffset = parseFloat(pageJSON.camera.timeOffset);
                var perspective = pageJSON.page.perspective - perspectiveFunction((timePassed+timeOffset)/perspectiveZoomSpeed, perspectiveZoomAmount);
                window.mainContext.setPerspective(perspective);
            }
            return transform;
        };
        window.cameraModifier.setOrigin(originFunction);
        window.cameraModifier.setTransform(transformFunction);
        this.lightbox.show(this.contentView, null, this.contentView.contentInserted);
    };

    AppView.DEFAULT_OPTIONS = {};

    module.exports = AppView;
});
