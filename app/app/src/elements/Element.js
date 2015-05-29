/*** Element.js ***/

define(function(require, exports, module) {
    var Famous = require('famous');
    var DOMElement = Famous.domRenderables.DOMElement;

    function Element(node, options, config) {

      options['attributes']['class'] = options['attributes']['class'] || "";
      var extraClasses = (config.surfaceClasses || '').trim();
      options['attributes']['class'] = (options['attributes']['class'] + ' ' + extraClasses).trim();

      DOMElement.apply(this, [node, options]);

    }

    Element.prototype = Object.create(DOMElement.prototype);
    Element.prototype.constructor = Element;
    Element.DEFAULT_OPTIONS = {};
    Element.prototype.contentInserted = function() {};

    module.exports = Element;
});
