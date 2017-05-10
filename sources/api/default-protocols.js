'use strict';

/** @name defaultProtocols
 * @description This object contains the defaults protocols defined by the javascript-value-locator package :
 *	+ {@link require}
 *
 * You can use it, for example, in order to create a new load functions with new custom protocols.
 * @example
 * //import the load function and the default-protocols
 * const {load, defaultProtocols} = require('javascript-value-locator')
 *
 * //define some custom protocols
 * const customProtocols = {
 *     newProtocol: function(resolve, reject, target, options){
 *         resolve(getTheValueUsingTheTargetAndOptions)
 *         //or
 *         reject()
 *     }
 * }
 *
 * //create and export a function which call the original function,
 * //but passing to it a new protocols object dependency
 * module.exports = function customLoad(locator, options){
 *     return load(locator, options, {
 *         protocols: Object.assign({}, defaultProtocols, customProtocols)
 *     })
 * }
 */
module.exports = {
	require: require('../protocols/require.js')
}