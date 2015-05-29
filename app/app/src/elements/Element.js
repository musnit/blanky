/*** Element.js ***/

define(function(require, exports, module) {
    var Famous = require('famous');
    var DOMElement = Famous.domRenderables.DOMElement;

    function Element(node, options, config) {
      var self = this;
      var extraClasses = (config.surfaceClasses || '').trim();
      extraClasses = (extraClasses + ' ' + (options.myClasses || '')).trim();
      if(extraClasses && extraClasses !== ''){
        options.classes = extraClasses.split(' ');
      }
      DOMElement.apply(this, [node, options]);
    }

    Element.prototype = Object.create(DOMElement.prototype);
    Element.prototype.constructor = Element;
    Element.DEFAULT_OPTIONS = {};
    Element.prototype.contentInserted = function() {};

    module.exports = Element;
});
