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
        // save default options
        this.defaults = options;

        // modr modules
        this.modules = {};

        // the target elements jQuery object
        this.$element = $(element);

        // init plugins
        this.loadModules( modules, options );
    }

    var methods = {
        loadModules: function( modules, options ) {
            var defaults = {};

            // merge module default options and hooks
            for(var i= 0, len=modules.length; i<len; ++i) {

                // extend default options
                if( typeof(modules[i].config.defaults) !== 'undefined' ) {
                    defaults[modules[i].config.module] = {};
                    $.extend(true, defaults[modules[i].config.module], modules[i].config.defaults);
                }

            }

            // extend all default module options
            this.options = $.extend(true, {}, defaults, options);

            // instantiate all modules
            for(i= 0, len=modules.length; i<len; ++i) {
                this.modules[modules[i].config.module] = new modules[i].module( this );
            }
        },

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