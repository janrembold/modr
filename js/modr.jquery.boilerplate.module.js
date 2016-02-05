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
    function Module( rootContext, options ) {

        var self = this;

        // save root context of jQuery boilerplate skeleton for later usage
        self.root = rootContext;

        // save modules options
        self.options = options;

        // optional, wait for global init event
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
    $.extend( Module.prototype, methods );

    // register module in modr
    modr.registerModule( config, Module );

})(jQuery);