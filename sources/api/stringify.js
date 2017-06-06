'use strict';

const assert = require('better-assert');

const JVLStringProtocolTargetSeparator = require('../settings').JVLStringProtocolTargetSeparator;

/**
 * This function transforms a locator object to a JVL string.
 *
 * @param {JavascriptValueLocatorObject} locator - The locator object to stringify.
 *
 * @return {JavascriptValueLocatorString} The corresponding JVL string.
 */
module.exports = function parse(locator) {
	assert(typeof locator === 'object');
	assert(typeof locator.protocol === 'string' && locator.protocol.length);
	assert(typeof locator.target === 'string' && locator.target.length);

	if(locator.protocol.indexOf(JVLStringProtocolTargetSeparator) >= 0){
		throw new Error(`The protocol name "${locator.protocol}" is not valid. It shouldn't contains the sign "${JVLStringProtocolTargetSeparator}"`);
	}

	return `${locator.protocol.trim()}${JVLStringProtocolTargetSeparator}${locator.target.trim()}`;
}