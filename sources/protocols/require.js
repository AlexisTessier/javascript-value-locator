'use strict';

const path = require('path');

const assert = require('better-assert');

const UNDEFINED_MODULE = Symbol();

/**
 * This function is a {@link JavascriptValueLocatorProtocol} that use the node require function to load the target.
 * @param {function} resolve - A resolve function which will be called with the targeted javascript value as single argument.
 * @param {function} reject - A reject function which will be called with a error as single argument if the javascript value load failed.
 * @param {string} target - The target to load and resolve. It must be a path to a valid node module.
 * @param {object} [options=] - A javascript object containing the require protocol options.
 * @param {string} [options.cwd=process.cwd()] - The current working directory to use if the target path is not absolute.
 */
module.exports = function requireProtocol(resolve, reject, target, { // eslint-disable-line max-params
	cwd = process.cwd()
} = {}) {
	assert(typeof resolve === 'function');
	assert(typeof reject === 'function');
	assert(typeof target === 'string');
	assert(typeof cwd === 'string');

	let result = UNDEFINED_MODULE;
	try {
		result = require(path.isAbsolute(target) ? target : path.join(cwd, target))
	} catch(err) {
		reject(new Error(`require protocol is unable to load the module "${target}" (${err.message})`))
	} finally {
		if (result !== UNDEFINED_MODULE) {
			resolve(result)
		}
	}
}