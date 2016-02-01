(function(window) {
    'use strict';

    if( typeof(window.modr) !== 'undefined' ) {
        return;
    }

    /**
     * Modr Singleton
     */
    var modr = function Modr() {
        var modules = {};
        var wrappers = {};

        function init( plugin, wrapper, config ) {

            _isUndefined( wrappers[wrapper], 'Modr wrapper "' + wrapper + '" not available');

            var mods = {};
            for( var pluginName in config ) {
                if (config.hasOwnProperty(pluginName)) {

                    for( var i=0, len=config[pluginName].length; i<len; ++i ) {

                        var moduleName = config[pluginName][i];
                        _isUndefined( modules[pluginName][moduleName], 'Modr module "' + moduleName + '" (Plugin: "' + pluginName + '") not loaded');

                        if( typeof(mods[pluginName]) === 'undefined' ) {
                            mods[pluginName] = {};
                        }

                        mods[pluginName][moduleName] = modules[pluginName][moduleName];
                    }
                }
            }

            wrappers[wrapper].init( plugin, mods );
        }

        function registerModule( config, module ) {

            var pluginName = config.plugin;
            var moduleName = config.module;

            if( typeof(modules[pluginName]) === 'undefined' ) {
                modules[pluginName] = {};
            }

            if( !_isDefined(modules[pluginName][moduleName], 'Modr module "' + moduleName + '" (Plugin: "' + pluginName + '") already loaded') ) {
                modules[pluginName][moduleName] = {
                    config: config,
                    module: module
                };
            }
        }

        function registerWrapper( type, fn ) {

            _isDefined( wrappers[type], 'Modr wrapper "' + type + '" already loaded');

            // execute wrapper function
            wrappers[type] = fn();
        }

        function _isUndefined( variable, message ) {
            if( typeof(variable) === 'undefined' ) {
                throw message;
            }
            return false;
        }

        function _isDefined( variable, message ) {
            if( typeof(variable) !== 'undefined' ) {
                throw message;
            }
            return false;
        }

        // public modr functions
        return {
            registerModule: registerModule,
            registerWrapper: registerWrapper,
            init: init
        };
    };

    window.modr = modr();

})(window);