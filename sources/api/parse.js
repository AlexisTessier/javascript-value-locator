'use strict';

const assert = require('better-assert');

const JVLStringProtocolTargetSeparator = require('../settings').JVLStringProtocolTargetSeparator;

module.exports = function parse(JVL) {
	assert(typeof JVL === 'string');

	const separatorIndex = JVL.indexOf(JVLStringProtocolTargetSeparator);

	if (separatorIndex < 0 || JVL.length < (2 + JVLStringProtocolTargetSeparator.length)) {
		throw new Error(`"${JVL}" is not a valid Javascript Value Locator string. It must contains the seperator sign "${JVLStringProtocolTargetSeparator}" between a protocol name and a target name`);
	}

	return {
		protocol: JVL.substring(0, separatorIndex),
		target: JVL.substring(separatorIndex+1)
	}
}