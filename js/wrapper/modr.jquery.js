(function($, modr) {
    'use strict';

    if( typeof(modr) === 'undefined' ) {
        throw 'Modr not initialized';
    }

    if( typeof($) === 'undefined' ) {
        throw 'jQuery not initialized';
    }

    /**
     * Prepare jQuery Plugin Skeleton
     */
    function Plugin(element, modules, options) {

        // modr modules
        this.modules = {};

        // the target elements jQuery object
        this.$element = $(element);

        // init plugins
        this._loadModules( modules, options );
    }

    var methods = {
        _loadModules: function( modules, options ) {

            // extend all default module options
            this.options = {};

            // instantiate all modules
            for( var pluginName in modules ) {
                for ( var moduleName in modules[pluginName] ) {

                    var mod = modules[pluginName][moduleName];
                    var defaults = mod.config.defaults || {};

                    if( options[pluginName] && options[pluginName][moduleName] ) {
                        $.extend(true, defaults, options[pluginName][moduleName]);
                    }

                    if( typeof(this.modules[pluginName]) === 'undefined' ) {
                        this.modules[pluginName] = {};
                        this.options[pluginName] = {};
                    }

                    if( typeof(this.options[pluginName][moduleName]) === 'undefined' ) {
                        this.options[pluginName][moduleName] = {};
                    }

                    $.extend(true, this.options[pluginName][moduleName], defaults);

                    this.modules[pluginName][moduleName] = new mod.module( this, defaults );
                }
            }

            $.extend(true, this.options, options);

        },

        /**
         * Wrap events around a given function and listen to preventDefaults
         *
         * @param eventName - will be prefixed with "before." and "after."
         * @param fn - the function to call between the events
         * @param elem - optional, the jQuery element to bind the event to, defaults to this.$element
         * @param thisArg - optional, the thisArg for fn.apply, defaults to root module
         * @param params - optional, array of parameters. Will be set to both events and the given function
         * @returns {*|methods} the given scope
         */
        wrapEvents: function( eventName, fn, elem, thisArg, params ) {

            var scope = thisArg || this;
            var element = elem || this.$element;
            var event = $.Event( 'before.'+eventName );

            // trigger event before function is executed
            element.trigger( event, params );
            if ( event.isDefaultPrevented() ) {
                return;
            }

            // call wrapped function
            fn.apply(scope, params);

            // trigger event after function was executed
            element.trigger( 'after.'+eventName, params );

            return scope;
        },

        destroy: function() {

            // TODO add global destroy function
            //for(var i = 0, len = this.modules.length; i < len; ++i) {
            //    this.modules[i].destroy();
            //}

        }
    };

    // extend plugin prototype
    $.extend(Plugin.prototype, methods);

    // set modr wrapper
    modr.registerWrapper('jquery', function() {

        return {
            init: function( pluginName, modules ) {

                // bind modr plugins to jQuery prototype object
                $.fn[pluginName] = function(options) {
                    this.each(function() {
                        if(!$.data(this, pluginName)) {
                            $.data(this, pluginName, new Plugin(this, modules, options));

                            // trigger ready event on element
                            $(this).trigger('ready.'+pluginName);
                        }
                    });

                    // trigger ready event globally
                    if(this.length > 0) {
                        $(window).trigger('all.ready.'+pluginName);
                    }

                    return this;
                };

            }
        };
    });

})(jQuery, modr);