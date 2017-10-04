'use strict';

const test = require('ava');

const requireFromIndex = require('../../utils/require-from-index');

test('default protocols', t => {
	const defaultProtocols = requireFromIndex('sources/api/default-protocols');
	const defaultProtocolsFromIndex = requireFromIndex('default-protocols');

	t.is(typeof defaultProtocols, 'object');
	t.true(defaultProtocols !== null);

	t.is(defaultProtocolsFromIndex, defaultProtocols);

	const expectedProtocols = [
		'require'
	];

	const protocols = Object.keys(defaultProtocols);

	expectedProtocols.forEach(expectedProtocol => {
		t.true(protocols.includes(expectedProtocol), `Expected default protocol "${expectedProtocol}" is missing`)
	});

	protocols.forEach(protocol => {
		t.true(expectedProtocols.includes(protocol), `Unexpected default protocol "${protocol}" founded`)
	});

	t.is(defaultProtocols.require, requireFromIndex('sources/protocols/require'));
});