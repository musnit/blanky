/*** RepeatingImage.js ***/

define(function(require, exports, module) {
    var Famous = require('famous');
    var Element = require('elements/Element');

    function RepeatingImage(node, config) {
      var options = {
        attributes: {},
        properties: {}
      };
      classes = 'repeating-image';
      options.tagName = 'div';
      options.attributes = {
        'class': classes
      };
      options.properties = {
        'background-image': 'url(\''+ config.url +'\')'
      };

      Element.apply(this, [node, options, config]);
    }

    RepeatingImage.prototype = Object.create(Element.prototype);
    RepeatingImage.prototype.constructor = RepeatingImage;
    RepeatingImage.DEFAULT_OPTIONS = {};

    module.exports = RepeatingImage;
});
