define(function(require, exports, module) {
    var Modifier                = require('famous/core/Modifier');
    var View                    = require('famous/core/View');

    var PageViews = [];
    PageViews.push(require('views/Page16View'));
    PageViews.push(require('views/Page19View'));

    function _createPages() {
        var x;

        this.pages = [];
        this.mods = [];
        this.currentPageIndex = 0;
        var self = this;
        PageViews.forEach(function(PageView) {
            self.pages.push(new PageView());
        });

        var zIndex = this.pages.length;

        function emitNextPageEvent() {
            this._eventOutput.emit('nextPage');
        }

        function rotatePreviousEvent(data) {
            if (this.currentPageIndex > 0)
                this.pages[this.currentPageIndex - 1].rotate(-data.radians);
        }

        function touchEndPreviousEvent(data) {
            if (this.currentPageIndex > 0) {
                this.pages[this.currentPageIndex - 1]._eventOutput.emit('end', data);
                this._eventOutput.emit('prevPage');
            }
        }

        for (x = 0; x < this.pages.length; x += 1) {
            this.mods.push(new Modifier({
                origin: [0, 0]
            }));

            this._add(this.mods[x]).add(this.pages[x]);

            this.pages[x].on('nextPage', emitNextPageEvent.bind(this));

            // Gets event from slide transfers rotation to previous slide.
            this.pages[x].on('rotatePrevious', rotatePreviousEvent.bind(this));

            // Determines whether the previous slide will become current page or not
            this.pages[x].on('touchEndPrevious', touchEndPreviousEvent.bind(this));

            // Sets the zIndex so the page are stacked properly
            this.pages[x].setZIndex(zIndex);
            zIndex--;

            // Last flag disables page from turning.
            if (x === this.pages.length - 1)
                this.pages[x].setOptions({
                    last: true,
                    classes: ['page', 'last']
                });
        }

        /**
         * Event handler for a nextPage event. Increments pageIndex
         * @return {[type]} [description]
         */
        this.on('nextPage', function() {
            if (this.currentPageIndex < this.pages.length - 1)
                this.currentPageIndex++;
        }.bind(this));

        /**
         * Event handler for a prevPage event. Increments pageIndex
         * @return {[type]} [description]
         */
        this.on('prevPage', function() {
            if (this.currentPageIndex > 0)
                this.currentPageIndex--;
        }.bind(this));
    }

    function ContentView() {
        View.apply(this, arguments);
        _createPages.call(this);
    }

    /**
     * Manually triggers next page
     * @return {[type]} [description]
     */
    ContentView.prototype.nextPage = function() {
        if (this.currentPageIndex < this.pages.length - 1) {
            this.pages[this.currentPageIndex].turn();
            this._eventOutput.emit('nextPage');
        }
        else
            this.pages[this.currentPageIndex].hop();
    };

    ContentView.prototype = Object.create(View.prototype);
    ContentView.prototype.constructor = ContentView;

    ContentView.DEFAULT_OPTIONS = {};

    /**
     * Manually triggers previous page
     * @return {[type]} [description]
     */
    ContentView.prototype.prevPage = function() {
        if (this.currentPageIndex > 0) {
            this._eventOutput.emit('prevPage');
            this.pages[this.currentPageIndex].turnBack();
        }
    };

    module.exports = ContentView;
});
