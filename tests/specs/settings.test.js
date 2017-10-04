'use strict';

const test = require('ava');

const requireFromIndex = require('../utils/require-from-index');

test('settings', t => {
	const settings = requireFromIndex('sources/settings');

	t.is(typeof settings, 'object');
	t.not(settings, null);

	const expectedSettingsKeys = [
		'JVLStringProtocolTargetSeparator'
	];

	const settingsKeys = Object.keys(settings);

	expectedSettingsKeys.forEach(expectedSetting => {
		t.true(settingsKeys.includes(expectedSetting), `Expected setting "${expectedSetting}" is missing`)
	});

	settingsKeys.forEach(key => {
		t.true(expectedSettingsKeys.includes(key), `Unexpected setting "${key}" founded`)
	});

	t.is(settings.JVLStringProtocolTargetSeparator, ':');
});