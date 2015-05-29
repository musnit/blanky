define(function(require, exports, module) {

  var Famous = require('famous');
  var Node = Famous.core.Node;
  var ParameterTransformer = require('helpers/ParameterTransformer');
  var ConfigParser = require('helpers/ConfigParser');
  var RepeatingImage = require('elements/RepeatingImage');
  var HighlightingText = require('elements/HighlightingText');
  var Image = require('elements/Image');
  var PlainText = require('elements/PlainText');
  var SingalongText = require('elements/SingalongText');

  function _createPopup() {
      var self = this;
      this.parsedConfig = ConfigParser.prototype.parseConfig(self.config, self.model);
      var transformer = new ParameterTransformer(this.parsedConfig, self.model);
      if (this.parsedConfig.sizeX && this.parsedConfig.sizeY){
        self.setSizeMode('absolute','absolute');
        self.setAbsoluteSize(transformer.initialSize[0], transformer.initialSize[1]);
      }
      if (this.config.animation && this.parsedConfig.numFrames){
        self.setProportionalSize(1 , this.parsedConfig.numFrames);
      }
      self.setPosition(transformer.initialPosition[0], transformer.initialPosition[1], transformer.initialPosition[2]);
      self.setOrigin(transformer.initialOrigin[0], transformer.initialOrigin[1], transformer.initialOrigin[2]);
      self.setScale(transformer.initialScale[0], transformer.initialScale[1], transformer.initialScale[2]);
      self.setOpacity(transformer.initialOpacity);

      self.transformComponentID = transformer.createComponent(self);
      self.requestUpdate(self.transformComponentID);

      var ElementType;
      switch (self.config.surfaceType) {
          case 'highlight':
              ElementType = HighlightingText;
              break;
          case 'plain':
              ElementType = PlainText;
              break;
          case 'repeatingImage':
              ElementType = RepeatingImage;
              break;
          case 'singalong':
              ElementType = SingalongText;
              break;
          default:
              ElementType = Image;
      }
      this.domElement = new ElementType(this, this.config, this.model);
  }

  function PopupNode(config, model) {
      Node.apply(this, arguments);
      this.config = config;
      this.model = model;
      _createPopup.call(this);
      this.contentInserted = function() {
        this.domElement.contentInserted();
      };
  }

  PopupNode.prototype = Object.create(Node.prototype);
  PopupNode.prototype.constructor = PopupNode;

  module.exports = PopupNode;
});
