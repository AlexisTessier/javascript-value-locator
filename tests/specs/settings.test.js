'use strict';

const assert = require('assert');
const test = require('ava');

const requireFromIndex = require('../utils/require-from-index');

test('settings', t => {
	const settings = requireFromIndex('sources/settings');

	assert.equal(typeof settings, 'object');
	assert(settings);

	const expectedSettingsKeys = [
		'JVLStringProtocolTargetSeparator'
	];

	const settingsKeys = Object.keys(settings);

	expectedSettingsKeys.forEach(expectedSetting => {
		assert(settingsKeys.includes(expectedSetting), `Expected setting "${expectedSetting}" is missing`)
	});

	settingsKeys.forEach(key => {
		assert(expectedSettingsKeys.includes(key), `Unexpected setting "${key}" founded`)
	});

	assert.equal(settings.JVLStringProtocolTargetSeparator, ':');
});