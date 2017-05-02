'use strict';

const assert = require('assert');
const test = require('ava');

const requireFromIndex = require('../../utils/require-from-index');

test('type of load', t => {
	const load = requireFromIndex('sources/api/load');

	assert.equal(typeof load, 'function');
});

test('load using locator object', t => {
	const load = requireFromIndex('sources/api/load');

	const loadPromise = load({
		protocol(resolve, reject, moduleName) {
			resolve(`fake-protocol--${moduleName}`);
		},
		module: 'fake-module'
	});


	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.then(moduleContent => {
		assert.equal(moduleContent, `fake-protocol--fake-module`);
		t.pass();
	});
})

test('protocol rejection', t => {
	const load = requireFromIndex('sources/api/load');

	const loadPromise = load({
		protocol(resolve, reject, moduleName) {
			reject(new Error(`fake-protocol--${moduleName} error`));
		},
		module: 'fake-module'
	});

	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.catch(err => {
		assert.equal(err.message, `fake-protocol--fake-module error`);
		t.pass();
	});
});

test('load using protocol name', t => {
	const load = requireFromIndex('sources/api/load');

	function fakeProtocol(resolve, reject, moduleName) {
		resolve(`fakeProtocol--${moduleName}`)
	}

	const loadPromise = load({
		protocol: 'fakeProtocol',
		module: 'fake-module'
	}, {
		protocols: {
			fakeProtocol
		}
	});

	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.then(moduleContent => {
		assert.equal(moduleContent, `fakeProtocol--fake-module`);
		t.pass();
	});
})

test.todo('passing wrong type for protocol')

test.todo('passing options to a protocol')

test.todo('load using predefined protocols')

test.todo('load using undefined protocol')

test.todo('load using unvalid protocol')

test.todo('load using nml format')

test.todo('load using custom protocol')

test.todo('load multiple modules')