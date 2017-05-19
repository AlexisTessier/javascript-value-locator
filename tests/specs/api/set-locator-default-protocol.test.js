'use strict';

const assert = require('assert');
const test = require('ava');

const pathFromIndex = require('../../utils/path-from-index');
const requireFromIndex = require('../../utils/require-from-index');

test('type of setLocatorDefaultProtocol', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');
	const setLocatorDefaultProtocolFromIndex = requireFromIndex('set-locator-default-protocol');

	assert.equal(typeof setLocatorDefaultProtocol, 'function');
	assert.equal(setLocatorDefaultProtocolFromIndex, setLocatorDefaultProtocol);
});

test.skip('use with a valid JVL string', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');

	const input = 'protocol:target'
	const output = setLocatorDefaultProtocol(input, 'default-protocol');

	assert.equal(output, input);
});

test.skip('use with a missing protocol string', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');
	
	const input = 'target'
	const output = setLocatorDefaultProtocol(input, 'default-protocol');

	assert.equal(output, `default-protocol:${input}`);
});

test.skip('use with a missing target string', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');
	
	const input = 'protocol:'

	t.throws(()=>{
		setLocatorDefaultProtocol(input, 'default-protocol');
	});
});

test.skip('use with a missing protocol locator object', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');
	
	const input = {
		target: 'target'
	};

	const output = setLocatorDefaultProtocol(input, 'default-protocol');

	assert.deepEqual(output, {
		protocol: 'default-protocol',
		target: input.target
	});
});

test.skip('use with a missing target locator object', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');
	
	const input = {
		protocol: 'protocol'
	};

	t.throws(()=>{
		setLocatorDefaultProtocol(input, 'default-protocol');
	});
});

test.skip('use with an array of missing protocol locators', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');
	
});

test.skip('use with an array of mixed locators (missing protocol, missing target, string, object, unvalid)', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');
	
});

test.skip('use with unvalid parameters', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');
	
});

