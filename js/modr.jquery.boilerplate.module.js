(function($) {
    'use strict';

    var config = {
        plugin: 'pluginName',
        module: 'moduleName',
        prio: 100,
        defaults: {
            defaultOption: 'someValue'
        }
    };

    // the modules constructor
    function Plugin( rootContext ) {
        this.root = rootContext;
    }

    // the modules methods
    var methods = {

        init: function() {
            var self = this;
            var root = this.root;

            root.wrapEvents('init.moduleName.pluginName', function() {

                console.log('init module');

            });
        },

        destroy: function() {
            console.log('destroy module');
        }

    };

    // extend plugins prototype
    $.extend( Plugin.prototype, methods );

    // store module for modr
    modr.registerPlugin( config, Plugin );

})(jQuery);