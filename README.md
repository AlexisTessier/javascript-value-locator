# Javascript Value Locator

Load javascript values from multiples sources and using multiple protocols

## Introduction

A Javascript Value Locator (JVL) is an object or a string (matching a specific format), which identify a way to load a javascript value.

## About the documentation

### Naming conventions

-   CamelCasedValue are used for types <a href="https://en.wikipedia.org/wiki/Duck_typing" target="_blank">see ducktyping</a>

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

-   `locator` **[JavascriptValueLocator](#javascriptvaluelocator)** A javascript value locator as an object or a string which follow the JVL format.
-   `options` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?** The javascript options object which will be passed to the locator protocol function. If locator is an object, it can provide directly an options object which will be merged with the options parameter. (optional, default `{}`)
-   `inject` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?** A javascript object containing the load function dependencies. (optional, default `{}`)
    -   `inject.protocols` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** A Dictionnary where keys are the names of the protocols and value are the protocols functions. If locator is an object, it can provide directly a protocols key which will be merged with the inject.protocols parameter. (optional, default `defaultProtocols`)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** A promise resolving the javascript value targeted by the locator.

### parse

This function returns a locator object from a JVL string

**Parameters**

-   `JVL` **[JavascriptValueLocatorString](#javascriptvaluelocatorstring)** The locator as string to parse.

Returns **[JavascriptValueLocatorObject](#javascriptvaluelocatorobject)** The corresponding locator as an object.

### stringify

This function transforms a locator object to a JVL string

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

This function is a [JavascriptValueLocatorProtocol](#javascriptvaluelocatorprotocol) that use the node require function to load the target

**Parameters**

-   `resolve` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** A resolve function which will be called with the targeted javascript value as single argument
-   `reject` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** A reject function which will be called with a error as single argument if the javascript value load failed
-   `target` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The target to load and resolve. It must be a path to a valid node module.
