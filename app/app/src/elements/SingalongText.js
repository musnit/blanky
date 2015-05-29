/*** SingalongText.js ***/

define(function(require, exports, module) {
    var Element = require('elements/Element');
    var MathFunctions = require('helpers/MathFunctions');

    function SingalongText(node, config, model) {
      var self = this;
      this.config = config;
      this.model = model;

      var options = {
        attributes: {},
        properties: {}
      };
      this.textLines = config.text.split('\n');
      this.currentLine = 0;
      options.tagName = 'div';
      options.myClasses = 'overlay-text';
      options.content = '<span class="highlight-text gradient-shadow singalong" title="' +
                   this.textLines[this.currentLine] + '"><div class="highlight-text-div">' +
                   this.textLines[this.currentLine] +
                   '</div></span>';
      Element.apply(this, [node, options, config]);

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

    SingalongText.prototype = Object.create(Element.prototype);
    SingalongText.prototype.constructor = SingalongText;
    SingalongText.DEFAULT_OPTIONS = {};

    SingalongText.prototype.updateSingalongText = function() {
        var timePassed = parseFloat(Date.now());
        var timeOffset = parseFloat(this.config.timeOffset);
        var pageSpeed = parseFloat(this.model.page.speed) || 1;
        var singSpeed = (parseFloat(this.config.singSpeed) || 1) * pageSpeed;
        var lineNumber = Math.floor(MathFunctions.prototype.sawToothFunction((timePassed+timeOffset)/singSpeed, this.textLines.length));
        if (lineNumber !== this.currentLine){
            this.currentLine = lineNumber;
            this.surface.setContent(
                '<div class="overlay-text">' +
                '<span class="highlight-text gradient-shadow singalong" title="' +
                this.textLines[this.currentLine] + '"><div class="highlight-text-div">' +
                this.textLines[this.currentLine] +
                '</div></span></div>'
            );
            this.needsUpdating = true;
        }
    };
    SingalongText.prototype.updateContent = function() {
      if (this.surface._currentTarget){
        this.refreshGradient();
        this.needsUpdating = false;
      }
    };

    SingalongText.prototype.refreshGradient = function() {
      var gradientCSS = this.setupGradientCSS(0);
      var text = self.surface._currentTarget.getElementsByClassName('highlight-text-div')[0];
      text.setAttribute('style', gradientCSS);
    };
    SingalongText.prototype.setupGradientCSS = function(index) {
      var text = self.surface._currentTarget.getElementsByClassName('highlight-text-div')[index];
      var width = text.getBoundingClientRect().width;
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
    SingalongText.prototype.contentInserted = function() {
      self.needsUpdating = true;
      this.updateContent();
    };

    module.exports = SingalongText;
});
