(function($) {
    'use strict';

    // the modr config object
    var config = {
        plugin: 'pluginName',
        module: 'moduleName',
        defaults: {
            defaultOption: 'someValue'
        }
    };

    // the modules constructor
    function Plugin( rootContext ) {

        var self = this;

        // save root context of jQuery boilerplate skeleton for later usage
        self.root = rootContext;

        // wait for global init event
        self.root.wrapEvents('init.moduleName.pluginName', function() {
            self.init();
        });

    }

    // the modules methods
    var methods = {

        init: function() {
            console.log('init module');
        },

        destroy: function() {
            console.log('destroy module');
        }

    };

    // extend plugins prototype
    $.extend( Plugin.prototype, methods );

    // register module in modr
    modr.registerPlugin( config, Plugin );

})(jQuery);