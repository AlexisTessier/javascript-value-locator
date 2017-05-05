'use strict';

const assert = require('better-assert');

const UNDEFINED_MODULE = Symbol();

module.exports = function requireProtocol(resolve, reject, target, options = {}) { // eslint-disable-line max-params
	assert(typeof resolve === 'function');
	assert(typeof reject === 'function');
	assert(typeof target === 'string');
	assert(typeof options === 'object');

	let result = UNDEFINED_MODULE;
	try {
		result = require(target)
	} catch(err) {
		reject(new Error(`require protocol is unable to load the module ${target} (${err.message})`))
	} finally {
		if (result !== UNDEFINED_MODULE) {
			resolve(result)
		}
	}
}