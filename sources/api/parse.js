'use strict';

const assert = require('better-assert');

const JOLStringProtocolTargetSeparator = require('../settings').JOLStringProtocolTargetSeparator;

module.exports = function parse(JOL) {
	assert(typeof JOL === 'string');

	const separatorIndex = JOL.indexOf(JOLStringProtocolTargetSeparator);

	if (separatorIndex < 0 || JOL.length < (2 + JOLStringProtocolTargetSeparator.length)) {
		throw new Error(`"${JOL}" is not a valid Javascript Object Locator string. It must contains the seperator sign "${JOLStringProtocolTargetSeparator}" between a protocol name and a target name`);
	}

	return {
		protocol: JOL.substring(0, separatorIndex),
		target: JOL.substring(separatorIndex+1)
	}
}