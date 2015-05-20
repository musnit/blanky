define(function(require, exports, module) {

    function FamousHacks() {
    }

    FamousHacks.prototype.constructor = FamousHacks;

    function _formatCSSTransform(m) {
        var deviceWidth = window.orientation === 0 ? window.screen.width : window.screen.height;
        var deviceHeight = window.orientation === 0 ? window.screen.height : window.screen.width;
        // iOS returns available pixels, Android returns pixels / pixel ratio
        // http://www.quirksmode.org/blog/archives/2012/07/more_about_devi.html
        if (navigator.userAgent.indexOf('Android') >= 0 && window.devicePixelRatio) {
          deviceWidth = deviceWidth / window.devicePixelRatio;
          deviceHeight = deviceHeight / window.devicePixelRatio;
        }
        m[12] = Math.round(m[12] * deviceWidth) / deviceWidth;
        m[13] = Math.round(m[13] * deviceHeight) / deviceHeight;

        var result = 'matrix3d(';
        for (var i = 0; i < 15; i++) {
            result += (m[i] < 0.000001 && m[i] > -0.000001) ? '0,' : m[i] + ',';
        }
        result += m[15] + ')';
        return result;
    }

    module.exports = FamousHacks;
});
