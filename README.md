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
It also kickstarts the creation of registered plugins with there corresponding wrappers.
 
Include it always BEFORE any other `modr` modules.  

```html
<script src="dist/modr.min.js">
<!-- modr modules come here -->
```

You can even reload or conditionally load other modules on runtime as long as the plugin wasn't initialized.
Init `modr` plugin(s) with the following function call:

```js
// init a single plugin with a specific wrapper
modr.init( 'targetPluginName', 'wrapperName', { 
  pluginName: [ 'module1', 'module2' ],
  otherPluginName: [ 'moduleX' ]
});

// a real world example that creates 
// jQuery plugin named "chop" with "jQuery" wrapper and 3 modules from 2 plugins
modr.init('chop', 'jquery', {
  chop: [ 'accordion', 'url' ],
  helper: [ 'events' ]
});
```

# modr wrapper - `jQuery`

The jQuery wrapper was inspired by https://github.com/jquery-boilerplate/jquery-boilerplate
In this case the jQuery boilerplate is only the root skeleton for the plugin itself that:

- loads all available plugin modules
- merges and extends there options
- extends the jQuery prototype object

 
## Usage 

```html
<!-- insert modr jquery wrapper script -->
<script src="dist/wrapper/modr.jquery.min.js">
```

``` js
// init plugin to given element 
$('.element').targetPluginName({
  pluginName: {
    module1: {
      someOption: 'value'
    },
    module2: {
      otherOption: 'value'
    }
  }
});

// call plugin directly after creation
$('.element').data('targetPluginName').modules.moduleName.someFunction();
```

## Special options

The modules constructors differ from the default jQuery boilerplate. The constructor is set automatically by the jquery wrapper.
Per convention any module should have an `init()` function.
It's possible to call this `init()` function directly on startup with the `init` option.

``` js
// init component directly with "init" option 
// that executes given module directly after plugin creation 
$('.element').targetPluginName({
  init: { pluginName: 'moduleName' }
});
```

## Default events

The jQuery wrapper skeleton fires two `ready` events after it was initialized:
 
- **ready.targetPluginName** - this event is fired on the element it was created

```js
// listen to ready event
$('.element').on('ready.targetPluginName', function() { /* ... */ });

// init plugin - ready event is fired directly after plugin creation
$('.element').targetPluginName();
```

- **all.ready.targetPluginName** - this event is fired on window object after plugin was initialized on all elements

```js
// listen to ready event
$(window).on('all.ready.targetPluginName', function() { /* ... */ });

// init plugin - all.ready event is fired directly after plugin was created and attached to all $('.element') elements
$('.element').targetPluginName();
```



## Basic functionality

The boilerplate skeleton object can be seen as the parent of all loaded modules. 
Within the boilerplate the skeleton is called `root`. 
 
- **root.pluginName** - The plugin name that was set with first parameter of `modr.init()`
  
- **root.modules** - All modules that were configured within the third parameter of `modr.init()`
 
- **root.options** - These are all the extended global and module options. 
Each module can hold its own options that get merged into this object.
For example, the module `core` has an option `someOption` and can be called from any module with `this.root.options.core.someOption`

- **root.$element** - The jquery element on which the plugin was initialized


All modules are initialized with following variables that can be accessed directly by: 

- **this.root** - The parent object of all modules, called `root` (see description above) 

- **this.$element** - The jquery element on which the plugin was initialized

- **this.options** - The extended options of the given module



# Available modr plugins

- https://github.com/janrembold/modr.jquery.chop - Accordion and Tabbed Navigation with responsive hybrid mode and URL parameter support
- https://github.com/janrembold/modr.jquery.helper - Modr jQuery helper functions for event handling
