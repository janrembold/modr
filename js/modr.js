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

                    for( var i=0, len=config[pluginName].length; i<len; i++ ) {

                        var moduleName = config[pluginName][i];
                        var module = modules[pluginName][moduleName];
                        _isUndefined( module , 'Modr module "' + pluginName + '->' + moduleName + '" not loaded');

                        if( typeof(mods[pluginName]) === 'undefined' ) {
                            mods[pluginName] = {};
                        }

                        // check dependencies
                        var dependencies = module.config.dependencies;
                        if( typeof( dependencies ) !== 'undefined' ) {

                            for( var depPluginName in dependencies ) {

                                var depPlugin = dependencies[depPluginName];
                                for(var j=0, depLen=depPlugin.length; j<depLen; j++) {

                                    var depModuleName = depPlugin[j];
                                    if( !config[depPluginName] || config[depPluginName].indexOf(depModuleName) === -1 ) {
                                        throw 'Dependency "'+depPluginName + '->' + depModuleName+'" not configured for plugin "' + pluginName + '"';
                                    }
                                }
                            }
                        }

                        // add module to module list
                        mods[pluginName][moduleName] = modules[pluginName][moduleName];
                    }
                }
            }

            // init all modules with given wrapper
            wrappers[wrapper].init( plugin, mods );
        }

        function registerModule( config, module ) {

            var pluginName = config.plugin;
            var moduleName = config.module;

            if( typeof(modules[pluginName]) === 'undefined' ) {
                modules[pluginName] = {};
            }

            if( !_isDefined(modules[pluginName][moduleName], 'Modr module "' + pluginName + '->' + moduleName + '" already loaded') ) {
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