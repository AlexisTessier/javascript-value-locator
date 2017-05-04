'use strict';

const assert = require('better-assert');

const JOLStringProtocolTargetSeparator = require('../settings').JOLStringProtocolTargetSeparator;

module.exports = function parse(locator) {
	assert(typeof locator === 'object');
	assert(typeof locator.protocol === 'string' && locator.protocol.length);
	assert(typeof locator.target === 'string' && locator.target.length);

	if(locator.protocol.indexOf(JOLStringProtocolTargetSeparator) >= 0){
		throw new Error(`The protocol name "${locator.protocol}" is not valid. It shouldn't contains the sign "${JOLStringProtocolTargetSeparator}"`);
	}

	return `${locator.protocol.trim()}${JOLStringProtocolTargetSeparator}${locator.target.trim()}`;
}