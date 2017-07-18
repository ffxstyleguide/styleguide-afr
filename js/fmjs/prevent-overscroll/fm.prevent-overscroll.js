define(['jquery', 'fmjs/fm.plugin', 'fmjs/prevent-overscroll/fm.prevent-overscroll'], function ($) {
    var pluginName = 'fm-prevent-overscroll';
    /**
     * Create the prevent-overscroll plugin.
     * <p>Prevent scroll transferring to the body when the focused item's scroll top/bottom is reached.
     * This is achieved by measuring the item's current scroll position and never letting it reach its
     * min/max position, which would have otherwise caused the scroll to then be transferred to the document body.</p>
     *
     * @module FMPreventOverscroll
     * @augments FMPlugin
     * @example $('.nav--primary').fmPreventOverscroll();
     */
    $.FMPlugin.createPlugin({
        /**
         * Name to identify this plugin.
         *
         * @default 'fm-prevent-overscroll'
         */
        name: pluginName,
        /**
         * Default settings for the plugin.
         */
        defaultOptions: {
        },
        /**
         * Set up prevent overscroll.
         *
         * @private
         * @param {jQuery} elem The current element.
         * @param {object} inst The current instance settings.
         */
        _postAttach: function (elem, inst) {
            elem.on('touchstart.' + inst.name, function () {
                var top = this.scrollTop;
                var totalScroll = this.scrollHeight;
                var currentScroll = top + this.offsetHeight;
                if (top === 0) {
                    this.scrollTop = 1;
                } else if (currentScroll === totalScroll) {
                    this.scrollTop = top - 1;
                }
            });
        },
        /**
         * Remove prevent overscroll setup.
         *
         * @private
         * @param {jQuery} elem The current element.
         * @param {object} inst The current instance settings.
         */
        _preDestroy: function (elem, inst) { // jshint unused:false
            elem.off('.' + this.name);
        }
    });
});
