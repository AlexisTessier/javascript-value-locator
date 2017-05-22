'use strict';

const assert = require('better-assert');

const parse = require('./parse');
const stringify = require('./stringify');

/**
 * @name setLocatorDefaultProtocol
 * @description This function returns a locator with the specified default protocol if the input locator doesn't provide one
 *
 * @param {(string | object) | Array<(string | object)>} locator - A potential JVL which must at least provide a target. It will be transformed in a valid JVL. If it's an Array, the function will return an Array of valid JVL. The output JVl will keep the type of the original input locator
 * @param {string} defaultProtocol - If no protocol is found in the locator, then the default protocol will be setted as the current locator protocol. Note that you can't provide a protocol as a function using the setLocatorDefaultProtocol function.
 *
 * @return {JavascriptValueLocator | Array<JavascriptValueLocator>} The corresponding locator as an object.
 */
module.exports = function setLocatorDefaultProtocol(locator, defaultProtocol) {
	assert(typeof locator === 'object' || typeof locator === 'string');

	if (Array.isArray(locator)) {
		return locator.map(loc => setLocatorDefaultProtocol(loc, defaultProtocol));
	}

	if (typeof locator === 'string') {
		let JVL, parseErr = null;

		try{
			JVL = parse(locator);
		}
		catch(err){
			parseErr = err;
		}

		if (!parseErr) {
			return locator;
		}

		if(parseErr.message.indexOf('The target is missing') >= 0){
			throw parseErr;
		}

		return stringify({
			protocol: defaultProtocol,
			target: locator
		});
	}

	//if locator is an object
	return parse(setLocatorDefaultProtocol(
		stringify({
			protocol: locator.protocol || defaultProtocol,
			target: locator.target || ''
		}),
		defaultProtocol
	));
}