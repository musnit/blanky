/*** PageView.js ***/

define(function(require, exports, module) {
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var Modifier        = require('famous/core/Modifier');
    var ImageSurface    = require('famous/surfaces/ImageSurface');

    function PageView() {
        View.apply(this, arguments);

        _createLogo.call(this);
    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.DEFAULT_OPTIONS = {
    };

    function _createLogo() {
        var logo = new ImageSurface({
            size: [undefined, undefined],
            content: '/content/images/famous_logo.png',
            classes: ['backfaceVisibility']
        });

        var initialTime = Date.now();
        var centerSpinModifier = new Modifier({
            origin: [0.5, 0.5],
            transform : function() {
                return Transform.rotateY(.002 * (Date.now() - initialTime));
            }
        });

        this.add(centerSpinModifier).add(logo);
        window.loo=logo;
    }

    module.exports = PageView;
});