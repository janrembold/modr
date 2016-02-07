(function($, modr, undefined) {
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
    function Plugin(element, modules, options, pluginName) {

        var self = this;

        // modr modules
        self.modules = {};

        // set own plugin name
        self.pluginName = pluginName;

        // set global options
        self.options = options;

        // the target elements jQuery object
        self.$element = $(element);

        // init plugins
        self._loadModules( modules, options );

        // execute optional prepare functions
        self._prepare();

        // check init declaration in options to call init() immediately
        self._autoInit();
    }

    var methods = {
        _loadModules: function( modules, options ) {

            var self = this;

            // instantiate all modules
            for( var pluginName in modules ) {
                for ( var moduleName in modules[pluginName] ) {

                    var mod = modules[pluginName][moduleName];
                    var defaults = mod.config.defaults || {};

                    // extend default options with custom options set with plugin init
                    if( options[pluginName] && options[pluginName][moduleName] ) {
                        $.extend(true, defaults, options[pluginName][moduleName]);
                    }

                    // create new module skeleton
                    var Skeleton = function( rootContext, options ) {

                        var self = this;
                        self.root = rootContext;
                        self.$element = self.root.$element;
                        self.options = options;
                    };

                    // extend default skelton with module functions
                    $.extend( Skeleton.prototype, mod.module);

                    // init module
                    self.modules[pluginName] = self.modules[pluginName] || {};
                    self.modules[pluginName][moduleName] = new Skeleton( self, defaults );
                }
            }
        },

        _prepare: function() {

            var self = this;

            for( var pluginName in self.modules ) {

                var plugin = self.modules[pluginName];
                for ( var moduleName in plugin ) {

                    if( $.isFunction( plugin[moduleName].prepare ) ) {
                        plugin[moduleName].prepare();
                    }
                }
            }
        },

        _autoInit: function() {

            var self = this;

            if( $.isPlainObject( self.options.init ) && Object.keys( self.options.init ).length === 1 ) {
                var pluginName = Object.keys(self.options.init)[0];
                var moduleName = self.options.init[pluginName];

                if( self.modules[pluginName] && self.modules[pluginName][moduleName] ) {
                    self.modules[pluginName][moduleName].init();
                }
            }
        },

        destroy: function() {

            // TODO add global destroy function
            //for(var i = 0, len = this.modules.length; i < len; i++) {
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
                            $.data(this, pluginName, new Plugin(this, modules, options, pluginName));

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