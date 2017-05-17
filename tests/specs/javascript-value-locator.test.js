'use strict';

const assert = require('assert');
const test = require('ava');

const requireFromIndex = require('../utils/require-from-index');

test('api', t => {
	const pkg = requireFromIndex('package.json');

	assert.equal(pkg.main, 'index.js');

	const index = requireFromIndex('index');
	const api = requireFromIndex('sources/javascript-value-locator');

	assert(Object.is(index, api), `The main module of the package must exports the module sources/javascript-value-locator`);

	assert.equal(typeof api, 'object');
	assert(api !== null);

	const expectedApiKeys = [
		'load',
		'setLocatorDefaultProtocol',
		'isValid',
		'parse',
		'stringify',
		'defaultProtocols'
	];

	const apiKeys = Object.keys(api);

	expectedApiKeys.forEach(expectedKey => {
		assert(apiKeys.includes(expectedKey), `Expected api key "${expectedKey}" is missing`)
	});

	apiKeys.forEach(key => {
		assert(expectedApiKeys.includes(key), `Unexpected api key "${key}" founded`)
	});

	assert.equal(api.load, requireFromIndex('sources/api/load'));
	assert.equal(api.setLocatorDefaultProtocol, requireFromIndex('sources/api/set-locator-default-protocol'));
	assert.equal(api.isValid, requireFromIndex('sources/api/is-valid'));
	assert.equal(api.parse, requireFromIndex('sources/api/parse'));
	assert.equal(api.stringify, requireFromIndex('sources/api/stringify'));
	assert(Object.is(api.defaultProtocols, requireFromIndex('sources/api/default-protocols')));
});