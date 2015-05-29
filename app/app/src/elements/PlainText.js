/*** PlainText.js ***/

define(function(require, exports, module) {
    var Famous = require('famous');
    var Element = require('elements/Element');

    function PlainText(node, config) {
      var options = {
        attributes: {},
        properties: {}
      };

      var textLines = config.text.split('\n');
      var linesHtml = textLines.map(function(textLine) {
        var html = '<div class="highlight-text gradient-shadow" title="' +
                 textLine + '"><div class="highlight-text-div hightlight-inactive">' +
                 textLine +
                 '</div></div>';
        return html;
      });
      var classes = 'overlay-text';
      options.tagName = 'div';
      options.attributes = {
        'class': classes
      };
      options.content = linesHtml.join('');
      Element.apply(this, [node, options, config]);
    }

    PlainText.prototype = Object.create(Element.prototype);
    PlainText.prototype.constructor = PlainText;
    PlainText.DEFAULT_OPTIONS = {};

    module.exports = PlainText;
});
