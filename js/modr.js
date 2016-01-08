(function(window) {
    'use strict';

    if( typeof(window.modr) !== 'undefined' ) {
        return;
    }

    /**
     * Modr Singleton
     */
    var modr = function Modr() {
        var plugins = {};
        var wrappers = {};

        // TODO Add some config object to init plugin(s) with custom wrappers
        // or init only single plugin, e.g. config = [{ plugin: wrapper }]
        // Prevent double init!!!!!! init flag?
        function init() {
            for(var pluginName in plugins) {
                if(plugins.hasOwnProperty(pluginName) && !plugin.initialized) {

                    var plugin = plugins[pluginName];
                    if( typeof(plugin.wrapper) === 'undefined' || typeof(wrappers[plugin.wrapper]) === 'undefined' ) {
                        throw 'Modr Wrapper "'+pluginName+'" for Plugin "'+plugin.wrapper+'" not available';
                    }

                    // init wrapper with plugin modules
                    wrappers[plugin.wrapper].init( pluginName, plugin.modules );
                    plugin.initialized = true;

                }
            }
        }

        function registerPlugin( config, mod ) {
            if( typeof(plugins[config.plugin]) === 'undefined' ) {
                plugins[config.plugin] = {
                    modules: [],
                    initialized: false
                };
            }

            // set default wrapper for plugin
            if( typeof(config.wrapper) !== 'undefined' ) {
                plugins[config.plugin].wrapper = config.wrapper;
            }

            // push configuration and module
            plugins[config.plugin].modules.push({
                config: config,
                module: mod
            });
        }

        function registerWrapper( type, fn ) {
            wrappers[type] = fn();
        }

        // public modr functions
        return {
            registerPlugin: registerPlugin,
            registerWrapper: registerWrapper,
            init: init
        };
    };

    window.modr = modr();

})(window);