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

        function init( wrapper, plugin ) {

            var config = {};

            if( typeof(wrapper) === 'object' ) {
                config = wrapper;
            } else if( typeof(plugin) === 'string' && typeof(wrapper) === 'string' ) {
                config[wrapper] = [ plugin ];
            }

            _loadPlugins( config );

        }

        function _loadPlugins( config ) {

            for( var wrapper in config ) {
                if( config.hasOwnProperty(wrapper) ) {

                    if( typeof(wrappers[wrapper]) === 'undefined' ) {
                        throw 'Modr Wrapper "'+wrapper+'" not available';
                    }

                    for( var i=0, len=config[wrapper].length; i<len; ++i ) {

                        var pluginName = config[wrapper][i];
                        if( typeof(plugins[pluginName]) === 'undefined' ) {
                            throw 'Modr Plugin "'+pluginName+'" not available';
                        }

                        // init plugin only once
                        if( plugins[pluginName].initialized ) {
                            continue;
                        }

                        // init wrapper with plugin modules
                        wrappers[wrapper].init( pluginName, plugins[pluginName].modules );
                        plugins[pluginName].initialized = true;

                    }

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