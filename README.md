# modr framework
A lightweight modular javascript plugin wrapper framework.
 
`modr` was build to divide the complex structure of javascript plugins into smaller, specialized modular objects.

The main advantages are:
- Less functionality per module 
- Better code structure and quality 
- Use and load only those features you need - less data traffic 

Even the plugin wrapper skeleton is modular and can be reused between different plugins. 
So if you use multiple plugins with, e.g. the jQuery wrapper, you save even more bytes because the wrapper has to be loaded only once.  


## Usage

The main `modr` file `dist/modr.min.js` is just a singleton instance that registers plugins and wrappers. 
It also initializes the creation of all registered plugins with there corresponding wrappers.
 
Include it always BEFORE any other `modr` modules.  

```html
<script src="dist/modr.min.js">
<!-- modr modules come here -->
```

You can even reload or conditionally load other modules on runtime as long as the plugin wasn't initialized.
Init `modr` plugin(s) with the following function call:

```js
// init a single plugin with a specific wrapper
modr.init( 'wrapperName', 'pluginName' );

// or load a bunch of wrappers and plugins at once
modr.init({
  'wrapperName': [
    'pluginName'
  ]
});
```


# modr wrapper - `jQuery`

The jQuery wrapper was inspired by https://github.com/jquery-boilerplate/jquery-boilerplate
In this case the jQuery boilerplate is only the root skeleton for the plugin itself that:

- loads all available plugin modules
- merges and extends there options
- extends the jQuery prototype object
- provides global utility methods

Binding those plugins to elements is still the default jQuery boilerplate behaviour. 

 
## Usage 

``` js
// init
$('.element').myPluginName({
  'option1': 'someOption'
});

// call from outside
$('.element').data('myPluginName').someGlobalFunction();
```

## Basic functionality

The boilerplate skeleton object is given to any modules constructor as first parameter.
Within the boilerplate it is called `root`. This `root` object has two main properties:
 
- **this.options** - These are all the extended global and module options. Each module can hold its own options that get merged into this object.
For example, the module `core` has an option `someOption` and can be called from any module with `this.root.options.core.someOption`

- **this.$element** - The jquery element on which the plugin was initialized



## Global utility methods

#### `wrapEvents` function( eventName, fn, elem, thisArg, params ) { ... }

This method wraps jQuery events around a function call. It listens to `event.preventDefault()`, 
so the execution of the given function can be prevented by the `before` event.  

- **eventName** - will be prefixed with "before." and "after."
- **fn** - the function to call between the events
- **elem** - optional, the jQuery element to bind the event to, defaults to this.$element
- **thisArg** - optional, the thisArg for fn.apply, defaults to root module
- **params** - optional, array of parameters. Will be set to both events and the given function
 

```js
// just an easy example
this.root.wrapEvents('demo.moduleName.pluginName', function() { 
  /* do something */ 
}, $someElement, thisArg, ['param1', 'param2']);

// this will trigger the following event first:
$someElement.trigger( 'before.demo.moduleName.pluginName', ['param1', 'param2'] );

// if event.preventDefault() was called inside any listener, the execution will stop here
// if not, the given function will be called 
fn.apply(thisArg, ['param1', 'param2']);

// the after event is fired at the end
$someElement.trigger( 'after.demo.moduleName.pluginName', ['param1', 'param2'] );
```

# modr plugin boilerplate

```js
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
        this.root = rootContext;

        // wait for global init event
        this.root.wrapEvents('init.moduleName.pluginName', function() {
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
```
