define(['jquery', 'fmjs/fm.plugin'], function ($) {

    var pluginName = 'fm-tabs';

    /**
     * Create the tabs plugin.
     * <p>Implements a tab interface, showing only one content area in response to user interaction with a set of header
     * links.</p>
     * <p>Expects HTML like:</p>
     * <pre>
     *   &lt;section class="tabs fm-tabs" data-fm-tabs="option:'value'"&gt;
     *     &lt;nav class="nav tab__nav fm-tabs-nav"&gt;
     *       &lt;ul&gt;
     *         &lt;li class="is-selected"&gt;&lt;a href="#tab-1 tabindex="0"&gt;Tab 1&lt;/a&gt;
     *         &lt;li&gt;&lt;a href="#tab-2 tabindex="2"&gt;Tab 2&lt;/a&gt;
     *         ...
     *       &lt;/ul&gt;
     *     &lt;/nav&gt;
     *     &lt;div class="tab__content"&gt;
     *       &lt;div id="tab-1" class="tab__panel is-selected fm-tabs-content"&gt&lt;/div&gt;
     *       &lt;div id="tab-2" class="tab__panel fm-tabs-content"&gt&lt;/div&gt;
     *       ...
     *     &lt;/div&gt;
     *   &lt;/section&gt;
     * </pre>
     * <h3>Fires:</h3>
     * <ul>
     * <li><a href="global.html#event:FMTabs:fm-tabs-postSwap">FMTabs:fm-tabs-postSwap</a></li>
     * <li><a href="global.html#event:FMTabs:fm-tabs-preSwap">FMTabs:fm-tabs-preSwap</a></li>
     * </ul>
     *
     * @module FMTabs
     * @augments FMPlugin
     * @example $('.fm-tabs').fmTabs();
     */
    $.FMPlugin.createPlugin({

        /**
         * Name to identify this plugin.
         *
         * @default 'fm-tabs'
         */
        name: pluginName,

        contentSelector: '.' + pluginName + '-content',
        navigationSelector: '.' + pluginName + '-nav a',

        /**
         * Default settings for the plugin.
         *
         * @property {string} [disabledClass='disabled'] The class for the disabling of the plugin.
         * @property {string} [selectedClass='is-selected'] The class for the selected tab link.
         * @property {string} [tabNavSelector='.tab__nav'] The selector for the tab navigation.
         * @property {string} [tabPanelSelector='.tab__panel'] The selector for the tab panels.
         * @property {string} [triggers='click'] The space-separated list of triggering events.
         */
        defaultOptions: {
            // TODO: Determine what the correct class should be here for disabling
            disabledClass: 'disabled',
            selectedClass: 'is-selected',
            tabNavSelector: '.tab__nav',
            tabPanelSelector: '.tab__panel',
            triggers: 'click'
        },

        /**
         * Cache of useful elements.
         *
         * @private
         * @param {jQuery} elem The current element.
         * @param {object} options The current options.
         * @returns {object} Any additional settings.
         */
        _instSettings: function (elem, options) { // jshint unused:false
            var self = this;
            return {
                contents: elem.find(this.contentSelector).filter(function () {
                    return $(this).parentsUntil(elem, self.contentSelector).length === 0;
                }),
                links: elem.find(this.navigationSelector).filter(function () {
                    return $(this).parentsUntil(elem, self.contentSelector).length === 0;
                })
            };
        },

        /**
         * Set up tab selection based on triggers setting.
         *
         * @private
         * @param {jQuery} elem The current element.
         * @param {object} inst The current instance settings.
         */
        _postAttach: function (elem, inst) {
            var self = this;
            // Set up behaviours
            $.each(inst.options.triggers.split(' '), function (index, trigger) {
                elem.on(trigger + '.' + self.name, self.navigationSelector, {inst: inst}, self._selectTab);
            });
            elem.on('keydown.' + self.name, self.navigationSelector, {inst: inst, self: self}, self._keySelectTab);
            // Initialise aria attributes
            elem.find(inst.options.tabPanelSelector).attr('aria-hidden', 'true');
            // Trigger initial tab
            var selected = inst.links.closest('li').filter('.' + inst.options.selectedClass).find('a');
            if (!selected.length) {
                selected = inst.links.first();
            }
            this._selectTab.apply(selected[0], [
                {data: {inst: inst}}
            ]);
        },

        /**
         * Disable all tabs.
         *
         * @param {Element} elem The current element.
         * @example $(selector).fmTabs('disable');
         */
        disable: function (elem) {
            this._enableDisable(elem, true);
        },

        /**
         * Enable all tabs.
         *
         * @param {Element} elem The current element.
         * @example $(selector).fmTabs('enable');
         */
        enable: function (elem) {
            this._enableDisable(elem, false);
        },

        /**
         * Enable/Disable all tabs.
         *
         * @private
         * @param {Element} elem The current element.
         * @param {boolean} disabled <code>true</code> if all tabs should be disabled;
         *      <code>false</code> if all tabs should be enabled.
         */
        _enableDisable: function (elem, disabled) {
            var inst = this._getInst(elem);
            inst.disabled = disabled;
            $(elem).toggleClass(inst.options.disabledClass, disabled);
        },

        /**
         * Navigate to a specific tab.
         *
         * @private
         * @param {Event} e The triggering event.
         */
        _keySelectTab: function (e) {
            var tab = $(this);
            var self = e.data.self;
            var inst = e.data.inst;
            // Check if disabled and check if keydown occurred on current instance
            if (!inst.disabled && inst.links.is(document.activeElement)) {
                var selected;
                // Left arrow key
                if (e.keyCode === 37) {
                    selected = tab.closest('li').prev().find('a');
                    if (!selected.length) {
                        selected = inst.links.last();
                    }
                    // Right arrow key
                } else if (e.keyCode === 39) {
                    selected = tab.closest('li').next().find('a');
                    if (!selected.length) {
                        selected = inst.links.first();
                    }
                }
                if (selected) {
                    selected.focus();
                    self._selectTab.apply(selected[0], [
                        {data: {inst: inst}}
                    ]);
                }
            }
        },

        /**
         * Activate a specific tab.
         *
         * @private
         * @param {Event} e The triggering event.
         * @return {boolean} <code>false</code> to prevent the default behaviour.
         * @fires FMTabs:fm-tabs-preSwap
         * @fires FMTabs:fm-tabs-postSwap
         */
        _selectTab: function (e) {
            var tab = $(this);
            var inst = e.data.inst;
            // Check if disabled
            if (inst.disabled) {
                return false;
            }
            var content = $(tab.attr('href'));
            // Before change callback
            inst.elem.trigger(inst.name + '-preSwap', [content[0]]);
            // Swap tabs
            inst.contents.removeClass(inst.options.selectedClass).attr({'aria-hidden': 'true'});
            content.addClass(inst.options.selectedClass).attr({'aria-hidden': 'false'});
            inst.links.closest('li').removeClass(inst.options.selectedClass);
            inst.links.attr({'aria-selected': 'false', tabindex: '-1'});
            tab.closest('li').addClass(inst.options.selectedClass);
            tab.attr({'aria-selected': 'true', tabindex: '0'});
            // After change callback
            var remote = tab.data(inst.name + '-remote');
            if (remote) {
                // Load remote content
                content.load(remote, function (response, status, xhr) {
                    if (status === 'error') {
                        tab.data(inst.name + '-remote', xhr.status + ' ' + xhr.statusText);
                    } else {
                        tab.data(inst.name + '-remote', '');
                    }
                    inst.elem.trigger(inst.name + '-postSwap', [content[0]]);
                });
            } else {
                inst.elem.trigger(inst.name + '-postSwap', [content[0]]);
            }
            return false;
        },

        /**
         * Remove tab setup.
         *
         * @private
         * @param {jQuery} elem The current element.
         * @param {object} inst The current instance settings.
         */
        _preDestroy: function (elem, inst) {
            elem.off('.' + this.name, this.navigationSelector);
            inst.links.attr({tabindex: '-1'}).removeAttr('role aria-selected');
            inst.links.closest('li').removeClass(inst.options.selectedClass);
            inst.contents.removeClass(inst.options.selectedClass);
            elem.find(inst.options.tabPanelSelector).removeAttr('role aria-hidden');
        }

        /**
         * @event FMTabs:fm-tabs-preSwap
         * @desc Before the tab has changed.
         * @this element
         * @param {Event} event The triggering event.
         * @param {Element} tab The new tab.
         */
        /**
         * @event FMTabs:fm-tabs-postSwap
         * @desc After the tab has changed.
         * @this element
         * @param {Event} event The triggering event.
         * @param {Element} tab The new tab.
         */
    });

});