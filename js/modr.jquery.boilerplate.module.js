(function($) {
    'use strict';

    // the modr config object
    var config = {
        plugin: 'pluginName',
        module: 'moduleName',
        defaults: {
            defaultOption: 'someValue'
        },
        dependencies: {
            pluginName: [ 'moduleName' ]
        }
    };

    // the modules methods
    modr.registerModule( config, {

        /** prepare function is optional and gets automatically
         *  executed after all modules were loaded by jQuery wrapper */
        prepare: function() {
            console.log('prepare module');
        },

        init: function() {
            console.log('init module');
        },

        destroy: function() {
            console.log('destroy module');
        }

    });

})(jQuery);