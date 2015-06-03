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
        //Add child twice here - this is a hack that fixes issue with
        //nodes not being cleared properly on page change. idk why lol.
        this.cameraBoundRoot = this.topScene.addChild().addChild();
        this.popups.forEach(function(popup) {
            if (popup.cameraBound){
                popupNode = new PopupNode(popup, self.model);
                self.cameraBoundNodes.push(popupNode);
                self.cameraBoundRoot.addChild(popupNode);
            }
            else {
                popupNode = new PopupNode(popup, self.model);
                self.popupNodes.push(popupNode);
                self.addChild(popupNode);
            }
        });
    }

    function PopupPageNode(model, scene, topScene) {
        var self = this;
        Node.apply(this, arguments);
        this.popups = model.popups;
        this.model = model;
        this.scene = scene;
        this.topScene = topScene;

        _createPage.call(this);
        this.camera = new Camera(scene);


        this.parsedConfig = ConfigParser.prototype.parseConfig(model.camera, model);
        this.transformer = new ParameterTransformer(this.parsedConfig, model);

        this.setupInitialState();


        this.cameraUpdaterComponent = {
          onUpdate: function(time) {
            if (model.camera.configChanged){
                self.parsedConfig = ConfigParser.prototype.parseConfig(model.camera, model);
                self.setupInitialState();
                self.transformer.setParsedConfig(self.parsedConfig);
                model.camera.configChanged = false;
            }
            if (model.camera.perspectiveZoom){
                var timePassed = parseFloat(Date.now())%self.pageSpeed;
                var timeOffset = parseFloat(model.camera.timeOffset);
                var perspective = model.page.perspective - self.perspectiveFunction((timePassed+timeOffset)/self.perspectiveZoomSpeed, self.perspectiveZoomAmount);
                self.camera.setDepth(perspective);
            }
            self.requestUpdate(this.id);
          }
        };
        this.cameraUpdaterComponentID = this.addComponent(this.cameraUpdaterComponent);
        this.cameraUpdaterComponent.id = this.cameraUpdaterComponentID;
        this.requestUpdate(this.cameraUpdaterComponentID);

        this.componentID = this.transformer.createComponent(this);
        this.requestUpdate(this.componentID);
    }

    PopupPageNode.prototype = Object.create(Node.prototype);
    PopupPageNode.prototype.constructor = PopupPageNode;
    PopupPageNode.prototype.setupInitialState = function() {
        this.camera.setDepth(parseFloat(this.model.page.perspective));
        if (this.model.camera.perspectiveZoom){
            this.pageSpeed = parseFloat(this.model.page.speed) || 1;
            this.perspectiveZoomSpeed = this.pageSpeed * parseFloat(this.model.camera.perspectiveZoomSpeed);
            this.perspectiveZoomAmount = parseFloat(this.model.camera.perspectiveZoomAmount);
            this.perspectiveZoomCutStart = parseFloat(this.model.camera.perspectiveZoomCutStart);
            this.perspectiveZoomCutEnd = parseFloat(this.model.camera.perspectiveZoomCutEnd);
            if (this.model.camera.perspectiveZoomType === 'triangle'){
                this.perspectiveFunction = MathFunctions.prototype.triangleFunction;
            }
            else if (this.model.camera.perspectiveZoomType === 'sawtooth'){
                this.perspectiveFunction = MathFunctions.prototype.sawToothFunction;
            }
            else if (this.model.camera.perspectiveZoomType === 'cos'){
                this.perspectiveFunction = MathFunctions.prototype.cosFunction;
            }
            else {
                this.perspectiveFunction = MathFunctions.prototype.sinFunction;
            }
            if (this.model.camera.perspectiveZoomCut){
                this.perspectiveFunction = MathFunctions.prototype.cutFunction(this.perspectiveFunction, this.perspectiveZoomCutStart, this.perspectiveZoomCutEnd, this.perspectiveFunction.period);
            }
        }

        this.setAlign(0,0);
        this.setSizeMode('absolute','absolute');
        this.setAbsoluteSize(parseFloat(this.model.page.x), parseFloat(this.model.page.y));

        this.cameraBoundRoot.setAlign(0,0);
        this.cameraBoundRoot.setSizeMode('absolute','absolute');
        this.cameraBoundRoot.setAbsoluteSize(parseFloat(this.model.page.x), parseFloat(this.model.page.y));

        this.setPosition(this.transformer.initialPosition[0], this.transformer.initialPosition[1], this.transformer.initialPosition[2]);
        this.setOrigin(this.transformer.initialOrigin[0], this.transformer.initialOrigin[1], this.transformer.initialOrigin[2]);
        this.setScale(this.transformer.initialScale[0], this.transformer.initialScale[1], this.transformer.initialScale[2]);
    };
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
