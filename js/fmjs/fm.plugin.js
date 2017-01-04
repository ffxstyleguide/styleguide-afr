/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function () {
    var initializing = false;
    // The base Class implementation (does nothing)
    window.PluginClass = function () {
    };
    // Collection of derived classes
    window.PluginClass.classes = {};
    // Create a new Class that inherits from this class
    window.PluginClass.extend = function extender(prop) {
        var base = this.prototype;
        // Instantiate a base class (but only create the instance, don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;
        // Copy the properties over onto the new prototype
        for (var name in prop) { // jshint loopfunc:true
            // Check if we're overwriting an existing function
            if (typeof prop[name] === 'function' && typeof base[name] === 'function') {
                prototype[name] = (function (name, fn) {
                    return function () {
                        var __super = this._super;
                        // Add a new ._super() method that is the same method but on the super-class
                        this._super = function (args) {
                            return base[name].apply(this, args || []);
                        };
                        var ret = fn.apply(this, arguments);
                        // The method only needs to be bound temporarily, so we remove it when we're done executing
                        this._super = __super;
                        return ret;
                    };
                })(name, prop[name]);
            // Check if we're overwriting existing default options.
            } else if (typeof prop[name] === 'object' && typeof base[name] === 'object' && name === 'defaultOptions') {
                var obj1 = base[name];
                var obj2 = prop[name];
                var obj3 = {};
                for (var attr1 in obj1) { // jshint forin:false
                    obj3[attr1] = obj1[attr1];
                }
                for (var attr2 in obj2) { // jshint forin:false
                    obj3[attr2] = obj2[attr2];
                }
                prototype[name] = obj3;
            } else {
                prototype[name] = prop[name];
            }
        }
        // The dummy class constructor
        function PluginClass() {
            // All construction is actually done in the init method
            if (!initializing && this._init) {
                this._init.apply(this, arguments);
            }
        }

        // Populate our constructed prototype object
        PluginClass.prototype = prototype;
        // Enforce the constructor to be what we expect
        PluginClass.prototype.constructor = PluginClass;
        // And make this class extendable
        PluginClass.extend = extender;
        return PluginClass;
    };
})();
define(['jquery'], function ($) {
    /**
     * Unique identifier that can be added to elements to uniquely identify them in the DOM. This is helpful when
     * you need to bind and remove events from outside the scope of the plugin (i.e. document level), but don't want
     * to influence other instances of the same plugin.
     */
    var uniqueId = 0;
    /**
     * An abstract base class for collection plugins, i.e. plugins that operate on collections of elements.
     * <p>Built-in functionality includes:</p>
     * <ul>
     *     <li>Creation of the jQuery function and singleton</li>
     *     <li>Creation of an instance object attached to the affected element(s)</li>
     *     <li>Addition of a marker class to indicate affected element(s)</li>
     *     <li>Processing of inline metadata options during initialisation</li>
     *     <li>Setting and retrieving option values</li>
     *     <li>Support for callable methods on the plugin</li>
     *     <li>Clean up of element(s) on destruction</li>
     * </ul>
     * <p>Functions whose names are prefixed by '_' are not accessible through the plugin.
     *   Any other function may be accessed by providing its name when invoking the plugin,
     *   along with any parameters that that method might require,
     *   e.g. <code>$(selector).fmTabs('option', {selectedClass: 'chosen'});</code></p>
     *
     * @module $.FMPlugin
     * @abstract
     */
    window.PluginClass.classes.FMPlugin = window.PluginClass.extend({

        /**
         * Name to identify this plugin. This name determines what the jQuery functions are called,
         * how the instance object is named, how the marker class is named, and provides
         * a namespace for event handlers.
         *
         * @protected
         * @example name: 'fm-tabs'
         */
        name: 'fm-plugin',
        /**
         * The current window, used just for injecting mocks for testing.
         *
         * @protected
         * @default window
         */
        customWindow: window,
        /**
         * Default options for instances of this plugin.
         *
         * @protected
         * @default {}
         * @example defaultOptions: {
         *    selectedClass: 'selected',
         *    triggers: 'click'
         *  }
         */
        defaultOptions: {},
        /**
         * Retrieve a marker class for affected elements.
         * The marker class is derived from the plugin name.
         *
         * @protected
         * @return {string} The marker class.
         * @example var marker = this._getMarker();
         */
        _getMarker: function () {
            return 'is_' + this.name;
        },
        /**
         * Initialise the plugin.
         * <p>Create the jQuery bridge - plugin name <code>fm-xyz</code> produces <code>$.fmXyz</code> and
         * <code>$.fn.fmXyz</code>.</p>
         * <p>Only override this to provide one-off initialisation for the plugin.
         * Always call the parent class' <code>_init()</code> first.</p>
         *
         * @protected
         */
        _init: function () {
            // Camel-case the name
            var jqName = camelCase(this.name);
            // Expose jQuery singleton manager
            $[jqName] = this;
            // Expose jQuery collection plugin
            $.fn[jqName] = function (options) {
                var otherArgs = Array.prototype.slice.call(arguments, 1);
                var inst = this;
                var returnValue = this;
                this.each(function () {
                    if (typeof options === 'string') {
                        if (options[0] === '_' || !$[jqName][options]) {
                            throw 'Unknown method: ' + options;
                        }
                        var methodValue = $[jqName][options].apply($[jqName], [this].concat(otherArgs));
                        if (methodValue !== inst && methodValue !== undefined) {
                            returnValue = methodValue;
                            return false;
                        }
                    } else {
                        $[jqName]._attach(this, options);
                    }
                });
                return returnValue;
            };
        },
        /**
         * Initialise an element. Called internally only. Adds an instance object as data named for the plugin.
         *
         * @private
         * @param {Element} elem The element to enhance.
         * @param {object} [options] Any overriding settings.
         */
        _attach: function (elem, options) {
            elem = $(elem);
            if (elem.hasClass(this._getMarker())) {
                return;
            }
            elem.addClass(this._getMarker());
            options = $.extend(this._deepMerge(), {}, this.defaultOptions, options || {}, this._getMetadata(elem));
            var inst = $.extend({name: this.name, elem: elem, self: this, options: options},
                    this._instSettings(elem, options));
            elem.data(this.name, inst); // Save instance against element
            this._postAttach(elem, inst);
            this.option(elem, options);
        },
        /**
         * Returns the specified URL with the appropriate query parameter added.
         * <p/>
         * If the parameter already exists, then the value is replaced instead.
         *
         * @protected
         * @param {string} url The URL to add the query parameter to.
         * @param {string} key Name of the query parameter.
         * @param {string} value Value of the query parameter.
         * @returns {string} The specified URL with the appropriate query parameter added.
         * @example var url = this._addQueryParameter(url, 'length', 3);
         */
        _addQueryParameter: function (url, key, value) {
            var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            if (url.match(re)) {
                return url.replace(re, '$1' + key + '=' + value + '$2');
            }
            else {
                return url + separator + key + '=' + value;
            }
        },
        /**
         * Adds a unique identifier to the specified element.
         * <p/>
         * An identifier won't be added if the element already contains an identifier.
         *
         * @protected
         * @param {Element} elem The element to add the unique identifier to.
         * @returns {string} The unique identifier added to the specified element,
         *      or the original identifier if already there.
         * @example this._addUniqueId(element);
         */
        _addUniqueId: function (elem) {
            elem = $(elem);
            var id = elem.attr('id');
            if (!id) {
                id = 'fm-id-' + (++uniqueId);
                elem.attr('id', id);
            }
            return id;
        },
        /**
         * Returns a boolean indicating whether or not a "deep merge" should be utilised when initialising the plugin
         * options.
         * </p>
         * The results of the merge would look as follows. Given:
         * </p>
         * <p>defaultOptions = <code>{object1:{option1:value1}}</code></p>
         * <p>options = <code>{object1:{option2:value2}}</code></p>
         * <p>Then the results would be:</p>
         * <p>deep merge result = <code>{object1:{option1:value1, option2:value2}}</code></p>
         * <p>shallow merge result (i.e. <code>_deepMerge</code> returns
         *      <code>false</code>) = <code>{object1:{option2:value2}}</code></p>
         *
         * @protected
         * @returns {boolean} <code>true</code> if a "deep merge" should be utilised when initialising
         * the plugin options; otherwise <code>false</code>.
         */
        _deepMerge: function () {
            return true;
        },
        /**
         * Retrieve additional instance settings. Override this in a sub-class to provide extra settings.
         * By default the instance settings contain:
         * <ul>
         *     <li><code>name</code>: The plugin name.</li>
         *     <li><code>elem</code>: The element associated with this instance.</li>
         *     <li><code>self</code>: The plugin singleton.</li>
         *     <li><code>options</code>: The complete set of merged options, derived from
         *          the default options, options provided during initialisation, and inline metadata.</li>
         * </ul>
         *
         * @protected
         * @param {jQuery} elem The current jQuery element.
         * @param {object} options The instance options.
         * @return {object} Any extra instance values.
         * @example _instSettings: function(elem, options) {
         *    return {nav: elem.find(options.navSelector)};
         *  }
         */
        _instSettings: function (elem, options) { // jshint unused:false
            return {};
        },
        /**
         * Plugin specific post initialisation. Override this in a sub-class to perform extra activities.
         * <p>This is the body of your plugin. You should created any required elements and
         *  attach any event handlers here. All event handlers should be namespaced with the plugin name
         *  to ensure that they don't interfere with other handlers on the same element.</p>
         *
         * @protected
         * @param {jQuery} elem The current jQuery element.
         * @param {object} inst The instance settings.
         * @example _postAttach: function(elem, inst) {
         *    elem.on('click.' + this.name, function() {
         *      ...
         *    });
         *  }
         */
        _postAttach: function (elem, inst) { // jshint unused:false
        },
        /**
         * Retrieve metadata configuration from the element. Metadata is specified as an attribute:
         *
         * <code>data-&lt;plugin name&gt;="&lt;setting name&gt;: '&lt;value&gt;', ..."</code>.
         *
         * If second parameter present, it will use it as the attribute name to retrieve metadata instead
         *
         * <code>data-&lt;attrName&gt;="&lt;setting name&gt;: '&lt;value&gt;', ..."</code>.
         *
         * The metadata representation can also be a JSON definition (i.e. with leading "{" and trailing "}" characters.
         *
         * @private
         * @param {jQuery} elem The source element.
         * @param {string} [attrName=this.name] The name of custom metadata attribute.
         * @return {object} The inline configuration or <code>{}</code>.
         */
        _getMetadata: function (elem, attrName) {
            try {
                var data = elem.data(attrName || this.name) || '';
                // If the data element is already representative of a JSON object, then it can be returned straight away
                // without manipulation.
                if ($.type(data) === 'object') {
                    return data;
                }
                // The following regex works as follows:
                // Replace all ' characters with " characters, unless escaped with \
                // Find all (a-zA-Z): character groups, which aren't followed by either a:
                //  * / character
                //  * a-z character except when there is any number of spaces followed by the words "true" or "false"
                // Replace escaped :
                // This means that if the value of a variable contains an : character it won't be incorrectly escaped
                // e.g. If the value extracted from the data attribute was:
                // animate:true,time:500,url:'http://myurl.com',title:'Web Pages\: Mike\'s Site'
                // This would be converted to:
                // "animate":true,"time":500,"url":"http://myurl.com","title":"Web Pages: Mike's Site"
                data = data.replace(/(\\?)'/g, function(match, prefix) {
                        return (prefix ? '\'' : '"');
                    }).
                    replace(/([a-zA-Z]+):([^\/a-z]|\s*true\b|\s*false\b)/g, '"$1":$2').
                    replace(/\\:/g, ':');
                return $.parseJSON('{' + data + '}');
            } catch (e) {
                return {};
            }
        },
        /**
         * Escape specific characters [':\] that can cause issues in JSON formatted data attributes
         * (aka metadata of a plugin) by prefixing them with a backslash and removes any double quote characters.
         *
         * @protected
         * @param {string} value The value to be escaped.
         * @returns {string} The value with special characters replaced or the value passed if it is not a string.
         * @example var value = this._escapeMetadataValue(attrValue);
         */
        _escapeMetadataValue: function (value) {
            if (typeof value !== 'string') {
                return value;
            }
            return value.replace(/[':\\]/g, '\\$&').replace(/["]/g, '');
        },
        /**
         * Retrieve the instance data for an element.
         * The instance object is stored against the element using the plugin name as its key.
         *
         * @protected
         * @param {Element} elem The source element.
         * @return {object} The instance data or <code>{}</code>.
         * @example var inst = this._getInst(element);
         */
        _getInst: function (elem) {
            return $(elem).data(this.name) || {};
        },
        /**
         * Retrieve or reconfigure the settings for a plugin.
         *
         * @param {Element} elem The source element.
         * @param {object|string} [name] The collection of new option values or the name of a single option.
         * @param {any} [value] The value for a single named option.
         * @return {any|object} The value of the named option, or all options in an object.
         * @example $(selector).plugin('option', 'name', value) // Set one option
         *  $(selector).plugin('option', {name: value, ...}) // Set many options
         *  var value = $(selector).plugin('option', 'name') // Get named option
         *  var options = $(selector).plugin('option') // Get all options
         */
        option: function (elem, name, value) {
            elem = $(elem);
            var inst = elem.data(this.name);
            if (!name || (typeof name === 'string' && typeof value === 'undefined')) {
                var opts = (inst || {}).options;
                return (opts && name ? opts[name] : opts);
            }
            if (!elem.hasClass(this._getMarker())) {
                return;
            }
            var options = name || {};
            if (typeof name === 'string') {
                options = {};
                options[name] = value;
            }
            this._optionsChanged(elem, inst, options);
            $.extend(inst.options, options);
        },
        /**
         * Plugin specific options processing.
         * Old value is available in <code>inst.options[name]</code>, new value is in <code>options[name]</code>.
         * Override this in a sub-class to perform extra activities.
         *
         * @protected
         * @param {jQuery} elem The current jQuery element.
         * @param {object} inst The instance settings.
         * @param {object} options The new options.
         * @example _optionsChanged: function(elem, inst, options) {
         *    if (options.name != inst.options.name) {
         *      elem.removeClass(inst.options.name).addClass(options.name);
         *    }
         *  }
         */
        _optionsChanged: function (elem, inst, options) { // jshint unused:false
        },
        /**
         * Remove all trace of the plugin.
         * Override <code>_preDestroy</code> for plugin-specific processing.
         *
         * @param {Element} elem The source element.
         * @example $(selector).plugin('destroy')
         */
        destroy: function (elem) {
            elem = $(elem);
            if (!elem.hasClass(this._getMarker())) {
                return;
            }
            this._preDestroy(elem, this._getInst(elem));
            elem.removeData(this.name).removeClass(this._getMarker());
        },
        /**
         * Plugin specific pre destruction.
         * Override this in a sub-class to perform extra activities and undo everything that was done in the
         * <code>_postAttach</code> or <code>_optionsChanged</code> functions.
         * If your event handlers are namespaced, you can easily remove them all via that namespace.
         *
         * @protected
         * @param {jQuery} elem The current jQuery element.
         * @param {object} inst The instance settings.
         * @example _preDestroy: function(elem, inst) {
         *    elem.off('.' + this.name);
         *  }
         */
        _preDestroy: function (elem, inst) { // jshint unused:false
        },
        /**
         * Removes the unique identifier from the specified element.
         *
         * @protected
         * @param {Element} elem The element to remove the unique identifier from.
         * @example this._removeUniqueId(element);
         */
        _removeUniqueId: function (elem) {
            elem = $(elem);
            if (/^fm-id-\d+$/.test(elem.attr('id'))) {
                elem.removeAttr('id');
            }
        }
    });
    /**
     * Convert names from hyphenated to camel-case.
     *
     * @private
     * @param {string} name The original hyphenated name.
     * @return {string} The camel-case version. */
    function camelCase(name) {
        return name.replace(/-([a-z])/g, function (match, group) {
            return group.toUpperCase();
        });
    }

    /**
     * Expose the plugin base.
     *
     * @namespace $.FMPlugin
     */
    $.FMPlugin = {

        /**
         * Create a new collection plugin.
         *
         * @memberof $.FMPlugin
         * @param {string} [superClass='FMPlugin'] The name of the parent class to inherit from.
         * @param {object} overrides The property/function overrides for the new class.
         * @example $.FMPlugin.createPlugin({
         *    name: 'fm-tabs',
         *    defaultOptions: {selectedClass: 'selected'},
         *    initSettings: function(elem, options) { return {...}; },
         *    postAttach: function(elem, inst) { ... }
         *  });
         */
        createPlugin: function (superClass, overrides) {
            if (typeof superClass === 'object') {
                overrides = superClass;
                superClass = 'FMPlugin';
            }
            superClass = camelCase(superClass).replace(/^fm/, 'FM');
            var className = camelCase(overrides.name).replace(/^fm/, 'FM');
            window.PluginClass.classes[className] = window.PluginClass.classes[superClass].extend(overrides);
            new window.PluginClass.classes[className](); // jshint ignore:line
        }
    };
});