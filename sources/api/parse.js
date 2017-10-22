'use strict';

const assert = require('better-assert');

const msg = require('@alexistessier/msg');

const JVLStringProtocolTargetSeparator = require('../settings').JVLStringProtocolTargetSeparator;

/**
 * This function returns a locator object from a JVL string.
 *
 * @param {JavascriptValueLocatorString} JVL - The locator as string to parse.
 *
 * @return {JavascriptValueLocatorObject} The corresponding locator as an object.
 */
module.exports = function parse(JVL) {
	assert(typeof JVL === 'string');

	const separatorIndex = JVL.indexOf(JVLStringProtocolTargetSeparator);

	if (separatorIndex < 0 || JVL.length < (2 + JVLStringProtocolTargetSeparator.length)) {
		throw new Error(msg(
			`"${JVL}" is not a valid Javascript Value Locator string.`,
			`It must contains the seperator sign "${JVLStringProtocolTargetSeparator}"`,
			`between a protocol name and a target name`
		));
	}

	const locator = {
		protocol: JVL.substring(0, separatorIndex),
		target: JVL.substring(separatorIndex+1)
	}

	if(locator.protocol.length === 0){
		throw new Error(msg(
			`"${JVL}" is not a valid Javascript Value Locator string.`,
			`The protocol is missing.`
		));
	}

	if(locator.target.length === 0){
		throw new Error(msg(
			`"${JVL}" is not a valid Javascript Value Locator string.`,
			`The target is missing.`
		));
	}

	return locator;
}