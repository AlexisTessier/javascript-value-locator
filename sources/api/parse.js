'use strict';

const assert = require('better-assert');

module.exports = function parse(JOL) {
	assert(typeof JOL === 'string');

	const protocol_target__separator = ':';

	const separatorIndex = JOL.indexOf(protocol_target__separator);

	if (separatorIndex < 0 || JOL.length < (2 + protocol_target__separator.length)) {
		throw new Error(`"${JOL}" is not a valid Javascript Object Locator string. It must contains the seperator sign "${protocol_target__separator}" between a protocol name and a target name`);
	}

	return {
		protocol: JOL.substring(0, separatorIndex),
		target: JOL.substring(separatorIndex+1)
	}
}