define(function(require, exports, module) {

    var Famous = require('famous');
    var Node = Famous.core.Node;
    var PopupNode  = require('nodes/PopupNode');
    var ParameterTransformer = require('helpers/ParameterTransformer');
    var ConfigParser = require('helpers/ConfigParser');
    var Camera          = Famous.components.Camera;
    var MathFunctions = require('helpers/MathFunctions');

    function _createPage() {
        var self = this;
        this.popupNodes = [];
        this.cameraBoundNodes = [];
        this.mainRoot = this.addChild();
        this.cameraBoundRoot = this.addChild();
        this.popups.forEach(function(popup) {
            if(popup.cameraBound){
                var popupNode = new PopupNode(popup, self.model);
                self.cameraBoundNodes.push(popupNode);
                self.cameraBoundRoot.addChild(popupNode);
            }
            else{
                var popupNode = new PopupNode(popup, self.model);
                self.popupNodes.push(popupNode);
                self.mainRoot.addChild(popupNode);
            }
        });
    }

    function PopupPageNode(model, scene) {
        var self = this;
        Node.apply(this, arguments);
        this.popups = model.popups;
        this.model = model;
        this.scene = scene;
        this.camera = new Camera(scene)
        this.camera.setDepth(parseFloat(model.page.perspective));
        if (model.camera.perspectiveZoom){
            this.perspectiveFunction;
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

        this.cameraUpdaterComponent = {
          onUpdate: function(time) {
            if (model.camera.perspectiveZoom){
                var timePassed = parseFloat(Date.now())%self.pageSpeed;
                var timeOffset = parseFloat(model.camera.timeOffset);
                var perspective = model.page.perspective - self.perspectiveFunction((timePassed+timeOffset)/self.perspectiveZoomSpeed, self.perspectiveZoomAmount);
                self.camera.setDepth(perspective);
                self.cameraBoundNodes.forEach(function(node) {
                    var nodePosition = node.getPosition();
                    node.setPosition(nodePosition[0], nodePosition[1], perspective*0.7 + node.parsedConfig.cameraBoundOffset)
                });
                self.requestUpdate(this.id);
            }
          }
        }; 
        this.cameraUpdaterComponentID = this.addComponent(this.cameraUpdaterComponent);
        this.cameraUpdaterComponent.id = this.cameraUpdaterComponentID;
        this.requestUpdate(this.cameraUpdaterComponentID);

        _createPage.call(this);
        var self = this;
        self.setAlign(0,0);
        self.setSizeMode('absolute','absolute');
        self.setAbsoluteSize(parseFloat(model.page.x), parseFloat(model.page.y));

        this.parsedConfig = ConfigParser.prototype.parseConfig(model.camera, model);
        var transformer = new ParameterTransformer(this.parsedConfig, model);
        self.mainRoot.setPosition(transformer.initialPosition[0], transformer.initialPosition[1], transformer.initialPosition[2]);
        self.setOrigin(transformer.initialOrigin[0], transformer.initialOrigin[1], transformer.initialOrigin[2]);
        self.mainRoot.setScale(transformer.initialScale[0], transformer.initialScale[1], transformer.initialScale[2]);
        self.cameraBoundRoot.setOrigin(transformer.initialOrigin[0], transformer.initialOrigin[1], transformer.initialOrigin[2]);
        self.cameraBoundRoot.setScale(transformer.initialScale[0], transformer.initialScale[1], transformer.initialScale[2]);

        self.componentID = transformer.createComponent(self.mainRoot);
        self.mainRoot.requestUpdate(self.componentID);

        this.contentInserted = function() {
            self.popupNodes.forEach(function(popupNode) {
                popupNode.contentInserted();
            });
        };
    }

    PopupPageNode.prototype = Object.create(Node.prototype);
    PopupPageNode.prototype.constructor = PopupPageNode;

    module.exports = PopupPageNode;
});
