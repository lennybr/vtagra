/*! X-Framework 24-04-2014 */ ;
(function(window, $, BB) {


    /**
     * Adapter to wrap jQuery or jQuery like libraries.
     * @exports Dom
     */

    var Dom = (function() {

        /**
         * jQueryWrapper is an object with private field _element which store
         * actual jQuery object. This constructor is supposed to be used as
         * function like: var domElement = Dom('.class').
         *
         * @param {jQueryWrapper|Element|$|string|undefined} element Object to
         *      be wrapped, can be any of type.
         * @returns {jQueryWrapper}
         * @constructor
         */
        var jQueryWrapper = function(element) {
            if (element !== undefined) {
                if (element instanceof jQueryWrapper) {
                    return element;
                }
                var result = new jQueryWrapper();
                result._element = $(element);
                return result;
            }
        };

        /**
         * Methods of Dom object that applied to element.
         */
        jQueryWrapper.prototype = {
            /** Wrapper around jQuery.fn.attr. */
            attr: function(attributeName) {
                return this._element.attr(attributeName);
            },
            /** Wrapper around jQuery.fn.data. */
            data: function(key, value) {
                if (value !== undefined) {
                    this._element.data(key, value);
                    return this;
                }
                return this._element.data(key);
            },
            /** Wrapper around jQuery.fn.is. */
            is: function(selector) {
                return this._element.is(selector);
            },
            /** Wrapper around jQuery.fn.find. */
            find: function(selector) {
                return jQueryWrapper(this._element.find(selector));
            },
            /** Wrapper around jQuery.fn.eq. */
            eq: function(number) {
                return jQueryWrapper(this._element.eq(number));
            },
            /** Wrapper around jQuery.fn.parent. */
            parent: function() {
                return jQueryWrapper(this._element.parent());
            },
            /** Wrapper around jQuery.fn.filter. */
            filter: function(selector) {
                return jQueryWrapper(this._element.filter(selector));
            },
            /** Wrapper around jQuery.fn.first. */
            first: function() {
                return jQueryWrapper(this._element.first());
            },
            /** Wrapper around jQuery.fn.append. */
            append: function(content) {
                this._element.append(content);
                return this;
            },
            /** Wrapper around jQuery.fn.get. */
            get: function(number) {
                return this._element.get(number);
            },
            /** Wrapper around jQuery.fn.size. */
            size: function() {
                return this._element.size();
            },
            /** Wrapper around jQuery.fn.each. */
            each: function(callback) {
                this._element.each(callback);
            },



            /** Wrapper around jQuery.fn.on. */
            on: function(events, selector, data, handler) {
                this._element.on(events, selector, data, handler);
                return this;
            },
            /** Wrapper around jQuery.fn.bind. */
            bind: function(eventType, eventData, handler) {
                this._element.bind(eventType, eventData, handler);
                return this;
            },
            /** Wrapper around jQuery.fn.unbind. */
            unbind: function(eventType, handler) {
                this._element.unbind(eventType, handler);
                return this;
            },
            /** Wrapper around jQuery.fn.trigger. */
            trigger: function(eventType) {
                this._element.trigger(eventType);
                return this;
            },
            /** Creates listener for animation end event. */
            animationEnd: function(callback) {
                var animationEndEvents = 'webkitAnimationEnd oAnimationEnd ' +
                    'msAnimationEnd animationend';

                this._element.one(animationEndEvents, callback);

                return this;
            },



            /** Wrapper around jQuery.fn.addClass. */
            addClass: function(className) {
                this._element.addClass(className);
                return this;
            },
            /** Wrapper around jQuery.fn.removeClass. */
            removeClass: function(className) {
                this._element.removeClass(className);
                return this;
            },
            /** Wrapper around jQuery.fn.height. */
            height: function(height) {
                if (height !== undefined) {
                    this._element.height(height);
                    return this;
                }
                return this._element.height();
            },
            /** Wrapper around jQuery.fn.width. */
            width: function(width) {
                if (width !== undefined) {
                    this._element.width(width);
                    return this;
                }
                return this._element.width();
            }
        };

        /**
         * Static method of wrapper object.
         */

        /**
         * @type {jQueryWrapper} Root DOM Object for starting the application.
         * @private
         */
        jQueryWrapper.root = jQueryWrapper('body');

        /**
         * Wraps jQuery.ajax routine.
         * @param {Object} params Object to be passed into jQuery.ajax.
         */
        jQueryWrapper.ajax = function(params) {
            $.ajax(params);
        };

        /**
         * Delays a function to execute when the DOM is fully loaded.
         * @param {Function} callback Function to be executed.
         */
        jQueryWrapper.ready = function(callback) {
            $(callback);
        };

        jQueryWrapper.viewport = {
            /** @returns {number} Height of viewport. */
            height: function() {
                return $(window).height();
            },
            /** @returns {number} Width of viewport. */
            width: function() {
                return $(window).width();
            }
        };

        /**
         * Binds a function to execute on window scroll.
         * @param {Function} callback Function to be executed.
         */
        jQueryWrapper.onscroll = function(callback) {
            $(window).bind('scroll', callback);
        };

        /** Creates method in $.fn for different animation events. */
        jQueryWrapper.bindAnimations = function() {
            $.each(['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
                    'tap'
                ],
                function(index, key) {
                    $.fn[key] = function(callback) {
                        return this.bind(key, callback);
                    };
                });
        };

        /**
         * Enchants jQuery DOM manipulations method to fire XF event listener.
         *
         * @param {string} selector Selector for child elements, whose presents
         *      in changed DOM element should fire a callback.
         * @param {Function} callback Function to be called.
         */
        jQueryWrapper.trackDomChanges = function(selector, callback) {
            $.each(['show', 'html', 'append', 'prepend'], function(index, key) {
                var oldHandler = $.fn[key];
                $.fn[key] = function() {
                    var res = oldHandler.apply(this, arguments);
                    if ($(this).find(selector).length) {
                        callback(this);
                    }
                    return res;
                };
            });
        };

        return jQueryWrapper;
    })();


    // Namespaceolds visible functionality of the framework
    var XF = window.XF = window.XF || {};

    // Linking Backbone.Events to XF.Events
    // And making XF a global event bus
    XF.Events = BB.Events;
    _.extend(XF, XF.Events);

    // XF.navigate is a syntax sugar for navigating between routes with event dispatching
    // Needed to make pages switching automatically
    XF.navigate = function(fragment) {
        XF.router.navigate(fragment, {
            trigger: true
        });
    };

    // Event bidnings for global XF commands
    XF.on('navigate', XF.navigate);


    // Listening to all global XF events to push them to necessary component if it's constructed
    XF.on('all', function(eventName) {
        var compEventSplitter = /:/,
            parts;

        if (!compEventSplitter.test(eventName)) {
            return;
        }

        parts = eventName.split(compEventSplitter);

        if (parts[0] !== 'component' && parts.length < 3) {
            return;
        }

        var compID = parts[1];

        if (!XF._defferedCompEvents) {
            XF._defferedCompEvents = {};
        }

        if (parts[0] === 'component' && parts[2] === 'rendered') {
            onComponentRender(compID);
        }

        if (!XF.getComponentByID(compID)) {
            var events = XF._defferedCompEvents[compID] || (XF._defferedCompEvents[compID] = []);

            events.push(arguments);
            XF.on('component:' + compID + ':constructed', function() {
                _.each(events, function(e) {
                    XF.trigger.apply(XF, e);
                });
            });
        }

    });

    // Searching for pages inside every component
    // Pages should be on the one level and can be started only once
    var onComponentRender = function(compID) {
        var compObj = Dom(XF.getComponentByID(compID).selector());

        if (_.has(XF, 'pages')) {
            if (!XF.pages.status.started) {
                XF.trigger('pages:start', compObj);
            }
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Loads component definitions for each visible component placeholder found
    // Searches inside DOMObject passed
    // TODO(Jauhen): now DOM Element is passed, need to pass direct jQuery/Dom object.
    XF.loadChildComponents = function(DOMObject) {
        if (Dom(DOMObject).attr('data-component')) {
            if (Dom(DOMObject).is(':visible') && (!Dom(DOMObject).attr('data-device-type') || Dom(DOMObject).attr('data-device-type') == XF.device.type.name)) {
                var compID = Dom(DOMObject).attr('data-id');
                var compName = Dom(DOMObject).attr('data-component');
                loadChildComponent(compID, compName);
            }
        }

        Dom(DOMObject).find('[data-component][data-cache=true],[data-component]:visible').each(function(ind, obj) {
            if (!Dom(obj).attr('data-device-type') || Dom(obj).attr('data-device-type') == XF.device.type.name) {
                var compID = Dom(obj).attr('data-id');
                var compName = Dom(obj).attr('data-component');
                if (compID && compName) {
                    loadChildComponent(compID, compName);
                }
            }
        });
    };


    // Loads component definition and creates its instance
    var loadChildComponent = function(compID, compName) {
        XF.define([XF.settings.property('componentUrl')(compName)], function(compDef) {
            if (!components[compID] && _.isFunction(compDef)) {
                var compInst = new compDef(compName, compID);
                components[compID] = compInst;
                compInst._constructor();
            }
        });
    };

    // Stores instances of XF.Component and its subclasses
    var components = {};

    // Returns component instance by its id
    XF.getComponentByID = function(compID) {
        return components[compID];
    };

    // Removes component instances with ids in array `ids` from `components`
    XF._removeComponents = function(ids) {
        if (!_.isEmpty(ids)) {
            _.each(ids, function(id) {
                components = _.omit(components, id);
            });
        }
    };


    /* DEFINE */


    var registeredModules = {};
    var waitingModules = {};
    var baseElement = document.getElementsByTagName('base')[0];
    var head = document.getElementsByTagName('head')[0];

    var checkModuleLoaded = function() {

        _.each(waitingModules, function(module, ns) {

            var name = module[0],
                dependencies = module[1],
                exec = module[2],
                args = [];

            _.each(dependencies, function(dependency, n) {
                var depName = getModuleNameFromFile(dependency);
                if (registeredModules[depName] !== undefined) {
                    args.push(registeredModules[depName]);
                }
            });

            if (dependencies.length === args.length || dependencies.length === 0) {

                if (name !== null) {
                    XF.log('core: executing module "' + name + '"');
                    delete waitingModules[name];
                    registeredModules[name] = exec.apply(this, args);
                }

            }
        });
    };

    var getModuleNameFromFile = function(file) {
        var moduleName = file.split(/\//);
        return moduleName[moduleName.length - 1].replace('.js', '');
    };

    var parseFiles = function(file) {

        var moduleName = getModuleNameFromFile(file);
        var moduleFile = file.push ? file[1] : file;

        //Don't load module already loaded
        if (registeredModules[moduleName]) {
            checkModuleLoaded();
            return;
        }

        if (!/\.js/.test(moduleFile) && !/^http/.test(moduleFile)) {
            moduleFile = moduleFile.replace('.', '/');
            moduleFile = moduleFile + '.js';
        }

        create(moduleName, moduleFile);
    };

    var onLoad = function(event) {
        var target = (event.currentTarget || event.srcElement),
            name;

        //Check if the script is realy loaded and executed ! (Fuck you IE with your "Loaded but not realy, wait to be completed")
        if (event.type !== "load" && target.readyState != "complete") {
            return;
        }

        name = target.getAttribute('data-module');
        target.setAttribute('data-loaded', true);

        // Old browser need to use the detachEvent method
        if (target.attachEvent) {
            target.detachEvent('onreadystatechange', onLoad);
        } else {
            target.removeEventListener('load', onLoad);
        }

        checkModuleLoaded();
    };

    var attachEvents = function(script) {
        if (script.attachEvent) {
            script.attachEvent('onreadystatechange', onLoad);
        } else {
            script.addEventListener('load', onLoad, false);
        }
    };

    var checkScripts = function(moduleName) {
        var script = false;

        _.each(document.getElementsByTagName('script'), function(elem) {
            if (elem.getAttribute('data-module') && elem.getAttribute('data-module') === moduleName) {
                script = elem;
                return false;
            }
        });

        return script;
    };

    var create = function(moduleName, moduleFile) {
        //SetTimeout prevent the "OMG RUN, CREATE THE SCRIPT ELEMENT, YOU FOOL" browser rush
        setTimeout(function() {
            var script = checkScripts(moduleName);

            if (script) {
                return;
            }

            script = document.createElement('script');

            script.async = true;
            script.type = "text/javascript";
            script.src = moduleFile;
            script.setAttribute('data-module', moduleName);
            script.setAttribute('data-loaded', false);

            if (baseElement) {
                //prevent IE 6-8 bug (script executed before appenchild execution. Yeah, that's realy SUCK)
                baseElement.parentNode.insertBefore(script, baseElement);
            } else {
                head.appendChild(script);
            }

            attachEvents(script);
        }, 0);
    };

    // Defines class and calls registered callbacks if necessary
    XF.define = XF.require = XF.defineComponent = function(ns, deps, def) {

        if (typeof ns !== "string") {
            def = deps;
            deps = ns;
            ns = XF.utils.uniqueID();
        }

        if (typeof deps !== "object") {
            def = deps;
            deps = [];
        }


        if (waitingModules[ns] === undefined) {
            waitingModules[ns] = [ns, deps, def];

            checkModuleLoaded();

            if (deps.length) {
                _.each(deps, parseFiles);
            }
        }
    };

    // Returns all registered components
    XF.getRegisteredModules = function() {
        return registeredModules;
    };

    // Stores custom options for XF.Component or its subclasses instances
    var componentOptions = {};

    // Defines component instance custom options
    XF.setOptionsByID = function(compID, options) {
        componentOptions[compID] = options;
    };

    // Returns custom instance options by component instance ID
    XF.getOptionsByID = function(compID) {
        return componentOptions[compID] || {};
    };

    // Linking Backbone.history to XF.history
    XF.history = BB.history;



    Dom.trackDomChanges('[data-component]',
        function(element) {
            XF.trigger('xf:loadChildComponents', element);
        });


    var logMap = ['log', 'warn', 'error', 'info'],
        logPrefix = 'XF >> ',
        console = window.console || {};

    XF.log = function(log) {
        if (_.isFunction(console['log']) && XF.log.enabled) {
            console.log(logPrefix + log);
        }
    };

    XF.log.enabled = true;

    _.each(logMap, function(type) {

        XF.log[type] = function(log) {
            if (_.isFunction(console[type]) && XF.log.enabled) {
                console[type](logPrefix + log);
            }
        };

    });


    /**
Instance of {@link XF.DeviceClass}
@static
@private
@type {Object}
*/
    XF.device = {

        /**
    Contains device viewport size: {width; height}
    @type Object
    */
        size: {
            width: 0,
            height: 0
        },

        isMobile: (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent || navigator.vendor || window.opera).toLowerCase())),

        isIOS: (
            /iphone|ipod|ipad/i.test((navigator.userAgent || navigator.vendor || window.opera).toLowerCase())
        ),


        /**
    Array of device types to be chosen from (can be set via {@link XF.start} options)
    @type Object
    @private
    */
        types: [{
            name: 'desktop',
            range: {
                max: null,
                min: 1025
            },
            templatePath: 'desktop/',
            fallBackTo: 'tablet'
        }, {
            name: 'tablet',
            range: {
                max: 1024,
                min: 480
            },
            templatePath: 'tablet/',
            fallBackTo: 'mobile'
        }, {
            name: 'mobile',
            range: {
                max: 480,
                min: null
            },
            templatePath: 'mobile/',
            fallBackTo: 'default'
        }],

        /**
    Default device type that would be used when none other worked (covers all the viewport sizes)
    @type Object
    @private
    */
        defaultType: {
            name: 'default',
            range: {
                min: null,
                max: null
            },
            templatePath: '',
            fallBackTo: null
        },

        /**
Detected device type that would be used to define template path
@type Object
@private
*/
        type: this.defaultType,



        /**
Initializes {@link XF.device} instance (runs detection methods)
@param {Array} types rray of device types to be choosen from
*/
        init: function(types) {
            this.types = types || this.types;
            this.detectType();
            this.detectTouchable();
        },

        supports: {
            /**
    A flag indicates whether the device is supporting Touch events or not
    @type Boolean
    */
            touchEvents: false,

            /**
    A flag indicates whether the device is supporting pointer events or not
    @type Boolean
    */
            pointerEvents: window.navigator.msPointerEnabled,

            /**
    A flag indicates whether the device is supporting CSS3 animations or not
    @type Boolean
    */
            cssAnimations: (function() {
                var domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
                    elm = document.createElement('div');

                if (elm.style.animationName) {
                    return {
                        prefix: ''
                    };
                }

                for (var i = 0; i < domPrefixes.length; i++) {
                    if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                        return {
                            prefix: '-' + domPrefixes[i].toLowerCase() + '-'
                        };
                    }
                }

                return false;

            }())
        },

        /**
Detectes device type (basicaly, chooses most applicable type from the {@link XF.DeviceClass#types} list)
@private
*/
        detectType: function() {

            this.size.width = Dom.viewport.width();
            this.size.height = Dom.viewport.height();

            XF.log('device: width is "' + this.size.width + '"');
            XF.log('device: height is "' + this.size.height + '"');

            var maxSide = Math.max(this.size.width, this.size.height);

            XF.log('device: maximum device side size is "' + maxSide + '"');

            var res = null;
            _.each(this.types, function(type) {
                try {
                    if (
                        (!type.range.min || (type.range.min && maxSide > type.range.min)) &&
                        (!type.range.max || (type.range.max && maxSide < type.range.max))
                    ) {
                        res = type;
                    }
                } catch (e) {
                    XF.log('device: cannot select device type. Please verify your app settings.');
                }
            });

            if (res) {

                this.type = res;

            } else {

                this.type = this.defaultType;

                XF.log('device: cannot select device type. Please verify your app settings.');
            }

            XF.log('device: selected device type is "' + this.type.name + '"');
        },

        /**
Chooses device type by ot's name
@param {String} typeName Value of 'name' property of the type that should be returnd
@return {Object} device type
*/
        getTypeByName: function(typeName) {
            var res = null;
            _.each(this.types, function(type) {
                try {
                    if (type.name == typeName) {
                        res = type;
                    }
                } catch (e) {
                    XF.log('device: cannot select device type. Please verify your app settings.');
                }
            });

            return res;
        },

        /**
Detectes whether the device is supporting Touch events or not
@private
*/
        detectTouchable: function() {

            var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
            var style = ['@media (', prefixes.join('touch-enabled),('), 'app_device_test', ')', '{#touch{top:9px;position:absolute}}'].join('');

            var $this = this;

            this.injectElementWithStyles(style, function(node, rule) {
                var style = document.styleSheets[document.styleSheets.length - 1],
                    // IE8 will bork if you create a custom build that excludes both fontface and generatedcontent tests.
                    // So we check for cssRules and that there is a rule available
                    // More here: github.com/Modernizr/Modernizr/issues/288 & github.com/Modernizr/Modernizr/issues/293
                    cssText = style ? (style.cssRules && style.cssRules[0] ? style.cssRules[0].cssText : style.cssText || '') : '',
                    children = node.childNodes,
                    hashTouch = children[0];

                $this.supports.touchEvents = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch || (hashTouch && hashTouch.offsetTop) === 9;

            }, 1, ['touch']);

            XF.log('device: device is ' + (this.supports.touchEvents ? '' : 'not ') + 'touchable');

        },



        /**
Inject element with style element and some CSS rules. Used for some detect* methods
@param String rule Node styles to be applied
@param Function callback Test validation Function
@param Number nodes Nodes Number
@param Array testnames Array with test names
@private
*/
        injectElementWithStyles: function(rule, callback, nodes, testnames) {

            var style, ret, node,
                div = document.createElement('div'),
                // After page load injecting a fake body doesn't work so check if body exists
                body = document.body,
                // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.
                fakeBody = body ? body : document.createElement('body');

            if (parseInt(nodes, 10)) {
                // In order not to give false positives we create a node for each test
                // This also allows the method to scale for unspecified uses
                while (nodes--) {
                    node = document.createElement('div');
                    node.id = testnames ? testnames[nodes] : 'app_device_test' + (nodes + 1);
                    div.appendChild(node);
                }
            }

            // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
            // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
            // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
            // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
            // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
            style = ['&#173;', '<style>', rule, '</style>'].join('');
            div.id = 'app_device_test';
            // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
            // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
            fakeBody.innerHTML += style;
            fakeBody.appendChild(div);

            if (!body) {
                //avoid crashing IE8, if background image is used
                fakeBody.style.background = '';
                docElement.appendChild(fakeBody);
            }

            ret = callback(div, rule);

            // If this is done after page load we don't want to remove the body so check if body exists
            if (!body) {
                fakeBody.parentNode.removeChild(fakeBody);
            } else {
                div.parentNode.removeChild(div);
            }

            return !!ret;
        },

        /**
Stores identifier for portrait orientation
@constant
@type String
*/
        ORIENTATION_PORTRAIT: 'portrait',

        /**
Stores identifier for landscape orientation
@constant
@type String
*/
        ORIENTATION_LANDSCAPE: 'landscape',


        /**
Returns current orientation of the device (ORIENTATION_PORTRAIT | ORIENTATION_LANDSCAPE)
@return String
*/
        getOrientation: function() {
            var isPortrait = true,
                elem = document.documentElement;
            if (false) {
                //TODO: uncomment and solve
                //isPortrait = portrait_map[ window.orientation ];
            } else {
                isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
            }
            return isPortrait ? this.ORIENTATION_PORTRAIT : this.ORIENTATION_LANDSCAPE;
        },

        /**
Returns current screen height
@return Number
*/
        getScreenHeight: function() {
            var orientation = this.getOrientation();
            var port = orientation === this.ORIENTATION_PORTRAIT;
            var winMin = port ? 480 : 320;
            var screenHeight = port ? screen.availHeight : screen.availWidth;
            var winHeight = Math.max(winMin, $(window).height());
            var pageMin = Math.min(screenHeight, winHeight);

            return pageMin;
        },

        /**
Returns viewport $ object
@return $
*/
        getViewport: function() {
            // if there's no explicit viewport make body the viewport
            //var vp = $('.xf-viewport, .viewport') ;
            var vp = Dom.root.addClass('xf-viewport');
            if (!vp.get(0)) {
                vp = Dom('.xf-page').eq(0);
                if (!vp.length) {
                    vp = Dom.root;
                } else {
                    vp = vp.parent();
                }
                vp.addClass('xf-viewport');
            }
            return vp.eq(0);
        }
    };


    /**
     {@link XF.settings}
     @static
     @type {Object}
     */
    XF.settings = {
        /**
         Used for {@link XF.storage} clearance when new version released
         @memberOf XF.settings.prototype
         @default '1.0.0'
         @type String
         */
        appVersion: '1.0.0',
        /**
         Deactivates cache usage for the whole app (usefull for developement)
         @memberOf XF.settings.prototype
         @default false
         @type String
         */
        noCache: false,
        /**
         Used by default Component URL formatter: prefix + component_name + postfix
         @memberOf XF.settings.prototype
         @default ''
         @type String
         */
        componentUrlPrefix: 'js/components/',
        /**
         Used by default Component URL formatter: prefix + component_name + postfix
         @memberOf XF.settings.prototype
         @default '.js'
         @type String
         */
        componentUrlPostfix: '.js',
        /**
         Default Component URL formatter: prefix + component_name + postfix
         @param {String} compName Component name
         @memberOf XF.settings.prototype
         @returns {String} Component URL
         @type Function
         */
        componentUrl: function(compName) {
            return XF.settings.property('componentUrlPrefix') + compName + XF.settings.property('componentUrlPostfix');
        },

        /**
         Used by default Template URL formatter: prefix + component_name + postfix
         @memberOf XF.settings.prototype
         @default ''
         @type String
         */
        templateUrlPrefix: 'tmpl/',
        /**
         Used by default Template URL formatter: prefix + component_name + postfix
         @memberOf XF.settings.prototype
         @default '.tmpl'
         @type String
         */
        templateUrlPostfix: '.tmpl',


        /**
         Used by default Data URL formatter: prefix + component_name + postfix
         @memberOf XF.settings.prototype
         @default ''
         @type String
         */
        dataUrlPrefix: '',


        ajaxSettings: {

        },

        /**
         Gets or sets property value (depending on whether the 'value' parameter was passed or not)
         @param {String} propName
         @param {Object} [value] new value of the property
         */
        property: function(propName, value) {
            if (value === undefined) {
                return this[propName];
            } else {
                this[propName] = value;
            }
        }
    };


    /**
     Instance of {@link XF.CacheClass}
     @static
     @private
     @type {Object}
     */
    XF.storage = {

        /**
         Local reference to the localStorage
         @type {Object}
         */
        storage: null,

        /**
         Indicates whether accessibility test for localStorage was passed at launch time
         @type {Object}
         */
        isAvailable: false,

        /**
         Runs accessibility test for localStorage & clears it if the applicationVersion is too old
         */
        init: function() {

            this.storage = window.localStorage;

            // checking availability
            try {
                this.storage.setItem('check', 'check');
                this.storage.removeItem('check');
                this.isAvailable = true;
            } catch (e) {
                this.isAvailable = false;
            }

            // clearing localStorage if stored version is different from current
            var appVersion = this.get('appVersion');
            if (XF.settings.property('noCache')) {
                // cache is disable for the whole site manualy
                XF.log('storage: cache is disabled for the whole app manually — clearing storage');
                this.set('appVersion', XF.settings.property('appVersion'));
            } else if (appVersion && appVersion == XF.settings.property('appVersion')) {
                // same version is cached - useing it as much as possible
                XF.log('storage: same version is cached');
            } else {
                // wrong or no version cached - clearing storage
                XF.log('storage: no version cached — clearing storage');
                this.clear();
                this.set('appVersion', XF.settings.property('appVersion'));
            }
        },

        /**
         Returns a value stored in cache under appropriate key
         @param {String} key
         @return {String}
         */
        get: function(key) {
            var result;
            if (this.isAvailable) {
                try {
                    result = this.storage.getItem(key);
                } catch (e) {
                    result = null;
                }
            } else {
                result = null;
            }
            return result;
        },

        /**
         Sets a value stored in cache under appropriate key
         @param {String} key
         @param {String} value
         @return {Boolean} success indicator
         */
        set: function(key, value) {
            var result;
            if (this.isAvailable) {
                try {
                    this.storage.setItem(key, value);
                    result = true;
                } catch (e) {
                    result = false;
                }
            } else {
                result = false;
            }
            return result;
        },

        /**
         Clears localStorage
         @return {Boolean} success indicator
         */
        clear: function() {
            var result;
            if (this.isAvailable) {
                try {
                    this.storage.clear();
                    result = true;
                } catch (e) {
                    result = false;
                }
            } else {
                result = false;
            }
            return result;
        }

    };


    // Method announces touchevents for elements
    XF.touch = {

        init: function() {
            // Default values and device events detection
            var touchHandler = {},
                eventsHandler = {

                    // Events for desktop browser, old ios, old android
                    mouse: {
                        start: "mousedown",
                        move: "mousemove",
                        end: "mouseup",
                        cancel: "mouseup"
                    },

                    // Events for modern Windows devices (IE10+)
                    pointer: {
                        start: "MSPointerDown",
                        move: "MSPointerMove",
                        end: "MSPointerUp",
                        cancel: "MSPointerCancel"
                    },

                    // Events for touchable devices
                    touch: {
                        start: "touchstart",
                        move: "touchmove",
                        end: "touchend",
                        cancel: "touchcancel"
                    }
                },
                swipeDelta = 30, // Amount of pixels for swipe event
                isTouch,
                eventType;

            // Changing events depending on detected data
            isTouch = (XF.device.supports.pointerEvents) ? false : (XF.device.supports.touchEvents ? true : false);
            eventType = (XF.device.supports.pointerEvents) ? 'pointer' : (XF.device.supports.touchEvents ? 'touch' : 'mouse');

            // If target is text
            var parentIfText = function(node) {
                return 'tagName' in node ? node : node.parentNode;
            };

            // Detecting swipe direction
            var swipeDirection = function(x1, x2, y1, y2) {
                var xDelta = Math.abs(x1 - x2),
                    yDelta = Math.abs(y1 - y2);
                return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
            };

            // Cancelling all hadlers
            var cancelAll = function() {
                touchHandler = {};
            };

            // Events binding
            Dom.ready(function() {
                var now,
                    delta;

                Dom.root.bind(eventsHandler[eventType].start, function(e) { // Pointer / Touch start event
                    now = Date.now();
                    delta = now - (touchHandler.last || now);
                    touchHandler.el = Dom(parentIfText(isTouch ? e.originalEvent.targetTouches[0].target : e.originalEvent.target));
                    touchHandler.x1 = isTouch ? e.originalEvent.targetTouches[0].clientX : e.originalEvent.clientX;
                    touchHandler.y1 = isTouch ? e.originalEvent.targetTouches[0].clientY : e.originalEvent.clientY;
                    touchHandler.last = now;

                }).bind(eventsHandler[eventType].move, function(e) { // Pointer / Touch move event
                    touchHandler.x2 = isTouch ? e.originalEvent.targetTouches[0].clientX : e.originalEvent.clientX;
                    touchHandler.y2 = isTouch ? e.originalEvent.targetTouches[0].clientY : e.originalEvent.clientY;

                    if (Math.abs(touchHandler.x1 - touchHandler.x2) > 10) {
                        e.preventDefault();
                    }
                }).bind(eventsHandler[eventType].end, function(e) { // Pointer / Touch end event

                    if ((touchHandler.x2 && Math.abs(touchHandler.x1 - touchHandler.x2) > swipeDelta) ||
                        (touchHandler.y2 && Math.abs(touchHandler.y1 - touchHandler.y2) > swipeDelta)) {
                        touchHandler.direction = swipeDirection(touchHandler.x1, touchHandler.x2, touchHandler.y1, touchHandler.y2);

                        // Trigger swipe event
                        touchHandler.el.trigger('swipe');

                        // Trigger swipe event by it's direction
                        touchHandler.el.trigger('swipe' + touchHandler.direction);
                        touchHandler = {};

                    } else if ('last' in touchHandler) {

                        // Trigger tap event
                        touchHandler.el.trigger('tap');

                        // Unbind click event if tap
                        // TODO(Jauhen): Add event namespaces here.
                        //Dom.root.unbind('click');
                        //touchHandler.el.unbind('click');

                    }
                });

                // Cancel all handlers if window scroll
                Dom.onscroll(cancelAll);
            });

            // List of new events
            Dom.bindAnimations();
        }

    };

    /**
     XF.pages
     @static
     @public
     */
    XF.pages = {

        status: {
            started: false
        },

        /**
         CSS class used to identify pages
         @type String
         @default 'xf-page'
         */
        pageClass: 'xf-page',

        /**
         CSS class used to identify active page
         @type String
         @default 'xf-page-active'
         */
        activePageClass: 'xf-page-active',

        /**
         Animation types for page switching ('fade', 'slide', 'none')
         @type String
         @default 'fade'
         */
        animations: {
            standardAnimation: 'slideleft',
            next: null,

            types: {
                'none': {
                    fallback: function(fromPage, toPage) {
                        fromPage.removeClass(this.activePageClass);
                        toPage.addClass(this.activePageClass);
                    }
                },
                'fade': {
                    fallback: function(fromPage, toPage) {
                        fromPage.removeClass(this.activePageClass);
                        toPage.addClass(this.activePageClass);
                    }
                },
                'slideleft': {
                    fallback: function(fromPage, toPage) {
                        fromPage.removeClass(this.activePageClass);
                        toPage.addClass(this.activePageClass);
                    }
                },
                'slideright': {
                    fallback: function(fromPage, toPage) {
                        fromPage.removeClass(this.activePageClass);
                        toPage.addClass(this.activePageClass);
                    }
                }
            }
        },

        /**
         Saves current active page
         @type $
         @private
         */
        activePage: null,

        /**
         Saves current active page name
         @type $
         @private
         */
        activePageName: '',

        /**
         Initialises pages: get current active page and binds necessary routes handling
         @private
         */
        init: function(animations) {
            XF.on('pages:show', _.bind(XF.pages.show, XF.pages));
            XF.on('pages:animation:next', _.bind(XF.pages.setNextAnimationType, XF.pages));
            XF.on('pages:animation:default', _.bind(XF.pages.setDefaultAnimationType, XF.pages));
            XF.on('pages:start', _.bind(XF.pages.start, XF.pages));

            if (_.has(animations, 'types')) {
                _.extend(this.animations.types, animations.types);
            }

            if (_.has(animations, 'standardAnimation')) {
                this.setDefaultAnimationType(animations.standardAnimation);
            }

            this.start();
        },

        start: function(jqObj) {
            if (this.status.started) {
                return;
            }

            jqObj = jqObj || Dom.root;
            var pages = jqObj.find(' .' + this.pageClass);
            if (pages.size()) {
                var preselectedAP = pages.filter('.' + this.activePageClass);
                if (preselectedAP.length) {
                    this.activePage = preselectedAP;
                    this.activePageName = preselectedAP.attr('id');
                } else {
                    this.show(pages.first());
                }

                XF.off('pages:start');
                this.status.started = true;
            }
        },

        setDefaultAnimationType: function(animationType) {
            if (XF.pages.animations.types[animationType]) {
                XF.pages.animations.standardAnimation = animationType;
            }
        },

        setNextAnimationType: function(animationType) {
            if (XF.pages.animations.types[animationType]) {
                XF.pages.animations.next = animationType;
            }
        },

        /**
         Executes animation sequence for switching
         @param $ jqPage
         */
        show: function(page, animationType) {
            if (page === this.activePageName) {
                return;
            }

            if (page === '') {
                var pages = Dom.root.find(' .' + this.pageClass);
                if (pages.size()) {
                    this.show(pages.first());
                }
                return;
            }

            var jqPage = (page instanceof Dom) ? page : Dom('.' + XF.pages.pageClass + '#' + page);

            if (!_.isUndefined(jqPage.attr('data-device-type'))) {
                if (jqPage.attr('data-device-type') !== XF.device.type.name) {
                    return;
                }
            }

            // preventing animation when the page is already shown
            if ((this.activePage && jqPage.attr('id') == this.activePage.attr('id')) || !jqPage.size()) {
                return;
            }
            XF.log('pages: showing page "' + jqPage.attr('id') + '"');

            var viewport = XF.device.getViewport();
            var screenHeight = XF.device.getScreenHeight();

            if (this.animations.next) {
                animationType = (this.animations.types[this.animations.next] ? this.animations.next : this.animations.standardAnimation);
                this.animations.next = null;
            } else {
                animationType = (this.animations.types[animationType] ? animationType : this.animations.standardAnimation);
            }

            var fromPage = this.activePage;
            var toPage = jqPage;

            this.activePage = toPage;
            this.activePageName = jqPage.attr('id');

            if (!XF.device.supports.cssAnimations) {
                if (_.isFunction(this.animations.types[animationType]['fallback'])) {
                    _.bind(this.animations.types[animationType].fallback, this)(fromPage, toPage);
                }
            } else {
                if (fromPage) {
                    viewport.addClass('xf-viewport-transitioning');

                    fromPage.height(viewport.height()).addClass('out ' + animationType);
                    toPage.height(viewport.height()).addClass('in ' + animationType + ' ' + this.activePageClass);
                    fromPage.animationEnd(function() {
                        fromPage.height('').removeClass(animationType + ' out in');
                        fromPage.removeClass(XF.pages.activePageClass);
                    });

                    toPage.animationEnd(function() {
                        toPage.height('').removeClass(animationType + ' out in');
                        viewport.removeClass('xf-viewport-transitioning');
                    });
                } else {
                    // just making it active
                    this.activePage.addClass(this.activePageClass);
                }
            }

            XF.trigger('ui:enhance', this.activePage);

            // looking for components inside the page
            XF.loadChildComponents(this.activePage);
        }
    };


    /**
     Instance of {@link XF.RouterClass}
     @static
     @type {XF.router}
     */
    XF.router = null;

    /**
     Implements Routing.
     @class
     @static
     @augments XF.Events
     @param {Object} routes routes has map
     @param {Object} handlers handlers has map
     */
    XF.Router = BB.Router;

    _.extend(XF.Router.prototype, /** @lends XF.Router.prototype */ {


        /**
         Initiates Rounting & history listening
         @private
         */
        start: function(options) {
            this.bindAnyRoute();
            XF.history.start(options);

            // TODO pass Dom.root element instead of $(body)
            XF.trigger('ui:enhance', $('body'));
        },


        /**
         Binds a callback to any route
         @param {Function} callback A function to be called when any route is visited
         */
        bindAnyRoute: function() {
            this.on('route', function(e) {
                XF.log('router: navigating to "' + this.getPageNameFromFragment(XF.history.fragment) + '"');
                if (XF.pages) {
                    XF.pages.show(this.getPageNameFromFragment(XF.history.fragment));
                }
            });
        },

        /**
         Returns page name string by fragment
         @param String fragment
         @return String
         */
        getPageNameFromFragment: function(fragment) {
            var parts = fragment.replace(/^\/+/, '').replace(/\/+$/, '').split('/');
            return parts[0];
        }
    });


    // TODO(Jauhen): Consider this function as part of XF.App.
    /**
     * A module create AppStart function that would be ran during XF.App call.
     * @exports AppStart
     */

    var AppStart = (function() {
        /**
         * Creates router and pass parameters to Backbone.Router.
         * @param {Object} options Router settings.
         * @private
         */
        var _createRouter = function(options) {
            if (XF.router) {
                throw 'XF.createRouter can be called only once.';
            } else {
                XF.router = new(XF.Router.extend(options))();
            }
        };

        /**
         * Makes each element with `data-href` attribute tappable (touchable,
         * clickable). It will work with application routes and pages.
         * `data-animation` on such element will set the next animation type for
         * the page.
         * @private
         */
        var _placeAnchorHooks = function() {
            Dom.root.on('tap click', '[data-href]', function() {
                var element = Dom(this);
                var animationType = element.data('animation') || null;

                if (animationType) {
                    XF.trigger('pages:animation:next', animationType);
                }

                XF.router.navigate(element.data('href'), {
                    trigger: true
                });
            });
        };


        // TODO(Jauhen): replace Object in param with more specific type.
        // See http://usejsdoc.org/tags-typedef.html for details.
        /**
         * Initialises all necessary objects and runs initial page.
         * This function is called from XF.App.
         *
         * @param {Object=} options Setting of application.
         * @param {Object=} options.animations Page transitions settings,
         *          see XF.pages for details.
         * @param {Object=} options.device Tweaks for different device types,
         *          see XF.devices for details.
         * @param {Object=} options.history Object to be passed into
         *          Backbone.history.start.
         * @param {Object=} options.router Object to be passed into Backbone.Router.
         *          from XF.settings.
         */
        return function(options) {
            // Fills missing options with default settings.
            _.defaults(options, {
                animations: {},
                device: {},
                history: {
                    pushState: false
                },
                router: {},
                debug: true
            });

            if (_.has(XF, 'log')) {
                XF.log.enabled = options.debug;
            }

            _.defaults(options.animations, {
                standardAnimation: ''
            });

            // Initializes XF objects.
            XF.device.init(options.device.types);
            XF.storage.init();
            if (_.has(XF, 'touch')) {
                XF.touch.init();
            }
            if (_.has(XF, 'ui')) {
                XF.ui.init();
            }

            // Rewrites animations settings with specific animation for current
            // device.
            if (XF.device.type && _.has(XF.device.type, 'defaultAnimation')) {
                options.animations.standardAnimation =
                    XF.device.type.defaultAnimation;
            }

            // Creates router and initializes it.
            _createRouter(options.router);

            _placeAnchorHooks();

            XF.router.start(options.history);
            XF.pages.init(options.animations);

            // Initializes all components.
            XF.loadChildComponents(Dom.root);
            XF.on('xf:loadChildComponents', XF.loadChildComponents);

            // Fires events binded on application start.
            XF.trigger('app:started');
        };
    })();


    XF.App = function(options) {
        var extOptions;

        options = options || {};
        options.device = options.device || {};
        extOptions = _.clone(options);

        // options.settings
        _.extend(XF.settings, options.settings);

        extOptions = _.omit(extOptions, ['settings', 'device', 'animations', 'router', 'debug', 'history']);
        _.extend(this, extOptions);

        this.initialize();

        AppStart(options);
    };


    _.extend(XF.App.prototype, XF.Events);

    _.extend(XF.App.prototype, /** @lends XF.App.prototype */ {
        initialize: function() {


        }
    });

    /**
 This method allows to extend XF.App with saving the whole prototype chain
 @function
 @static
 */
    XF.App.extend = BB.Model.extend;


    /**
     @namespace Holds all the reusable util functions
     */
    XF.utils = {};

    /**
     @namespace Holds all the reusable util functions related to Adress Bar
     */
    XF.utils.addressBar = {};

    XF.utils.uniqueID = function() {
        return 'xf-' + Math.floor(Math.random() * 100000);
    };


    XF.Collection = BB.Collection.extend({

        _initProperties: function() {
            this.status = {
                loaded: false,
                loading: false,
                loadingFailed: false
            };

            if (!_.has(this, 'root')) {
                this.root = null;
            }
            if (!_.has(this, 'ajaxSettings')) {
                this.ajaxSettings = null;
            }
            this.component = null;
        },

        _bindListeners: function() {
            //this.on('change reset sync add', this.onDataChanged, this);
            this.on('refresh', this.refresh, this);
        },

        constructor: function(models, options) {
            this._initProperties();
            this._bindListeners();

            if (!options) {
                options = {};
            }

            if (options.component) {
                this.component = options.component;
            }
            _.omit(options, 'component');

            this.url = this.url ||
                XF.settings.property('dataUrlPrefix').replace(/(\/$)/g, '') + '/' + (_.has(this, 'component') && this.component !== null && _.has(this.component, 'name') ? this.component.name + '/' : '');

            if (_.has(this, 'component') && this.component !== null && this.component.options.updateOnShow) {
                Dom(this.component.selector()).bind('show', _.bind(this.refresh, this));
            }

            this.ajaxSettings = this.ajaxSettings || _.defaults({}, XF.settings.property('ajaxSettings'));

            if (_.has(this.ajaxSettings, 'success') && _.isFunction(this.ajaxSettings.success)) {
                var onDataLoaded = _.bind(this._onDataLoaded, this),
                    onSuccess = this.ajaxSettings.success;

                this.ajaxSettings.success = function() {
                    onDataLoaded();
                    onSuccess();
                };
            } else {
                this.ajaxSettings.success = _.bind(this._onDataLoaded, this);
            }

            BB.Collection.apply(this, arguments);
        },

        /**
     Constructs model instance
     @private
     */
        initialize: function() {

        },

        construct: function() {

        },

        /**
     Refreshes data from backend if necessary
     @private
     */
        refresh: function() {
            this.status.loaded = false;
            this.status.loading = true;

            this.reset();
            this.ajaxSettings.silent = false;
            this.fetch(this.ajaxSettings);
        },

        fetch: function(options) {
            options = _.defaults(options || {}, this.ajaxSettings);

            return Backbone.Collection.prototype.fetch.call(this, options);
        },

        _onDataLoaded: function() {
            this.status.loaded = true;
            this.status.loading = false;

            this.trigger('fetched');
        }

    });


    XF.Model = BB.Model.extend({

        _initProperties: function() {
            this.status = {
                loaded: false,
                loading: false,
                loadingFailed: false
            };

            if (!_.has(this, 'root')) {
                this.root = null;
            }
            if (!_.has(this, 'ajaxSettings')) {
                this.ajaxSettings = null;
            }
            this.component = null;
        },

        _bindListeners: function() {
            this.on('refresh', this.refresh, this);
        },

        constructor: function(attributes, options) {
            this._initProperties();
            this._bindListeners();

            if (!options) {
                options = {};
            }

            if (options.component) {
                this.component = options.component;
            }
            _.omit(options, 'component');

            this.urlRoot = this.urlRoot || XF.settings.property('dataUrlPrefix').replace(/(\/$)/g, '') + '/' + (_.has(this, 'component') && this.component !== null && _.has(this.component, 'name') ? this.component.name + '/' : '');

            if (_.has(this, 'component') && this.component !== null && this.component.options.updateOnShow) {
                Dom(this.component.selector()).bind('show', _.bind(this.refresh, this));
            }

            this.ajaxSettings = this.ajaxSettings || XF.settings.property('ajaxSettings');

            if (_.has(this.ajaxSettings, 'success') && _.isFunction(this.ajaxSettings.success)) {
                var onSuccess = this.ajaxSettings.success,
                    onDataLoaded = _.bind(this._onDataLoaded, this);
                this.ajaxSettings.success = function() {
                    onDataLoaded();
                    onSuccess();
                };
            } else {
                this.ajaxSettings.success = _.bind(this._onDataLoaded, this);
            }

            BB.Model.apply(this, arguments);
        },

        /**
     Constructs model instance
     @private
     */
        initialize: function() {

        },

        construct: function() {

        },

        /**
     Refreshes data from backend if necessary
     @private
     */
        refresh: function() {
            this.status.loaded = false;
            this.status.loading = true;

            this.fetch(this.ajaxSettings);
        },

        fetch: function(options) {
            options = _.defaults(options || {}, this.ajaxSettings);

            return Backbone.Collection.prototype.fetch.call(this, options);
        },

        _onDataLoaded: function() {
            this.status.loaded = true;
            this.status.loading = false;

            this.trigger('fetched');
        }

    });


    /**
     Implements view workaround flow.
     @class
     @static
     @augments XF.Events
     */

    XF.View = BB.View.extend({

        url: function() {
            return XF.settings.property('templateUrlPrefix') + XF.device.type.templatePath + this.component.name + XF.settings.property('templateUrlPostfix');
        },

        /**
         Flag that determines whether the Model update should be ignored by the View (in this case you may launch {@link XF.View#refresh} manualy)
         @default false
         @type Boolean
         */

        _bindListeners: function() {
            if (this.component.options.autorender) {
                if (this.component.collection) {
                    this.listenTo(this.component.collection, 'fetched', this.refresh);
                } else if (this.component.model) {
                    this.listenTo(this.component.model, 'fetched', this.refresh);
                }
            }

            this.on('refresh', this.refresh, this);
        },

        _initProperties: function() {
            var template = {
                src: null,
                compiled: null,
                cache: true
            };

            this.template = this.template || {};
            this.template = _.defaults(this.template, template);

            this.status = {
                loaded: false,
                loading: false,
                loadingFailed: false
            };

            this.component = null;
        },

        constructor: function(options) {
            // Sorry, BB extend makes all properties static
            this._initProperties();

            this.setElement('[data-id=' + options.attributes['data-id'] + ']', false);


            if (options.component) {
                this.component = options.component;
            }
            _.omit(options, 'component');

            this._bindListeners();

            this.load();

            BB.View.apply(this, arguments);
        },

        initialize: function() {

        },

        construct: function() {

        },

        load: function() {

            if (this.template.src) {
                this.status.loading = false;
                this.status.loaded = true;
                this.trigger('loaded');
                return;
            }

            var url = (_.isFunction(this.url)) ? this.url() : this.url;

            if (!url) {
                this.status.loadingFailed = true;
                this.trigger('loaded');
                return;
            }

            // trying to get template from cache
            if (!XF.settings.noCache) {
                if (this.template.cache && _.has(XF, 'storage')) {
                    var cachedTemplate = XF.storage.get(url);
                    if (cachedTemplate) {
                        this.template.src = cachedTemplate;
                        this.status.loaded = true;
                        this.trigger('loaded');
                        return;
                    }
                }
            }

            if (!this.status.loaded && !this.status.loading) {

                this.status.loading = true;

                var $this = this;

                Dom.ajax({
                    url: url,
                    complete: function(jqXHR, textStatus) {
                        if (!$this.component) {
                            throw 'XF.View "component" linkage lost';
                        }
                        if (textStatus == 'success') {
                            var template = jqXHR.responseText;

                            // saving template into cache if the option is turned on
                            if (!XF.settings.noCache) {
                                if ($this.template.cache && _.has(XF, 'storage')) {
                                    XF.storage.set(url, template);
                                }
                            }

                            $this.template.src = jqXHR.responseText;
                            $this.status.loading = false;
                            $this.status.loaded = true;
                            $this.afterLoadTemplate();
                            $this.trigger('loaded');
                        } else {
                            $this.template.src = null;
                            $this.status.loading = false;
                            $this.status.loaded = false;
                            $this.status.loadingFailed = true;
                            $this.afterLoadTemplateFailed();
                            $this.trigger('loaded');
                        }
                    }
                });
            }
        },

        /**
         Compiles component template if necessary & executes it with current component instance model
         @static
         */
        getMarkup: function() {
            var data = {};

            if (!this.template.compiled) {
                this.template.compiled = _.template(this.template.src);
            }

            if (this.component.collection) {
                data = this.component.collection.toJSON();
            } else if (this.component.model) {
                data = this.component.model.toJSON();
            }

            return this.template.compiled({
                data: data,
                options: this.component.options
            });
        },

        /**
         HOOK: override to add logic before template load
         */
        beforeLoadTemplate: function() {},


        /**
         HOOK: override to add logic after template load
         */
        afterLoadTemplate: function() {},

        /**
         HOOK: override to add logic for the case when it's impossible to load template
         */
        afterLoadTemplateFailed: function() {
            XF.log('view: could not load template for "' + this.component.id + '"');
        },

        /**
         Renders component into placeholder + calling all the necessary hooks & events
         */
        refresh: function() {

            if (this.status.loaded && this.template.src) {
                if ((!this.component.collection && !this.component.model) || (this.component.collection && this.component.collection.status.loaded) || (this.component.model && this.component.model.status.loaded)) {
                    this.beforeRender();
                    this.render();
                    this.afterRender();
                }
            }
        },

        /**
         HOOK: override to add logic before render
         */
        beforeRender: function() {},


        /**
         Identifies current render vesion
         @private
         */
        renderVersion: 0,

        /**
         Renders component into placeholder
         @private
         */
        render: function() {
            if (this.component) {
                this.component._removeChildComponents();
            }

            this.$el.html(this.getMarkup());
            XF.trigger('ui:enhance', this.$el);
            this.renderVersion++;

            this.trigger('rendered');

            return this;
        },


        /**
         HOOK: override to add logic after render
         */
        afterRender: function() {}

    });


    /**
     Base Component.
     @class
     @static
     @augments XF.Events
     @see <a href="http://documentcloud.github.com/backbone/#Events">XF.Events Documentation</a>
     @param {String} name Name of the component
     @param {String} id ID of the component instance
     */
    XF.Component = function(name, id) {
        /**
         Would be dispatched once when the Component inited
         @name XF.Component#init
         @event
         */

        /**
         Would be dispatched once when the Component constructed
         @name XF.Component#construct
         @event
         */

        /**
         Would be dispatched after each render
         @name XF.Component#refresh
         @event
         */

        /**
         Name of the component.
         @default 'default_name'
         @type String
         */
        this.name = name || 'default_name';

        /**
         ID of the component.
         @default 'default_id'
         @type String
         */
        this.id = id || 'default_id';

        // merging defaults with custom instance options and class options
        this.options = _.defaults(XF.getOptionsByID(this.id), this.options, this.defaults);
    };



    _.extend(XF.Component.prototype, XF.Events);

    _.extend(XF.Component.prototype, /** @lends XF.Component.prototype */ {

        /**
         Object containing has-map of component options that can be different for each instance & should be set with {@link XF.setOptionsByID}
         @type Object
         */
        defaults: {
            autoload: true,
            autorender: true,
            updateOnShow: false
        },

        options: {

        },

        /**
         Returns component selector
         @return {String} Selector string that can be used for $.find() for example
         */
        selector: function() {
            return '[data-id=' + this.id + ']';
        },

        /**
         Defenition of custom Model class extending {@link XF.Model}
         */
        Model: null,

        /**
         Instance of {@link XF.Model} or its subclass
         @type XF.Model
         */
        model: null,

        /**
         Defenition of custom Collection class extending {@link XF.Collection}
         */
        Collection: XF.Collection,

        /**
         Instance of {@link XF.Collection} or its subclass
         @type XF.Collection
         */
        collection: null,

        /**
         Defenition of custom View class extending {@link XF.View}
         */
        View: XF.View,

        /**
         Instance of {@link XF.View} or its subclass
         @type XF.View
         */
        view: null,

        _bindListeners: function() {
            XF.on('component:' + this.id + ':refresh', this.refresh, this);
            this.listenTo(this, 'refresh', this.refresh);
        },

        /**
         Constructs component instance
         @private
         */

        initialize: function() {

        },

        construct: function() {

        },

        _constructor: function() {

            if (this.Collection) {
                this.collection = new this.Collection({}, {
                    component: this
                });
                this.collection.construct();
            } else if (this.Model) {
                this.model = new this.Model({}, {
                    component: this
                });
                this.model.construct();
            }

            if (this.View) {
                var params = {
                    attributes: {
                        'data-id': this.id
                    },
                    component: this
                };

                if (this.collection) {
                    params.collection = this.collection;
                } else if (this.model) {
                    params.model = this.model;
                }

                this.view = new this.View(params);
                this.view.construct();
            }

            this._bindListeners();

            this.construct();
            XF.trigger('component:' + this.id + ':constructed');

            // TODO: decide where to place it
            this.initialize();

            if (this.view) {
                this.view.listenToOnce(this.view, 'loaded', this.view.refresh);
                this.view.on('rendered', _.bind(function() {
                    XF.trigger('component:' + this.id + ':rendered');
                }, this));
            }

            if (this.collection && this.options.autoload) {
                this.collection.refresh();
            } else if (this.model && this.options.autoload) {
                this.model.refresh();
            } else if (this.view) {
                this.view.refresh();
            }
        },

        _removeChildComponents: function() {
            if (this.view) {
                var ids = [];
                this.view.$el.find('[data-component]').each(function() {
                    ids.push($(this).data('id'));
                });
                XF._removeComponents(ids);
            }
        },


        /**
         Refreshes data and then rerenders view
         @private
         */
        refresh: function() {
            if (this.collection && !this.collection.status.loading) {
                this.collection.refresh();
            } else if (this.model && !this.model.status.loading) {
                this.model.refresh();
            } else if (this.view && !this.view.status.loading) {
                this.view.refresh();
            }
        }


    });

    /**
     This method allows to extend XF.Component with saving the whole prototype chain
     @function
     @static
     */
    XF.Component.extend = BB.Model.extend;


}).call(this, window, $, Backbone);