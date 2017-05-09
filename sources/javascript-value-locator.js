
'use strict';

/**
 * @typedef {JavascriptValueLocatorString|JavascriptValueLocatorObject} JavascriptValueLocator
 * @description A JavascriptValueLocator (JVL) is a {@link JavascriptValueLocatorString string} or an {@link JavascriptValueLocatorObject object} which describe a way to access to a javascript value.
 * It must provide at least:
 *	+ {@link JavascriptValueLocatorProtocol A protocol (JavascriptValueLocatorProtocol)}
 *	+ {@link JavascriptValueLocatorTarget A target (JavascriptValueLocatorTarget)}
 */
var JavascriptValueLocator;

/**
 * @typedef {string} JavascriptValueLocatorString
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
var JavascriptValueLocatorString;

/**
 * @typedef {object} JavascriptValueLocatorObject
 * @property {string|JavascriptValueLocatorProtocol} protocol
 * @property {JavascriptValueLocatorTarget} target
 */
var JavascriptValueLocatorObject;

/**
 * @typedef {function|Promise} JavascriptValueLocatorProtocol
 */
var JavascriptValueLocatorProtocol;

/**
 * @typedef {string|Promise} JavascriptValueLocatorTarget
 */
var JavascriptValueLocatorTarget;

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