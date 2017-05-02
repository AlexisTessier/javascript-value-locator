'use strict';

const assert = require('better-assert');

const defaultProtocols = {};

module.exports = function load(locator, {
	protocols = {}
} = {}) {
	assert((locator && typeof locator === 'object') || typeof locator === 'string');
	assert(typeof protocols === 'object');

	protocols = Object.assign({}, defaultProtocols, protocols);

	let protocol = null;
	if (typeof locator === 'object') {
		assert('module' in locator);

		switch(typeof locator.protocol){
			case 'function':
				protocol = locator.protocol;
			break;

			case 'string':
				protocol = protocols[locator.protocol];
			break;

			default:
				throw new TypeError(`${typeof locator.protocol} is not a valid type for a locator.protocol. Valid types are function or string`);
			break;
		}
	}

	return new Promise((resolve, reject) => {
		if (typeof locator === 'object') {
			protocol(resolve, reject, locator.module);
		}
	});
}