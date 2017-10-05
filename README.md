# Javascript Value Locator

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

![Branch : release](https://img.shields.io/badge/Branch-release-blue.svg)
[![version](https://img.shields.io/badge/version-1.4.1-blue.svg)](https://github.com/AlexisTessier/javascript-value-locator#readme)
[![npm version](https://badge.fury.io/js/javascript-value-locator.svg)](https://badge.fury.io/js/javascript-value-locator)

[![Build Status](https://travis-ci.org/AlexisTessier/javascript-value-locator.svg?branch=release)](https://travis-ci.org/AlexisTessier/javascript-value-locator)
[![Coverage Status](https://coveralls.io/repos/AlexisTessier/javascript-value-locator/badge.svg?branch=release&service=github)](https://coveralls.io/github/AlexisTessier/javascript-value-locator?branch=release)

[![Dependency Status](https://david-dm.org/AlexisTessier/javascript-value-locator.svg)](https://david-dm.org/AlexisTessier/javascript-value-locator)
[![devDependency Status](https://david-dm.org/AlexisTessier/javascript-value-locator/dev-status.svg)](https://david-dm.org/AlexisTessier/javascript-value-locator#info=devDependencies)

Load javascript values from multiples sources and using multiple protocols

-   [Introduction](#introduction)
-   [Purpose and use cases](#purpose-and-use-cases)
-   [Get started](#get-started)
-   [About the documentation](#about-the-documentation)
-   [Documentation](#documentation)
-   [License](#license)

## Introduction

This module provide a minimalist api to load (**asynchronously only**) javascript values from different sources, using **javascript value locators** - **_JVL_**. A **_JVL_** is an object or a string (matching a specific format), which represent a way to load a javascript value. It's composed both of a **protocol** and a **target**.

```javascript
// this is a jvl object
{
    protocol: 'protocol-name',
    target: 'full/path/to/module/exporting/the/targeted/value'
}

// this is the equivalent jvl string
'protocol-name:full/path/to/module/exporting/the/targeted/value'
```

You can see this module as a kind of [webpack](https://webpack.js.org/) at the run time, where protocols are loaders, and where instead of doing this :

```javascript
require.ensure([], require => {
    const value = require('module/path');

    // do something with the value
})
```

You do this : <a name="introduction-examples"></a>

```javascript
const jvl = require('javascript-value-locator');

jvl.load('require:module/path').then(value => {
    // do something with the value
})
```

And for example, if you want to load a yaml, you could use a specific protocol, as you would have used a yaml-loader in webpack

```javascript
const jvl = require('javascript-value-locator');

/**
 * Assuming that a "require-yaml" protocol was defined in the first place
 * (which is currently not the case)
 */
jvl.load('require-yaml:module/path.yaml').then(value => {
    // do something with the value
})
```

**_Note that the comparison with webpack is only here for explanatory purpose, this module doesn't aim the same use cases._**

## Purpose and use cases

The [previous examples](#introduction-examples) are here only for the sake of explaining the module basic usage. If you want to require a module in node.js, you should more than probably just do a require (unless you want to load it asynchronously).
**_The following use case is the one for what the module was created in the first place_**.

-   Use the JVL string format to "require" a module in a cli command option

Assuming you want to provide a command with an option which can be a javascript value. If the option is a number, it's ok to do that :

    cli command input --javascript-value-option=5

But if the option is a complex/dynamic object, using JVL allow you to do that :

    cli command input --javascript-value-option=require:full/path/to/module

The cli users have in that way a more fine control over the module he wants use to do some task.
A logger module is a good example. Imagine you implement a cli command which only log the input, you could have something like : <a name="custom-protocols-example"></a>

```javascript
// ./load-override.js
// create a custom load function

const path = require('path');
const {load, setLocatorDefaultProtocol, defaultProtocols} = require('javascript-value-locator');

module.exports = function customLoad(locator, options){
    // if the locator is an object and doesn't have protocol property, 
    // or if it's a string without protocol ahead, the 'custom-protocol' will be used

    return load(setLocatorDefaultProtocol(locator, 'custom-protocol'), options, {
        protocols: Object.assign({}, defaultProtocols, {
            ['custom-protocol'](resolve, reject, target){
                
                // define a way to "require" the javascript value targeted
                // for instance, require the path from a custom directory
                // It will allow to provide some built-in log functions

                defaultProtocols.require(resolve, reject,
                    path.join(__dirname, '../custom/directory/path', target)
                );
            }
        })
    })
}
```

```javascript
// ./log-command.js
// then use the custom load function in your log command implementation

const load = require('./load-override');

module.exports = async function logCommand(
    input,
    log = (...logs) => console.log(...logs) // provide a default logger
){
    // enable silent mode
    if(log === false){
        log = ()=>{};
    }

    // enable the user to directly use a function as log option
    if(typeof log !== 'function'){
        log = await load(log);
    }

    assert(typeof log === 'function');

    return log(input);
}
```

Make the cli implementation which will call this async function, then your users can do :

-   this will use a simple console.log


    cli log "hello world"

-   this will not log anything


    cli log "hello world" --log=false

-   this will use a built-in logger defined in custom/directory/path


    cli log "hello world" --log=custom-protocol:log-one

-   this will use an other built-in logger defined in custom/directory/path


    cli log "hello world" --log=log-two

-   this will use a logger defined by the user


    cli log "hello world" --log=require:path/to/a/custom/logger

#### Speculative use cases

The module wasn't thinked in order to do that, but it may could be used to accomplish some of these things :

-   Create and use some custom protocols able to load javascript from the cloud


-   Use in the browser to load assets (still with custom protocols)


-   And probably more...

## Get started

### Install

-   using npm


    npm install --save javascript-value-locator

-   or using yarn


    yarn add javascript-value-locator

### Load one or more values from JVL

TO DO - [see the load function documentation for now](#load)

### Available protocols

Currently, the only implemented protocol is the [require](#require). If needed, [add others](#use-custom-protocols) and eventually open a issue or event better, a PR.

### Use custom protocols

You can use the inject.protocols option of the [load function](#load). [Look here for concrete example](#custom-protocols-example).

### Load a value synchronously

JVL is not aimed to do that.

## About the documentation

The following documentation was generated using [documentation.js](http://documentation.js.org/).

### Naming conventions

-   CapitalizedCamelCasedNames are used for [types](https://en.wikipedia.org/wiki/Duck_typing)


-   dashified-case-names are used for filenames


-   camelCasedNames are used for methods and properties

## Documentation

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### JavascriptValueLocator

A JavascriptValueLocator (JVL) is a [string](#javascriptvaluelocatorstring) or an [object](#javascriptvaluelocatorobject) which describe a way to access to a javascript value.
It must provide at least:

-   [A protocol (JavascriptValueLocatorProtocol)](#javascriptvaluelocatorprotocol) 
-   [A target as a string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

Type: ([JavascriptValueLocatorString](#javascriptvaluelocatorstring) \| [JavascriptValueLocatorObject](#javascriptvaluelocatorobject))

### JavascriptValueLocatorString

A JavascriptValueLocatorString (JVL string) is a string which describe a way to access to a javascript value. It must matches the following format:

-   protocol-name:target-name [see JavascriptValueLocator](#javascriptvaluelocator)

Type: [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

**Examples**

```javascript
// Those are valid JVL strings
"require:/path/to/file"
"any-defined-protocol-name:any-target-name_case is-NotImportant"

// Those are unvalid JVL strings
":target-name" // Missing protocol
"protocol-name" // Missing target
```

### JavascriptValueLocatorObject

A JavascriptValueLocatorObject is an object which describe a way to access to a javascript value.

Type: [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

**Properties**

-   `protocol` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [JavascriptValueLocatorProtocol](#javascriptvaluelocatorprotocol))** The name of the protocol or the protocol himself (as a function which respect the [JavascriptValueLocatorProtocol definition](#javascriptvaluelocatorprotocol))
-   `target` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The javascript value targeted.

### JavascriptValueLocatorProtocol

A JavascriptValueLocatorProtocol is a function which take the following arguments (resolve, reject, target, options) and resolve the targeted javascript value or reject an error

Type: [function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)

**Parameters**

-   `resolve` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** A resolve function which will be called with the targeted javascript value as single argument
-   `reject` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** A reject function which will be called with a error as single argument if the javascript value load failed
-   `target` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The target to load and resolve. A target must be a unique identifier/path (or maybe other things depending on the used protocol) to the requested javascript value. You must use it to know which value is requested
-   `options` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The options passed to the protocol.

### javascript-value-locator

The JVL API is an object providing the following properties:

-   [load](#load)
-   [setLocatorDefaultProtocol](#setlocatordefaultprotocol)
-   [parse](#parse)
-   [stringify](#stringify)
-   [defaultProtocols](#defaultprotocols)

**Examples**

```javascript
// require the public API
const JVL = require('javascript-value-locator')
// then use a method of the API
JVL.load('npm:string-humanize@1.0.0').then(_ => console.log(_('hello-world'))) // Hello world
```

### load

This function loads a javascript value in a async way

**Parameters**

-   `locator` **([JavascriptValueLocator](#javascriptvaluelocator) \| [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[JavascriptValueLocator](#javascriptvaluelocator)>)** A javascript value locator as an object or a string which follow the JVL format. Can also be an Array of locators.
-   `options` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?** The javascript options object which will be passed to the locator protocol function. If locator is an object, it can provide directly an options object which will be merged with the options parameter. (optional, default `{}`)
-   `inject` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?** A javascript object containing the load function dependencies. (optional, default `{}`)
    -   `inject.protocols` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** A Dictionnary where keys are the names of the protocols and value are the protocols functions. If locator is an object, it can provide directly a protocols key which will be merged with the inject.protocols parameter. (optional, default `defaultProtocols`)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** A promise resolving the javascript value targeted by the locator. If locator was an Array, the promise resolve an Array containing all the targeted values in the same order as defined.

### setLocatorDefaultProtocol

This function returns a locator with the specified default protocol if the input locator doesn't provide one.

**Parameters**

-   `locator` **(([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)) | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object))>)** A potential JVL which must at least provide a target. It will be transformed in a valid JVL. If it's an Array, the function will return an Array of valid JVL. The output JVl will keep the type of the original input locator.
-   `defaultProtocol` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** If no protocol is found in the locator, then the default protocol will be setted as the current locator protocol. Note that you can't provide a protocol as a function using the setLocatorDefaultProtocol function.

Returns **([JavascriptValueLocator](#javascriptvaluelocator) \| [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[JavascriptValueLocator](#javascriptvaluelocator)>)** The corresponding locator as an object.

### parse

This function returns a locator object from a JVL string.

**Parameters**

-   `JVL` **[JavascriptValueLocatorString](#javascriptvaluelocatorstring)** The locator as string to parse.

Returns **[JavascriptValueLocatorObject](#javascriptvaluelocatorobject)** The corresponding locator as an object.

### stringify

This function transforms a locator object to a JVL string.

**Parameters**

-   `locator` **[JavascriptValueLocatorObject](#javascriptvaluelocatorobject)** The locator object to stringify.

Returns **[JavascriptValueLocatorString](#javascriptvaluelocatorstring)** The corresponding JVL string.

### defaultProtocols

This object contains the defaults protocols defined by the javascript-value-locator package :

-   [require](#require)

You can use it, for example, in order to create a new load functions with new custom protocols.

**Examples**

```javascript
//import the load function and the default-protocols
const {load, defaultProtocols} = require('javascript-value-locator')

//define some custom protocols
const customProtocols = {
    newProtocol: function(resolve, reject, target, options){
        resolve(getTheValueUsingTheTargetAndOptions)
        //or
        reject()
    }
}

//create and export a function which call the original function,
//but passing to it a new protocols object dependency
module.exports = function customLoad(locator, options){
    return load(locator, options, {
        protocols: Object.assign({}, defaultProtocols, customProtocols)
    })
}
```

### require

This function is a [JavascriptValueLocatorProtocol](#javascriptvaluelocatorprotocol) that use the node require function to load the target.

**Parameters**

-   `resolve` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** A resolve function which will be called with the targeted javascript value as single argument.
-   `reject` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** A reject function which will be called with a error as single argument if the javascript value load failed.
-   `target` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The target to load and resolve. It must be a path to a valid node module.
-   `options` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?** A javascript object containing the require protocol options. (optional, default `{}`)
    -   `options.cwd` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The current working directory to use if the target path is not absolute. (optional, default `process.cwd()`)

## License

javascript-value-locator is released under [MIT](http://opensource.org/licenses/MIT). 
Copyright (c) 2017-present [Alexis Tessier](https://github.com/AlexisTessier)
