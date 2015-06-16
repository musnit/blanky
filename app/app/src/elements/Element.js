/*** Element.js ***/

define(function(require, exports, module) {
    var Famous = require('famous');
    var DOMElement = Famous.domRenderables.DOMElement;

    function Element(node, options, config) {
      this.config = config;
      var extraClasses = (config.surfaceClasses || '').trim();
      extraClasses = (extraClasses + ' ' + (options.myClasses || '')).trim();
      if (extraClasses && extraClasses !== ''){
        options.classes = extraClasses.split(' ');
      }
      DOMElement.apply(this, [node, options]);
    }

    Element.prototype = Object.create(DOMElement.prototype);
    Element.prototype.constructor = Element;
    Element.DEFAULT_OPTIONS = {};
    Element.prototype.contentInserted = function() {};
    Element.prototype.setParsedConfig = function(config) {
      this.config = config;
    };

    module.exports = Element;
});
