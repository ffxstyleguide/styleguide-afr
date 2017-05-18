define(['jquery', 'fmjs/fm.plugin'], function ($) {
    var pluginName = 'fm-toggle';
    /**
     * Create the toggle plugin.
     * <p>Implements the visibility toggling of associated HTML content when an appropriate button/link is clicked.</p>
     * <p>Expects HTML like:</p>
     * <pre>
     *     &lt;button class="icon--menu"&gt;Button&lt;/button&gt;
     *     &lt;div class="navigation-wrap"&gt;&lt;/div&gt;
     * </pre>
     * <h3>Fires:</h3>
     * <ul>
     * <li><a href="global.html#event:FMToggle:fm-toggle-postToggle">FMToggle:fm-toggle-postToggle</a></li>
     * <li><a href="global.html#event:FMToggle:fm-toggle-preToggle">FMToggle:fm-toggle-preToggle</a></li>
     * </ul>
     *
     * @module FMToggle
     * @augments FMPlugin
     * @example $('icon--menu').fmToggle();
     */
    $.FMPlugin.createPlugin({

        /**
         * Name to identify this plugin.
         *
         * @default 'fm-toggle'
         */
        name: pluginName,
        /**
         * Default settings for the plugin.
         *
         * @property {number} [animationDuration=200] The duration of the animation (in milliseconds).
         * @property {boolean} [animationInitiallyHidden=true] Whether or not the content should be initially hidden
         *      if using an animation style.
         * @property {string} [animationStyle=''] The type of animation that should be performed ('' = none,
         *      'slide' = slide, 'fade' = fade).
         * @property {string} [toggleClass='is-visible'] The class for showing/hiding the toggled content.
         * @property {boolean} [toggleClickOutside=false] Whether or not the toggle event should be triggered
         *      if a "click" is registered outside of the toggle trigger. NOTE: If no "click" event is specified
         *      in the triggers then this property does not apply.
         * @property {string} [toggleContentSelector='.navigation-wrap'] The selector for the content
         *      which will be toggled.
         * @property {number} [toggleEventDelay=0] The delay to introduce between the triggering of the "preToggle"
         *      and "postToggle" events (if required) (in milliseconds). This delay is necessary if animations
         *      are being applied by CSS, rather than by JavaScript, and thus need time to complete correctly.
         * @property {string} [toggleHideOnlyContentSelector='.toggle__hide__only'] The selector for the content
         *      which will be toggled only on hiding.
         * @property {string} [toggleShowOnlyContentSelector='.toggle__show__only'] The selector for the content
         *      which will be toggled only on showing.
         * @property {boolean} [toggleTrigger=false] Whether or not the trigger should also be toggled.
         * @property {string} [toggleTriggerClass=''] The class for showing/hiding the toggle trigger.
         * @property {string} [toggleTriggerHTML=''] The HTML that should be used as a replacement
         *      for the original trigger HTML when toggling (i.e. alternate between the
         *      original trigger HTML and <code>toggleTriggerHTML</code>).
         * @property {string} [toggleTriggerSelector=''] The selector for the trigger which will be used to
         *      toggle the content. If no trigger selector is specified (default behaviour) then any interactions
         *      within the entire context of the plugin instance will trigger the toggle event.
         * @property {string} [triggers='click'] The space-separated list of triggering events.
         */
        defaultOptions: {
            animationDuration: 200,
            animationInitiallyHidden: true,
            animationStyle: '',
            toggleClass: 'is-visible',
            toggleClickOutside: false,
            toggleContentSelector: '.navigation-wrap',
            toggleEventDelay: 0,
            toggleHideOnlyContentSelector: '.toggle__hide__only',
            toggleShowOnlyContentSelector: '.toggle__show__only',
            toggleTrigger: false,
            toggleTriggerClass: '',
            toggleTriggerHTML: '',
            toggleTriggerSelector: '',
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
        _instSettings: function (elem, options) {
            return {
                content: $(options.toggleContentSelector),
                hideOnlyContent: $(options.toggleHideOnlyContentSelector),
                showOnlyContent: $(options.toggleShowOnlyContentSelector)
            };
        },
        /**
         * Set up toggling based on triggers setting.
         *
         * @private
         * @param {jQuery} elem The current element.
         * @param {object} inst The current instance settings.
         */
        _postAttach: function (elem, inst) {
            var self = this;
            self._addUniqueId(elem);
            inst.elemId = elem.attr('id');
            inst.originalTriggerHTML = elem.html();
            $.each(inst.options.triggers.split(' '), function (index, trigger) {
                elem.on(trigger + '.' + self.name, inst.options.toggleTriggerSelector, {inst: inst, self: self},
                        self._toggleContent);
            });
            // Since the base "slide" or "fade" animations are based on animating over "display:block" to "display:none"
            // and visa-versa, then if the content is initially hidden by the toggle class, it needs to be hidden by
            // jQuery as well to ensure smooth animations.
            if ((inst.options.animationStyle !== '') && (inst.options.animationInitiallyHidden)) {
                inst.content.hide();
            }
        },
        /**
         * Disable.
         *
         * @param {Element} elem The current element.
         * @example $(selector).fmToggle('disable');
         */
        disable: function (elem) {
            var inst = this._getInst(elem);
            inst.disabled = true;
        },
        /**
         * Enable.
         *
         * @param {Element} elem The current element.
         * @example $(selector).fmToggle('enable');
         */
        enable: function (elem) {
            var inst = this._getInst(elem);
            inst.disabled = false;
        },
        /**
         * Hides the content.
         *
         * @private
         * @param {Event} e The triggering event.
         */
        _hideContent: function (e) {
            var self = e.data.self;
            var inst = e.data.inst;
            if (!$(e.target).closest(inst.elem).length && !$(e.target).closest(inst.options.toggleContentSelector).length) {
                self._toggleContent(e);
            }
        },
        /**
         * Toggles the content.
         *
         * @private
         * @param {Event} e The triggering event.
         * @fires FMToggle:fm-toggle-preToggle
         * @fires FMToggle:fm-toggle-postToggle
         */
        _toggleContent: function (e) {
            e.preventDefault();
            var self = e.data.self;
            var inst = e.data.inst;
            // Check if disabled
            if (inst.disabled) {
                return;
            }
            // Allow for the toggle to be triggered by clicking outside of the content.
            if ((inst.options.toggleClickOutside) && (e.type === 'click')) {
                if (inst.options.animationStyle !== '') {
                    // This logic appears "backwards" when compared with the logic when no animation is used, however
                    // because the toggle class is used instead to hide content (rather than show), this is why it is
                    // reversed.
                    if ((inst.content.hasClass(inst.options.toggleClass)) && (inst.options.animationInitiallyHidden)) {
                        $(document).on('click.' + inst.elemId, {inst: inst, self: self}, self._hideContent);
                    } else {
                        $(document).off('.' + inst.elemId);
                    }
                } else {
                    if (inst.content.hasClass(inst.options.toggleClass)) {
                        $(document).off('.' + inst.elemId);
                    } else {
                        $(document).on('click.' + inst.elemId, {inst: inst, self: self}, self._hideContent);
                    }
                }
            }
            self._toggleContentPre(inst);
            if (inst.options.animationStyle !== '') {
                // If the content already has the toggle class, then the class should be toggled before the animation
                // is started. This helps to ensure a smooth animation.
                if (inst.content.hasClass(inst.options.toggleClass)) {
                    inst.content.toggleClass(inst.options.toggleClass);
                    // Since there may be more than 1 content element which is being animated, the complete function
                    // shouldn't be executed until all animations have completed.
                    inst.content[inst.options.animationStyle + 'Toggle'](inst.options.animationDuration);
                    setTimeout(function () {
                        self._toggleContentAnimationComplete(inst);
                    }, inst.options.animationDuration);
                } else {
                    // Since there may be more than 1 content element which is being animated, the complete function
                    // shouldn't be executed until all animations have completed.
                    inst.content[inst.options.animationStyle + 'Toggle'](inst.options.animationDuration);
                    setTimeout(function () {
                        inst.content.toggleClass(inst.options.toggleClass);
                        self._toggleContentAnimationComplete(inst);
                    }, inst.options.animationDuration);
                }
            } else {
                inst.content.toggleClass(inst.options.toggleClass);
                // If a delay is required between the triggering of the "preToggle" and "postToggle" events, then wait
                // until any CSS animations have completed.
                if (inst.options.toggleEventDelay) {
                    setTimeout(function () {
                        self._toggleContentAnimationComplete(inst);
                    }, inst.options.toggleEventDelay);
                } else {
                    self._toggleContentAnimationComplete(inst);
                }
            }
        },
        /**
         * Upon completion of the toggle content animation.
         *
         * @private
         * @param {object} inst The current instance settings.
         */
        _toggleContentAnimationComplete: function (inst) {
            if (inst.options.toggleTrigger) {
                this._toggleTrigger(inst.elem, inst);
            }
            this._toggleContentPost(inst);
        },
        /**
         * Post toggle of the content.
         *
         * @private
         * @param {object} inst The current instance settings.
         */
        _toggleContentPost: function (inst) {
            if (!inst.showOnlyContent.hasClass(inst.options.toggleClass)) {
                inst.showOnlyContent.addClass(inst.options.toggleClass);
            }
            // After change callback
            inst.elem.trigger(inst.name + '-postToggle', [inst.content[0]]);
        },
        /**
         * Pre toggle of the content.
         *
         * @private
         * @param {object} inst The current instance settings.
         */
        _toggleContentPre: function (inst) {
            // Before change callback
            inst.elem.trigger(inst.name + '-preToggle', [inst.content[0]]);
            if (inst.hideOnlyContent.hasClass(inst.options.toggleClass)) {
                inst.hideOnlyContent.removeClass(inst.options.toggleClass);
            }
        },
        /**
         * Toggles the trigger.
         *
         * @private
         * @param {Element} elem The current element.
         * @param {object} inst The current instance settings.
         */
        _toggleTrigger: function (elem, inst) {
            if (inst.options.toggleTriggerClass !== '') {
                elem.toggleClass(inst.options.toggleTriggerClass);
            }
            if (inst.options.toggleTriggerHTML !== '') {
                if (elem.html() === inst.originalTriggerHTML) {
                    elem.html(inst.options.toggleTriggerHTML);
                } else {
                    elem.html(inst.originalTriggerHTML);
                }
            }
        },
        /**
         * Remove toggle setup.
         *
         * @private
         * @param {jQuery} elem The current element.
         * @param {object} inst The current instance settings.
         */
        _preDestroy: function (elem, inst) {
            $(document).off('.' + inst.elemId);
            this._removeUniqueId(elem);
            elem.off('.' + this.name);
            if (inst.options.toggleTrigger) {
                inst.elem.html(inst.originalTriggerHTML);
            }
        }

        /**
         * @event FMToggle:fm-toggle-preToggle
         * @desc Before the content has been toggled.
         * @this element
         * @param {Event} event The triggering event.
         * @param {Element} content The toggled content.
         */
        /**
         * @event FMToggle:fm-toggle-postToggle
         * @desc After the content has been toggled.
         * @this element
         * @param {Event} event The triggering event.
         * @param {Element} content The toggled content.
         */
    });
});