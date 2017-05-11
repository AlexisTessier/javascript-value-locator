'use strict';

/** 
 * @typedef {JavascriptValueLocatorString|JavascriptValueLocatorObject}
 * @description A JavascriptValueLocator (JVL) is a {@link JavascriptValueLocatorString string} or an {@link JavascriptValueLocatorObject object} which describe a way to access to a javascript value.
 * It must provide at least:
 *	+ {@link JavascriptValueLocatorProtocol A protocol (JavascriptValueLocatorProtocol)}
 *	+ {@link string A target as a string}
 */
var JavascriptValueLocator

/**
 * @typedef {string}
 * @description A JavascriptValueLocatorString (JVL string) is a string which describe a way to access to a javascript value. It must matches the following format:
 * + protocol-name:target-name {@link JavascriptValueLocator see JavascriptValueLocator}
 *
 * @example
 * // Those are valid JVL strings
 * "require:/path/to/file"
 * "any-defined-protocol-name:any-target-name_case is-NotImportant"
 *
 * // Those are unvalid JVL strings
 * ":target-name" // Missing protocol
 * "protocol-name" // Missing target
 */
var JavascriptValueLocatorString

/**
 * @typedef {object}
 * @description A JavascriptValueLocatorObject is an object which describe a way to access to a javascript value.
 * @property {string|JavascriptValueLocatorProtocol} protocol - The name of the protocol or the protocol himself (as a function which respect the {@link JavascriptValueLocatorProtocol JavascriptValueLocatorProtocol definition})
 * @property {string} target - The javascript value targeted.
 */
var JavascriptValueLocatorObject

/**
 * @typedef {function}
 * @description A JavascriptValueLocatorProtocol is a function which take the following arguments (resolve, reject, target, options) and resolve the targeted javascript value or reject an error
 * @param {function} resolve - A resolve function which will be called with the targeted javascript value as single argument
 * @param {function} reject - A reject function which will be called with a error as single argument if the javascript value load failed
 * @param {string} target - The target to load and resolve. A target must be a unique identifier/path (or maybe other things depending on the used protocol) to the requested javascript value. You must use it to know which value is requested
 * @param {object} options - The options passed to the protocol.
 */
var JavascriptValueLocatorProtocol

/** The JVL API is an object providing the following properties:
 *	+ {@link load}
 *	+ {@link parse}
 *	+ {@link stringify}
 *	+ {@link defaultProtocols}
 * @example
 * // require the public API
 * const JVL = require('javascript-value-locator')
 * // then use a method of the API
 * JVL.load('npm:string-humanize@1.0.0').then(_ => console.log(_('hello-world'))) // Hello world
 */
module.exports = {
	load: require('./api/load'),
	parse: require('./api/parse'),
	stringify: require('./api/stringify'),
	defaultProtocols: require('./api/default-protocols')
};