'use strict';

const assert = require('assert');
const test = require('ava');

const requireFromIndex = require('../../utils/require-from-index');

test('default protocols', t => {
	const defaultProtocols = requireFromIndex('sources/api/default-protocols');
	const defaultProtocolsFromIndex = requireFromIndex('default-protocols');

	assert.equal(typeof defaultProtocols, 'object');
	assert(defaultProtocols !== null);

	assert(Object.is(defaultProtocolsFromIndex, defaultProtocols));

	const expectedProtocols = [
		'require'
	];

	const protocols = Object.keys(defaultProtocols);

	expectedProtocols.forEach(expectedProtocol => {
		assert(protocols.includes(expectedProtocol), `Expected default protocol "${expectedProtocol}" is missing`)
	});

	protocols.forEach(protocol => {
		assert(expectedProtocols.includes(protocol), `Unexpected default protocol "${protocol}" founded`)
	});

	assert.equal(defaultProtocols.require, requireFromIndex('sources/protocols/require'));
});