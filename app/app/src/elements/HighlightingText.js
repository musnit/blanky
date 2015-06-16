/*** HighlightingText.js ***/

define(function(require, exports, module) {
    var Element = require('elements/Element');
    var MathFunctions = require('helpers/MathFunctions');

    function HighlightingText(node, config, model) {
      var self = this;
      this.config = config;
      this.model = model;
      this.node = node;
      var options = {
        attributes: {},
        properties: {}
      };

      this.textLines = this.config.text.split('\n');
      this.currentLine = 0;
      options.tagName = 'div';
      options.myClasses = 'overlay-text';
      options.content = this.createContent(-1);
      Element.apply(this, [node, options, this.config]);

      this.updaterComponent = {
          onUpdate: function(time) {
              if (self.needsUpdating){
                  self.updateContent();
              }
              self.updateHighlightText();
              node.requestUpdate(this.id);
          }
      };
      this.updaterComponentID = node.addComponent(this.updaterComponent);
      this.updaterComponent.id = this.updaterComponentID;
      node.requestUpdate(this.updaterComponentID);
    }

    HighlightingText.prototype = Object.create(Element.prototype);
    HighlightingText.prototype.constructor = HighlightingText;

    HighlightingText.prototype.updateHighlightText = function() {
      var timePassed = parseFloat(Date.now());
      var timeOffset = parseFloat(this.config.timeOffset);
      var pageSpeed = parseFloat(this.model.page.speed) || 1;
      var singSpeed = (parseFloat(this.config.singSpeed) || 1) * pageSpeed;
      var lineNumber = Math.floor(MathFunctions.prototype.sawToothFunction((timePassed+timeOffset)/singSpeed, this.textLines.length));
      if (lineNumber !== this.currentLine){
          this.currentLine = lineNumber;
          this.needsUpdating = true;
      }
    };
    HighlightingText.prototype.updateContent = function() {
      var content = this.createContent(this.currentLine);
      this.setContent(content);
      this.needsUpdating = false;
    };
    HighlightingText.prototype.setupGradientCSS = function() {
      var width = this.node.getAbsoluteSize()[0];
      var redStart = width + 80;
      var redEnd = redStart + 80;
      var blackAgain = redEnd + 80;
      var end = width*2 + 240;
      var duration = width/270;
      var gradientCSS = '-webkit-transform: translateZ(0);' +
                           'background-size: '+ end + 'px 3px;' +
                           'background-image: -webkit-linear-gradient(left, ' +
                                              'white 0px,' +
                                              'white ' + width + 'px,' +
                                              'rgb(53, 205, 247) ' + redStart + 'px,' +
                                              'rgb(53, 205, 247) ' + redEnd + 'px,' +
                                              'white ' + blackAgain + 'px);' +
                           '-webkit-animation: stripes '+ duration +'s linear infinite;';
      return gradientCSS;
    };
    HighlightingText.prototype.contentInserted = function() {
      self.needsUpdating = true;
      this.updateContent();
    };
    HighlightingText.prototype.createContent = function(activeLine) {
      var self = this;
      var linesHtml = this.textLines.map(function(textLine, index) {
        var html;
        if (index === activeLine){
          html = '<div class="highlight-text gradient-shadow" title="' +
                   textLine + '"><div class="highlight-text-div" style="' + self.setupGradientCSS() + '">' +
                   textLine +
                   '</div></div>';
        }
        else {
          html = '<div class="highlight-text gradient-shadow" title="' +
                   textLine + '"><div class="highlight-text-div hightlight-inactive">' +
                   textLine +
                   '</div></div>';
        }
        return html;
      });
      return linesHtml.join('');
    };

    HighlightingText.DEFAULT_OPTIONS = {};

    module.exports = HighlightingText;
});
