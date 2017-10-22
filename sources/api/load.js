'use strict';

const assert = require('better-assert');

const msg = require('@alexistessier/msg');

const parseJVL = require('./parse');
const defaultProtocols = require('./default-protocols');

/**
 * This function loads a javascript value in a async way
 *
 * @param {JavascriptValueLocator | Array<JavascriptValueLocator>} locator - A javascript value locator as an object or a string which follow the JVL format. Can also be an Array of locators.
 * @param {object} [options=] - The javascript options object which will be passed to the locator protocol function. If locator is an object, it can provide directly an options object which will be merged with the options parameter.
 * @param {object} [inject=] - A javascript object containing the load function dependencies.
 * @param {object} [inject.protocols=defaultProtocols] - A Dictionnary where keys are the names of the protocols and value are the protocols functions. If locator is an object, it can provide directly a protocols key which will be merged with the inject.protocols parameter.
 *
 * @return {Promise} A promise resolving the javascript value targeted by the locator. If locator was an Array, the promise resolve an Array containing all the targeted values in the same order as defined.
 */
module.exports = function load(locator, options = {}, { // eslint-disable-line max-params
	protocols = defaultProtocols
} = {}) {
	assert((locator && typeof locator === 'object') || typeof locator === 'string');
	assert(typeof options === 'object');
	assert(typeof protocols === 'object');

	if (Array.isArray(locator)) {
		const optionsObjectsArray = Array.isArray(options);
		if (optionsObjectsArray && options.length !== locator.length) {
			throw new Error(msg(
				`When using the Javascript Value Locator load`,
				`function with an Array of locators and an Array of options objects,`,
				`the two Arrays must contains the same number of elements.`
			));
		}

		return new Promise((resolve, reject) => {
			const targets = [];

			Promise.all(locator.map((loc, i) => (
				load(loc, optionsObjectsArray ? options[i] : options, {protocols}).then(target => targets[i] = target)
			))).then(()=>resolve(targets))
		});
	}

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
		locator = parseJVL(locator);
	}

	/* istanbul ignore else */
	if (typeof locator === 'object') {
		assert(typeof locator.target === 'string');
		target = locator.target;

		switch(typeof locator.protocol){
			case 'function':
				protocol = locator.protocol;
				break;

			case 'string':
				if (!(locator.protocol in protocols)) {
					const protocolsNames = Object.keys(protocols);
					throw new Error(msg(
						`"${locator.protocol}" is not a defined protocol.`,
						`Existing protocol${protocolsNames.length > 1 ? "s are" : " is"}`,
						`${protocolsNames.map(name => '"'+name+'"').join(', ')}` // eslint-disable-line prefer-template
					));
				}

				protocol = protocols[locator.protocol];

				if (typeof protocol !== 'function') {
					throw new Error(msg(
						`"${locator.protocol}" is of type "${typeof locator.protocol}" and`,
						`is not a valid protocol. A valid protocol must be a function`
					));
				}
				break;

			default:
				throw new TypeError(msg(
					`${typeof locator.protocol} is not`,
					`a valid type for a locator.protocol.`,
					`Valid types are function or string`
				));
		}
	}

	return new Promise((resolve, reject) => {
		protocol(resolve, reject, target, options);
	});
}