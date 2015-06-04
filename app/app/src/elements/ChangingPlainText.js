/*** ChangingPlainText.js ***/

define(function(require, exports, module) {
    var Element = require('elements/Element');
    var MathFunctions = require('helpers/MathFunctions');

    function ChangingPlainText(node, config, model) {
      var self = this;
      var options = {
        attributes: {},
        properties: {}
      };
      this.timeKeeper = node.timeKeeper;
      this.textLines = (config.text || '').split('\n');
      this.linesHtml = this.textLines.map(function(textLine) {
        var html = '<div class="highlight-text gradient-shadow" title="' +
                 textLine + '"><div class="highlight-text-div hightlight-inactive">' +
                 textLine +
                 '</div></div>';
        return html;
      });
      options.tagName = 'div';
      options.myClasses = 'overlay-text';
      this.currentLine = 0;
      options.content = this.linesHtml[0];
      Element.apply(this, [node, options, config]);

      this.updaterComponent = {
          onUpdate: function(time) {
            var timePassed = self.timeKeeper.timePassed;
            var timeOffset = parseFloat(config.timeOffset);
            var pageSpeed = parseFloat(model.page.speed) || 1;
            var singSpeed = (parseFloat(config.singSpeed) || 1) * pageSpeed;
            var lineNumber = Math.floor(MathFunctions.prototype.sawToothFunction((timePassed+timeOffset)/singSpeed, self.textLines.length));
            if (lineNumber !== self.currentLine){
              self.currentLine = lineNumber;
              self.setContent(self.linesHtml[self.currentLine]);
            }
            node.requestUpdate(this.id);
          }
      };
      this.updaterComponentID = node.addComponent(this.updaterComponent);
      this.updaterComponent.id = this.updaterComponentID;
      node.requestUpdate(this.updaterComponentID);
    }

    ChangingPlainText.prototype = Object.create(Element.prototype);
    ChangingPlainText.prototype.constructor = ChangingPlainText;
    ChangingPlainText.DEFAULT_OPTIONS = {};

    module.exports = ChangingPlainText;
});
