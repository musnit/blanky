define(function(require, exports, module) {
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var ParameterTransformer = require('helpers/ParameterTransformer');
    var Modifier = require('famous/core/Modifier');
    var MathFunctions = require('helpers/MathFunctions');

    function _createPopup() {
        var self = this;
        var transformer = new ParameterTransformer(self.config, self.model);
        this.modifier = new Modifier({
            origin: function() {
                var originX = parseFloat(self.config.xOrigin) || 0;
                var originY = parseFloat(self.config.yOrigin) || 0;
                return [originX,originY];
            },
            transform: function() {
                if (self.needsUpdating){
                    self.updateContent();
                }
                if (self.config.surfaceType === 'singalong'){
                    self.updateSingalongText();
                }
                else if (self.config.surfaceType === 'highlight'){
                    self.updateHighlightText();
                }
                var transform = transformer.calculateTransform();
                return transform;
            },
            opacity: function() {
                return parseFloat(self.config.opacity) || 1;
            },
            align: [0,0]
        });

        var sizeX = this.model.page.x;
        var sizeY = this.model.page.y;
        if (this.config.animation && this.config.numFrames){
            sizeY = this.model.page.y*this.config.numFrames;
        }
        else if (this.config.sizeX && this.config.sizeY){
            sizeX = parseFloat(this.config.sizeX);
            sizeY = parseFloat(this.config.sizeY);
        }

        var SurfaceType = Surface;
        var content;
        var size = [sizeX, sizeY];

        if (this.config.surfaceType === 'plain'){
            content = '<div class="overlay-text">' + this.config.text + '</div>';
        }
        else if (this.config.surfaceType === 'repeatingImage'){
            content = '<div class="repeating-image"></div>';
        }
        else if (this.config.surfaceType === 'singalong'){
            this.textLines = this.config.text.split('\n');
            this.currentLine = 0;
            content = '<div class="overlay-text">' +
                         '<span class="highlight-text gradient-shadow singalong" title="' +
                         this.textLines[this.currentLine] + '"><div class="highlight-text-div">' +
                         this.textLines[this.currentLine] +
                         '</div></span></div>';
        }
        else if (this.config.surfaceType === 'highlight'){
            this.textLines = this.config.text.split('\n');
            this.currentLine = 0;
            this.linesHtml = this.textLines.map(function(textLine) {
                var html = '<span class="highlight-text gradient-shadow" title="' +
                         textLine + '"><div class="highlight-text-div hightlight-inactive">' +
                         textLine +
                         '</div></span>';
                return html;
            });
            content = '<div class="overlay-text">' +
                         this.linesHtml.join('') +
                         '</div>';
        }
        else if (this.config.surfaceType === 'transparency'){
            content = '<div class="overlay-text overlay-transparency"></div>';
        }
        else {
            SurfaceType = ImageSurface;
            content = this.config.url;
        }

        var classes;
        if (this.config.surfaceClasses){
            classes = this.config.surfaceClasses.split(' ');
        }
        else {
            classes = [];
        }
        this.surface = new SurfaceType({
            content: content,
            size: size,
            classes: classes
        });
        this._add(this.modifier).add(this.surface);

    }

    function PopupView(config, model) {
        View.apply(this, arguments);
        this.config = config;
        this.model = model;
        _createPopup.call(this);
        var self = this;
        this.contentInserted = function() {
            self.needsUpdating = true;
            this.updateContent();
        };
        this.updateContent = function() {
            if (self.config.surfaceType === 'singalong' && self.surface._currentTarget){
              self.refreshGradient(0);
              self.needsUpdating = false;
            }
            else if (self.config.surfaceType === 'highlight' && self.surface._currentTarget){
              self.clearGradients();
              self.refreshGradient(self.currentLine);
              self.needsUpdating = false;
            }
            else if (self.config.surfaceType === 'repeatingImage' && self.surface._currentTarget){
              self.updateBackground();
              self.needsUpdating = false;
            }
        };
        this.updateSingalongText = function() {
            var timePassed = parseFloat(Date.now());
            var timeOffset = parseFloat(self.config.timeOffset);
            var pageSpeed = parseFloat(self.model.page.speed) || 1;
            var singSpeed = (parseFloat(self.config.singSpeed) || 1) * pageSpeed;
            var lineNumber = Math.floor(MathFunctions.prototype.sawToothFunction((timePassed+timeOffset)/singSpeed, self.textLines.length));
            if (lineNumber !== self.currentLine){
                self.currentLine = lineNumber;
                self.surface.setContent(
                    '<div class="overlay-text">' +
                    '<span class="highlight-text gradient-shadow singalong" title="' +
                    self.textLines[self.currentLine] + '"><div class="highlight-text-div">' +
                    self.textLines[self.currentLine] +
                    '</div></span></div>'
                );
                self.needsUpdating = true;
            }
        };
        this.updateHighlightText = function() {
            var timePassed = parseFloat(Date.now());
            var timeOffset = parseFloat(self.config.timeOffset);
            var pageSpeed = parseFloat(self.model.page.speed) || 1;
            var singSpeed = (parseFloat(self.config.singSpeed) || 1) * pageSpeed;
            var lineNumber = Math.floor(MathFunctions.prototype.sawToothFunction((timePassed+timeOffset)/singSpeed, self.textLines.length));
            if (lineNumber !== self.currentLine){
                self.currentLine = lineNumber;
                self.needsUpdating = true;
            }
        };
        this.updateBackground = function() {
            var bg = self.surface._currentTarget.getElementsByClassName('repeating-image')[0];
            bg.setAttribute('style', 'background-image:url("'+ self.config.url +'");');
        };
        this.refreshGradient = function(index) {
              var text = self.surface._currentTarget.getElementsByClassName('highlight-text-div')[index];
              var width = text.getBoundingClientRect().width;
              var redStart = width + 80;
              var redEnd = redStart + 80;
              var blackAgain = redEnd + 80;
              var end = width*2 + 240;
              var duration = width/270;
              text.setAttribute('style',
                'background-size: '+ end + 'px 3px;' +
                'background-image: -webkit-linear-gradient(left, ' +
                                  'white 0px,' +
                                  'white ' + width + 'px,' +
                                  'rgb(53, 205, 247) ' + redStart + 'px,' +
                                  'rgb(53, 205, 247) ' + redEnd + 'px,' +
                                  'white ' + blackAgain + 'px);' +
                '-webkit-animation: stripes '+ duration +'s linear infinite;'
              );
        };
        this.clearGradients = function() {
          var texts = self.surface._currentTarget.getElementsByClassName('highlight-text-div');
          var textsArray = Array.prototype.slice.call(texts);
          textsArray.forEach(function(text) {
            text.setAttribute('style',
            'background-size: 100% 100%;' +
            'background-image: -webkit-linear-gradient(' +
                              'white 0%,' +
                              'white 100%);'
            );
          });
        };
    }

    PopupView.prototype = Object.create(View.prototype);
    PopupView.prototype.constructor = PopupView;

    module.exports = PopupView;
});
