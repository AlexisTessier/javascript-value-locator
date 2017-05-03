# Javascript Object Locator

Load node modules or javascript object or json files from multiples sources and using multiple protocols

## Documentation

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### load

This function loads a module in a async way

**Parameters**

-   `locator` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object))** A javascript object locator as an object or a string. If it's an object, options can be directly provided in it.
-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** A javascript object containing some options
    -   `options.protocols`  A Dictionnary where keys are the names of the protocols and value are the protocols functions. Use it to override to override defaults protocols or to provide new. (optional, default `defaultProtocols`)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** A promise resolving the javascript object targeted by the locator
