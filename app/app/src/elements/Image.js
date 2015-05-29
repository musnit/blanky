/*** Image.js ***/

define(function(require, exports, module) {
    var Famous = require('famous');
    var Element = require('elements/Element');

    function Image(node, config) {
      var options = {
        attributes: {},
        properties: {}
      };
      options.tagName = 'img';
      options.attributes = {
        'src': config.url
      };

      Element.apply(this, [node, options, config]);
    }

    Image.prototype = Object.create(Element.prototype);
    Image.prototype.constructor = Image;
    Image.DEFAULT_OPTIONS = {};

    module.exports = Image;
});
