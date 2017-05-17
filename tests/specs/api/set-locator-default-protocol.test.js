'use strict';

const assert = require('assert');
const test = require('ava');

const pathFromIndex = require('../../utils/path-from-index');
const requireFromIndex = require('../../utils/require-from-index');

test.skip('type of setLocatorDefaultProtocol', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');
	const setLocatorDefaultProtocolFromIndex = requireFromIndex('set-locator-default-protocol');

	assert.equal(typeof setLocatorDefaultProtocol, 'function');
	assert.equal(setLocatorDefaultProtocolFromIndex, setLocatorDefaultProtocol);
})

