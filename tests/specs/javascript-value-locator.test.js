'use strict';

const test = require('ava');

const requireFromIndex = require('../utils/require-from-index');

test('api', t => {
	const pkg = requireFromIndex('package.json');

	t.is(pkg.main, 'index.js');

	const index = requireFromIndex('index');
	const api = requireFromIndex('sources/javascript-value-locator');

	t.is(index, api, `The main module of the package must exports the module sources/javascript-value-locator`);

	t.is(typeof api, 'object');
	t.true(api !== null);

	const expectedApiKeys = [
		'load',
		'setLocatorDefaultProtocol',
		'parse',
		'stringify',
		'defaultProtocols'
	];

	const apiKeys = Object.keys(api);

	expectedApiKeys.forEach(expectedKey => {
		t.true(apiKeys.includes(expectedKey), `Expected api key "${expectedKey}" is missing`)
	});

	apiKeys.forEach(key => {
		t.true(expectedApiKeys.includes(key), `Unexpected api key "${key}" founded`)
	});

	t.is(api.load, requireFromIndex('sources/api/load'));
	t.is(api.setLocatorDefaultProtocol, requireFromIndex('sources/api/set-locator-default-protocol'));
	t.is(api.parse, requireFromIndex('sources/api/parse'));
	t.is(api.stringify, requireFromIndex('sources/api/stringify'));
	t.is(api.defaultProtocols, requireFromIndex('sources/api/default-protocols'));
});