'use strict';

const assert = require('assert');
const test = require('ava');

const path = require('path');

const pathFromIndex = require('../../utils/path-from-index');
const requireFromIndex = require('../../utils/require-from-index');

test('type of load', t => {
	const load = requireFromIndex('sources/api/load');

	assert.equal(typeof load, 'function');
})

test('load using locator object', t => {
	const load = requireFromIndex('sources/api/load');

	const loadPromise = load({
		protocol(resolve, reject, moduleName) {
			resolve(`fake-protocol--${moduleName}`);
		},
		target: 'fake-module'
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
		target: 'fake-module'
	});

	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.catch(err => {
		assert.equal(err.message, `fake-protocol--fake-module error`);
		t.pass();
	});
})

test('load using protocol name', t => {
	const load = requireFromIndex('sources/api/load');

	function fakeProtocol(resolve, reject, moduleName) {
		resolve(`fakeProtocol--${moduleName}`)
	}

	const loadPromise = load({
		protocol: 'fakeProtocol',
		target: 'fake-module'
	}, null, {
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

test('load using protocol name and protocols list in the locator object', t => {
	const load = requireFromIndex('sources/api/load');

	function fakeProtocol(resolve, reject, moduleName) {
		resolve(`fakeProtocol--${moduleName}`)
	}

	const loadPromise = load({
		protocol: 'fakeProtocol',
		target: 'fake-module',
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

test.todo('check protocols override');

test('passing a wrong type for protocol throws error', t => {
	const load = requireFromIndex('sources/api/load');

	const wrongProtocolTypes = [[], 7, {}, /mock/, false, true];

	wrongProtocolTypes.forEach(wrongProtocolType => { 
		const wrongTypeError = t.throws(() => {
			load({
				protocol: wrongProtocolType,
				target: 'fake-module'
			});
		});

		t.is(wrongTypeError.message, `${typeof wrongProtocolType} is not a valid type for a locator.protocol. Valid types are function or string`);
	});
})

test('passing options to a protocol', t => {
	const load = requireFromIndex('sources/api/load');

	const expectedOptions = {
		fakeKey: 'fakeValue'
	};
	let passedOptions = null;

	const loadPromise = load({
		protocol(resolve, reject, moduleName, options) {
			passedOptions = options;
			resolve(`fake-protocol--${moduleName}`);
		},
		target: 'fake-module'
	}, expectedOptions);

	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.then(moduleContent => {
		assert.deepEqual(passedOptions, expectedOptions);
		t.pass();
	});
})

test('passing options to a protocol directly in the locator object', t => {
	const load = requireFromIndex('sources/api/load');

	const expectedOptions = {
		fakeKey: 'fakeValue'
	};
	let passedOptions = null;

	const loadPromise = load({
		protocol(resolve, reject, moduleName, options) {
			passedOptions = options;
			resolve(`fake-protocol--${moduleName}`);
		},
		target: 'fake-module',
		options: expectedOptions
	});

	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.then(moduleContent => {
		assert.deepEqual(passedOptions, expectedOptions);
		t.pass();
	});
})

test.todo('check options override');

test('load using undefined protocol', t => {
	const load = requireFromIndex('sources/api/load');

	const undefinedProtocolError = t.throws(() => {
		load({
			protocol: 'undefinedProtocol',
			target: 'fake-module',
			protocols: {
				exisitingProtocol (){

				},
				exisitingProtocol2 (){

				},
				exisitingProtocol3 (){

				}
			}
		}, null, {
			protocols: null
		});
	});

	t.is(undefinedProtocolError.message, `"undefinedProtocol" is not a defined protocol. Existing protocol(s) are exisitingProtocol, exisitingProtocol2, exisitingProtocol3`);
})

test('load using unvalid protocol', t => {
	const load = requireFromIndex('sources/api/load');

	const unvalidProtocolError = t.throws(() => {
		load({
			protocol: 'unvalidProtocol',
			target: 'fake-module',
			protocols: {
				unvalidProtocol: 'unvalidProtocolMock'
			}
		});
	});

	t.is(unvalidProtocolError.message, `"unvalidProtocol" is of type "string" and is not a valid protocol. A valid protocol must be a function`);
})

test('load using jol format', t => {
	const load = requireFromIndex('sources/api/load');

	function fakeProtocol(resolve, reject, moduleName) {
		resolve(`fakeProtocol--${moduleName}`)
	}

	const loadPromise = load('fakeProtocol:fake-module', null, {
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

test('load using jol format with options', t => {
	const load = requireFromIndex('sources/api/load');

	let passedOptions = null;
	const expectedOptions = {
		fakeKey: 'fakeValue'
	};

	function fakeProtocol(resolve, reject, moduleName, options) {
		passedOptions = options;
		resolve(`fakeProtocol--${moduleName}`)
	}

	const loadPromise = load('fakeProtocol:fake-module', expectedOptions, {
		protocols: {
			fakeProtocol
		}
	});

	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.then(moduleContent => {
		assert.deepEqual(passedOptions, expectedOptions);
		assert.equal(moduleContent, `fakeProtocol--fake-module`);
		t.pass();
	});
})

test('load using predefined protocol - require', t => {
	const load = requireFromIndex('sources/api/load');
	const expectedModule = requireFromIndex('tests/mocks/fake-module.js');

	const loadPromise = load({
		protocol: 'require',
		target: pathFromIndex('tests/mocks/fake-module.js')
	});

	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.then(moduleContent => {
		assert.equal(moduleContent, expectedModule);
		t.pass();
	});
})

test('load using jol format - require', t => {
	const load = requireFromIndex('sources/api/load');
	const expectedModule = requireFromIndex('tests/mocks/fake-module.js');

	const loadPromise = load(`require:${pathFromIndex('tests/mocks/fake-module.js')}`);

	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.then(moduleContent => {
		assert.equal(moduleContent, expectedModule);
		t.pass();
	});
})