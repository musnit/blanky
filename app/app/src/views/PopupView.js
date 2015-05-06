define(function(require, exports, module) {
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var ParamaterTransformer = require('helpers/ParamaterTransformer');
    var Modifier = require('famous/core/Modifier');

    function _createPopup() {
        var self = this;
        this.modifier = new Modifier({
            origin: function() {
                var originX = self.config.xOrigin || 0;
                var originY = self.config.yOrigin || 0;
                return [originX,originY];
            },
            transform: function() {
                var timePassed = parseFloat(Date.now());
                var timeOffset = parseFloat(self.config.timeOffset);
                var pageSpeed = parseFloat(self.model.page.speed) || 1;
                var singSpeed = (parseFloat(self.config.singSpeed) || 1) * pageSpeed;
                if (self.needsUpdating && self.surface._currTarget){
                        self.contentInserted();
                        self.needsUpdating = false;
                }
                if (self.config.surfaceType === 'singalong'){
                    var lineNumber = Math.floor(ParamaterTransformer.prototype.sawToothFunction((timePassed+timeOffset)/singSpeed, self.textLines.length));
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
                }
                var transformer = new ParamaterTransformer(self.config, self.model);
                var transform = transformer.calculateTransform();
                return transform;
            },
            align: [0,0]
        });

        var sizeY;
        if (this.config.animation && this.config.numFrames){
            sizeY = this.model.page.y*this.config.numFrames;
        }
        else {
            sizeY = this.model.page.y;
        }

        if (this.config.surfaceType === 'plain'){
            this.surface = new Surface({
                content: '<div class="overlay-text">' + this.config.text + '</div>',
                size: [this.model.page.x, sizeY]
            });
        }
        else if (this.config.surfaceType === 'highlight'){
            this.surface = new Surface({
                content: '<div class="overlay-text"><span class="highlight-text">' + this.config.text + '</span></div>',
                size: [this.model.page.x, sizeY]
            });
        }
        else if (this.config.surfaceType === 'singalong'){
            this.textLines = this.config.text.split('\n');
            this.currentLine = 0;
            this.surface = new Surface({
                content: '<div class="overlay-text">' +
                         '<span class="highlight-text gradient-shadow singalong" title="' +
                         this.textLines[this.currentLine] + '"><div class="highlight-text-div">' +
                         this.textLines[this.currentLine] +
                         '</div></span></div>',
                size: [this.model.page.x, sizeY]
            });
        }
        else if (this.config.surfaceType === 'transparency'){
            this.surface = new Surface({
                content: '<div class="overlay-text overlay-transparency"></div>',
                size: [this.model.page.x, sizeY]
            });
        }
        else {
            this.surface = new ImageSurface({
                size: [this.model.page.x, sizeY],
                content: this.config.url
            });
        }

        this._add(this.modifier).add(this.surface);

    }

    function PopupView(config, model) {
        View.apply(this, arguments);
        this.config = config;
        this.model = model;
        _createPopup.call(this);
        var self = this;
        this.contentInserted = function() {
            if (self.config.surfaceType === 'highlight' || self.config.surfaceType === 'singalong'){
              var text = self.surface._currTarget.getElementsByClassName('highlight-text-div')[0];
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
              self.needsUpdating = false;
            }
        };
    }

    PopupView.prototype = Object.create(View.prototype);
    PopupView.prototype.constructor = PopupView;

    module.exports = PopupView;
});
