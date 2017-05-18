'use strict';

const assert = require('assert');
const test = require('ava');

const path = require('path');

const pathFromIndex = require('../../utils/path-from-index');
const requireFromIndex = require('../../utils/require-from-index');

test('type of load', t => {
	const load = requireFromIndex('sources/api/load');
	const loadFromIndex = requireFromIndex('load');

	assert.equal(typeof load, 'function');
	assert.equal(loadFromIndex, load);
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

test('check protocols override', t => {
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
	}, null, {
		protocols: {
			fakeProtocol: (resolve, reject, moduleName) => {
				resolve(`not-fakeProtocol--${moduleName}`)
			}
		}
	});

	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.then(moduleContent => {
		assert.equal(moduleContent, `fakeProtocol--fake-module`);
		t.pass();
	});
});

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

test('check options override', t => {
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
	}, {
		fakeKey: 'not-fakeValue'
	});

	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.then(moduleContent => {
		assert.deepEqual(passedOptions, expectedOptions);
		t.pass();
	});
});

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
});

test('load an array of valid locators', t => {
	const load = requireFromIndex('sources/api/load');

	const expectedModules = [
		requireFromIndex('tests/mocks/fake-module.js'),
		requireFromIndex('tests/mocks/fake-module-2.js'),
		requireFromIndex('tests/mocks/fake-module-3.js')
	];

	const loadPromise = load([
		`require:${pathFromIndex('tests/mocks/fake-module.js')}`,
		`require:${pathFromIndex('tests/mocks/fake-module-2.js')}`,
		{
			protocol: 'require',
			target: `${pathFromIndex('tests/mocks/fake-module-3.js')}`
		}
	]);

	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.then(([moduleContent1, moduleContent2, moduleContent3]) => {
		assert.equal(moduleContent1, expectedModules[0]);
		assert.equal(moduleContent2, expectedModules[1]);
		assert.equal(moduleContent3, expectedModules[2]);
		t.pass();
	});
});

test('load an array of locators with an unique options object', t => {
	const load = requireFromIndex('sources/api/load');

	const expectedOptions = {};

	const loadPromise = load([
		'protocol1:target1',
		'protocol1:target2',
		'protocol2:target3'
	], expectedOptions, {
		protocols: {
			protocol1(resolve, reject, target, opt){
				resolve({
					protocol: 'protocol1',
					target,
					options: opt
				})
			},
			protocol2(resolve, reject, target, opt){
				resolve({
					protocol: 'protocol2',
					target,
					options: opt
				})
			}
		}
	});

	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.then(([value1, value2, value3]) => {
		const errorMessage = (
`When loading an array of locators with an unique options object,  
all the protocols should be called with this unique options object`
		);

		assert.equal(value1.protocol, 'protocol1');
		assert.equal(value1.target, 'target1');
		assert(Object.is(value1.options, expectedOptions), errorMessage)

		assert.equal(value2.protocol, 'protocol1');
		assert.equal(value2.target, 'target2');
		assert(Object.is(value2.options, expectedOptions), errorMessage)

		assert.equal(value3.protocol, 'protocol2');
		assert.equal(value3.target, 'target3');
		assert(Object.is(value3.options, expectedOptions), errorMessage)
		
		t.pass();
	});
});

test.skip('load an array of locators with an array of options objects', t => {
	const load = requireFromIndex('sources/api/load');


});

test.skip('load an array of locators with an array of options objects with a different length', t => {
	const load = requireFromIndex('sources/api/load');


});

test.skip('load an array of locators with an array of options objects which also contains explicitly null values', t => {
	const load = requireFromIndex('sources/api/load');


});

test.skip('load an array of locators with an array of options objects and some options setted directly in the locator', t => {
	const load = requireFromIndex('sources/api/load');

	
});

test.skip('load an array of locators with an unique options object and some options setted directly in the locator', t => {
	const load = requireFromIndex('sources/api/load');

	
});