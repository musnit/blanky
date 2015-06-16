/*** OneLineRunOn.js ***/

define(function(require, exports, module) {
    var Element = require('elements/Element');
    var MathFunctions = require('helpers/MathFunctions');
    var RepeatingImage = require('elements/RepeatingImage');

    function OneLineRunOn(node, config, model) {
      var self = this;
      this.config = config;
      var options = {
        attributes: {},
        properties: {}
      };
      this.timeKeeper = node.timeKeeper;
      Element.apply(this, [node, {myClasses: 'runon-background'}, config]);

      options.tagName = 'div';
      options.myClasses = 'runon-text';
      options.content = '<div class="highlight-text gradient-shadow" title="' +
                 config.text + '"><div class="highlight-text-div hightlight-inactive">' +
                 config.text +
                 '</div></div>';

      this.textChildNode = node.addChild();
      this.textChildNode.setPosition(0, 0, 2);
      this.textChildNode.setAlign(0, 0.5);
      this.textChildNode.setMountPoint(0, 0.5);
      this.textChildNode.domElement = new Element(this.textChildNode, options, config);
      this.textChildNode.updaterComponent = {
          onUpdate: function(time) {
            var sizeX = self.textChildNode.getComputedValue().computedValues.size[0];
            var timePassed = self.timeKeeper.timePassed;
            var xPosition = -MathFunctions.prototype.sawToothFunction((timePassed+self.config.timeOffset)/self.config.singSpeed, sizeX - self.config.sizeX);
            self.textChildNode.setPosition(xPosition, 0, 2);
            self.textChildNode.requestUpdate(this.id);
          }
      };
      this.textChildNode.updaterComponentID = this.textChildNode.addComponent(this.textChildNode.updaterComponent);
      this.textChildNode.updaterComponent.id = this.textChildNode.updaterComponentID;
      this.textChildNode.requestUpdate(this.textChildNode.updaterComponentID);
      this.textChildNode.setSizeMode('render','render');
      this.textChildNode.setOpacity(1);

      this.backgroundChildNode = node.addChild();
      this.backgroundChildNode.setPosition(0, 0, 0);
      this.backgroundChildNode.setOpacity(0.85);
      this.backgroundChildNode.domElement = new RepeatingImage(this.backgroundChildNode, config);
      this.backgroundChildNode.domElement = new RepeatingImage(this.backgroundChildNode, config);
    }

    OneLineRunOn.prototype = Object.create(Element.prototype);
    OneLineRunOn.prototype.constructor = OneLineRunOn;
    OneLineRunOn.DEFAULT_OPTIONS = {};

    module.exports = OneLineRunOn;
});
