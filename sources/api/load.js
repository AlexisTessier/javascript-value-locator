'use strict';

const assert = require('better-assert');

const parseJOL = require('./parse');
const defaultProtocols = require('./default-protocols');

/**
 * This function loads a module in a async way
 *
 * @param {String | Object} locator - A javascript object locator as an object or a string which follow the JOL format.
 * @param {Object} [options=] - The javascript options object which will be passed to the locator protocol function. If locator is an object, it can provide directly an options object which will be merged with the options parameter.
 * @param {Object} [inject=] - A javascript object containing the load function dependencies.
 * @param [inject.protocols=defaultProtocols] - A Dictionnary where keys are the names of the protocols and value are the protocols functions. If locator is an object, it can provide directly a protocols key which will be merged with the inject.protocols parameter.
 *
 * @return {Promise} A promise resolving the javascript object targeted by the locator.
 */
module.exports = function load(locator, options = {}, { // eslint-disable-line max-params
	protocols = defaultProtocols
} = {}) {
	assert((locator && typeof locator === 'object') || typeof locator === 'string');
	assert(typeof options === 'object');
	assert(typeof protocols === 'object');

	//if locator is an object and provide an options object, it's merged with the options'
	options = Object.assign({}, options || {}, (
		typeof locator !== 'object' ? {} : (
			!(locator.options && typeof locator.options === 'object') ? {} : locator.options
		)
	));

	//if locator is an object and provide a protocols object, it's merged with the protocols
	protocols = Object.assign({}, protocols || {}, (
		typeof locator !== 'object' ? {} : (
			!(locator.protocols && typeof locator.protocols === 'object') ? {} : locator.protocols
		)
	));

	let protocol = null;
	let target = null;

	if (typeof locator === 'string') {
		locator = parseJOL(locator);
	}

	if (typeof locator === 'object') {
		assert(typeof locator.target === 'string');
		target = locator.target;

		switch(typeof locator.protocol){
			case 'function':
				protocol = locator.protocol;
				break;

			case 'string':
				if (!(locator.protocol in protocols)) {
					throw new Error(`"${locator.protocol}" is not a defined protocol. Existing protocol(s) are ${Object.keys(protocols).join(', ')}`);
				}

				protocol = protocols[locator.protocol];

				if (typeof protocol !== 'function') {
					throw new Error(`"${locator.protocol}" is of type "${typeof locator.protocol}" and is not a valid protocol. A valid protocol must be a function`);
				}
				break;

			default:
				throw new TypeError(`${typeof locator.protocol} is not a valid type for a locator.protocol. Valid types are function or string`);
		}
	}

	return new Promise((resolve, reject) => {
		protocol(resolve, reject, target, options);
	});
}