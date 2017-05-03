'use strict';

const assert = require('better-assert');

const UNDEFINED_MODULE = Symbol();

module.exports = function requireProtocol(resolve, reject, moduleName, options = {}) {
	assert(typeof resolve === 'function');
	assert(typeof reject === 'function');
	assert(typeof moduleName === 'string');
	assert(typeof options === 'object');

	let result = UNDEFINED_MODULE;
	try {
		result = require(moduleName)
	} catch(err) {
		reject(new Error(`require protocol is unable to load the module ${moduleName} (${err.message})`))
	} finally {
		if (result !== UNDEFINED_MODULE) {
			resolve(result)
		}
	}
}