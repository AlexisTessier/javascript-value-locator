'use strict';

const test = require('ava');

const pathFromIndex = require('../../utils/path-from-index');
const requireFromIndex = require('../../utils/require-from-index');

test('type of setLocatorDefaultProtocol', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');
	const setLocatorDefaultProtocolFromIndex = requireFromIndex('set-locator-default-protocol');

	t.is(typeof setLocatorDefaultProtocol, 'function');
	t.is(setLocatorDefaultProtocolFromIndex, setLocatorDefaultProtocol);
});

test('use with a valid JVL string', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');

	const input = 'protocol:target'
	const output = setLocatorDefaultProtocol(input, 'default-protocol');

	t.is(output, input);
});

test('use with a missing protocol string', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');

	const input = 'target'
	const output = setLocatorDefaultProtocol(input, 'default-protocol');

	t.is(output, `default-protocol:${input}`);
});

test('use with a missing target string', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');

	const input = 'protocol:'

	t.throws(()=>{
		setLocatorDefaultProtocol(input, 'default-protocol');
	});
});

test('use with a valid JVL object', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');

	const input = {
		protocol: 'protocol',
		target: 'target'
	};

	const output = setLocatorDefaultProtocol(input, 'default-protocol');

	t.deepEqual(output, input);
});

test('use with a missing protocol locator object', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');

	const input = {
		target: 'target'
	};

	const output = setLocatorDefaultProtocol(input, 'default-protocol');

	t.deepEqual(output, {
		protocol: 'default-protocol',
		target: input.target
	});
});

test('use with a missing target locator object', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');

	const input = {
		protocol: 'protocol'
	};

	t.throws(()=>{
		setLocatorDefaultProtocol(input, 'default-protocol');
	});
});

test('use with an array of missing protocol locators', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');

	const input = [
		'defined-protocol:target1',
		'target2',
		{
			protocol: 'defined-protocol-2',
			target: 'target3'
		},
		{
			target: 'target4'
		}
	];

	const output = setLocatorDefaultProtocol(input, 'default-protocol');

	t.deepEqual(output, [
		'defined-protocol:target1',
		'default-protocol:target2',
		{
			protocol: 'defined-protocol-2',
			target: 'target3'
		},
		{
			protocol: 'default-protocol',
			target: 'target4'
		}
	]);
});

test('use with an array of missing protocol locators and some missing target locators', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');

	const input = [
		'defined-protocol:target1',
		'target2',
		{
			protocol: 'defined-protocol-2',
			target: 'target3'
		},
		{
			protocol: 'defined-protocol-3'
		},
		{
			target: 'target4'
		}
	];

	t.throws(()=>{
		setLocatorDefaultProtocol(input, 'default-protocol');
	});
});

test('use with unvalid parameters', t => {
	const setLocatorDefaultProtocol = requireFromIndex('sources/api/set-locator-default-protocol');

	[
		['', 986],
		[null, ()=>{return;}]
	].forEach(unvalidParameters => {
		t.throws(()=>{
			setLocatorDefaultProtocol(...unvalidParameters);
		});
	})
});

