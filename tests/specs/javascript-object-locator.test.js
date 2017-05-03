'use strict';

const assert = require('assert');
const test = require('ava');

const requireFromIndex = require('../utils/require-from-index');

test('module api', t => {
	const pkg = requireFromIndex('package.json');

	assert.equal(pkg.main, 'index.js');

	const index = requireFromIndex('index');
	const nodeModuleLocator = requireFromIndex('sources/javascript-object-locator');

	assert(Object.is(index, nodeModuleLocator), `The main module of the package must exports the module sources/javascript-object-locator`);

	assert.equal(typeof nodeModuleLocator, 'object');
	assert(nodeModuleLocator !== null);

	const expectedApiKeys = [
		'load',
		'parse',
		'defaultProtocols'
	];

	const apiKeys = Object.keys(nodeModuleLocator);

	expectedApiKeys.forEach(expectedKey => {
		assert(apiKeys.includes(expectedKey), `Expected api key "${expectedKey}"" is missing`)
	});

	apiKeys.forEach(key => {
		assert(expectedApiKeys.includes(key), `Unexpected api key "${key}" founded`)
	});

	assert.equal(nodeModuleLocator.load, requireFromIndex('sources/api/load'));
	assert.equal(nodeModuleLocator.parse, requireFromIndex('sources/api/parse'));
	assert(Object.is(nodeModuleLocator.defaultProtocols, requireFromIndex('sources/api/default-protocols')));
});