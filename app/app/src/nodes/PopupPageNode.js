define(function(require, exports, module) {

    var Famous = require('famous');
    var Node = Famous.core.Node;
    var PopupNode  = require('nodes/PopupNode');
    var ParameterTransformer = require('helpers/ParameterTransformer');
    var ConfigParser = require('helpers/ConfigParser');
    var Camera          = Famous.components.Camera;
    var MathFunctions = require('helpers/MathFunctions');

    function _createPage() {
        var popupNode;
        var self = this;
        this.popupNodes = [];
        this.cameraBoundNodes = [];
        this.mainRoot = this.addChild();
        this.cameraBoundRoot = this.topScene.addChild();
        this.popups.forEach(function(popup) {
            if (popup.cameraBound){
                popupNode = new PopupNode(popup, self.model);
                self.cameraBoundNodes.push(popupNode);
                self.cameraBoundRoot.addChild(popupNode);
            }
            else {
                popupNode = new PopupNode(popup, self.model);
                self.popupNodes.push(popupNode);
                self.mainRoot.addChild(popupNode);
            }
        });
    }

    function PopupPageNode(model, scene, topScene) {
        Node.apply(this, arguments);
        this.popups = model.popups;
        this.model = model;
        this.scene = scene;
        this.topScene = topScene;
        this.camera = new Camera(scene);
        this.camera.setDepth(parseFloat(model.page.perspective));
        if (model.camera.perspectiveZoom){
            this.pageSpeed = parseFloat(model.page.speed) || 1;
            this.perspectiveZoomSpeed = this.pageSpeed * parseFloat(model.camera.perspectiveZoomSpeed);
            this.perspectiveZoomAmount = parseFloat(model.camera.perspectiveZoomAmount);
            this.perspectiveZoomCutStart = parseFloat(model.camera.perspectiveZoomCutStart);
            this.perspectiveZoomCutEnd = parseFloat(model.camera.perspectiveZoomCutEnd);
            if (model.camera.perspectiveZoomType === 'triangle'){
                this.perspectiveFunction = MathFunctions.prototype.triangleFunction;
            }
            else if (model.camera.perspectiveZoomType === 'sawtooth'){
                this.perspectiveFunction = MathFunctions.prototype.sawToothFunction;
            }
            else if (model.camera.perspectiveZoomType === 'cos'){
                this.perspectiveFunction = MathFunctions.prototype.cosFunction;
            }
            else {
                this.perspectiveFunction = MathFunctions.prototype.sinFunction;
            }
            if (model.camera.perspectiveZoomCut){
                this.perspectiveFunction = MathFunctions.prototype.cutFunction(this.perspectiveFunction, this.perspectiveZoomCutStart, this.perspectiveZoomCutEnd, this.perspectiveFunction.period);
            }
        }

        _createPage.call(this);

        this.setAlign(0,0);
        this.setSizeMode('absolute','absolute');
        this.setAbsoluteSize(parseFloat(model.page.x), parseFloat(model.page.y));

        this.parsedConfig = ConfigParser.prototype.parseConfig(model.camera, model);
        var transformer = new ParameterTransformer(this.parsedConfig, model);
        this.mainRoot.setPosition(transformer.initialPosition[0], transformer.initialPosition[1], transformer.initialPosition[2]);
        this.setOrigin(transformer.initialOrigin[0], transformer.initialOrigin[1], transformer.initialOrigin[2]);
        this.mainRoot.setScale(transformer.initialScale[0], transformer.initialScale[1], transformer.initialScale[2]);

        this.componentID = transformer.createComponent(this.mainRoot);
        this.mainRoot.requestUpdate(this.componentID);
    }

    PopupPageNode.prototype = Object.create(Node.prototype);
    PopupPageNode.prototype.constructor = PopupPageNode;
    PopupPageNode.prototype.contentInserted = function() {
      this.popupNodes.forEach(function(popupNode) {
        popupNode.contentInserted();
      });
    };
    PopupPageNode.prototype.dismount = function() {
      this.cameraBoundRoot.dismount();
      Node.prototype.dismount.apply(this, arguments);
    };

    module.exports = PopupPageNode;
});
