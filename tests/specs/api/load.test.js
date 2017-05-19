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
		fakeKey: 'fakeValue',
		fakeKey2: 'fakeValue2'
	};
	let passedOptions = null;

	const loadPromise = load({
		protocol(resolve, reject, moduleName, options) {
			passedOptions = options;
			resolve(`fake-protocol--${moduleName}`);
		},
		target: 'fake-module',
		options: {
			fakeKey: 'fakeValue'
		}
	}, {
		fakeKey: 'not-fakeValue',
		fakeKey2: 'fakeValue2'
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

	t.is(undefinedProtocolError.message, `"undefinedProtocol" is not a defined protocol. Existing protocols are "exisitingProtocol", "exisitingProtocol2", "exisitingProtocol3"`);

	const undefinedProtocolErrorPrim = t.throws(() => {
		load({
			protocol: 'undefinedProtocol',
			target: 'fake-module',
			protocols: {
				exisitingProtocol (){

				}
			}
		}, null, {
			protocols: null
		});
	});

	t.is(undefinedProtocolErrorPrim.message, `"undefinedProtocol" is not a defined protocol. Existing protocol is "exisitingProtocol"`);
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

	const expectedOptions = {
		key1: 'value1'
	};

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
		assert.deepEqual(value1.options, expectedOptions, errorMessage)

		assert.equal(value2.protocol, 'protocol1');
		assert.equal(value2.target, 'target2');
		assert.deepEqual(value2.options, expectedOptions, errorMessage)

		assert.equal(value3.protocol, 'protocol2');
		assert.equal(value3.target, 'target3');
		assert.deepEqual(value3.options, expectedOptions, errorMessage)
		
		t.pass();
	});
});

test('load an array of locators with an array of options objects', t => {
	const load = requireFromIndex('sources/api/load');

	const expectedOptions = [{
		key1: 'value1'
	}, {
		key2: 'value2'
	}, {
		key3: 'value3'
	}];

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
`When loading an array of locators with an array of options object,  
each protocols should be called with this corresponding options object`
		);

		assert.equal(value1.protocol, 'protocol1');
		assert.equal(value1.target, 'target1');
		assert.deepEqual(value1.options, expectedOptions[0], errorMessage)

		assert.equal(value2.protocol, 'protocol1');
		assert.equal(value2.target, 'target2');
		assert.deepEqual(value2.options, expectedOptions[1], errorMessage)

		assert.equal(value3.protocol, 'protocol2');
		assert.equal(value3.target, 'target3');
		assert.deepEqual(value3.options, expectedOptions[2], errorMessage)
		
		t.pass();
	});
});

test('load an array of locators with an array of options objects with a different length', t => {
	const load = requireFromIndex('sources/api/load');

	const locatorsArrayLengthDifferentFromOptionsObjectsArrayLengthError = t.throws(()=>{
		load([
			'protocol1:target1',
			'protocol1:target2'
		], [{}, {}, {}], {
			protocols: {
				protocol1(resolve, reject, target, opt){
					resolve(target)
				}
			}
		});
	});

	t.is(locatorsArrayLengthDifferentFromOptionsObjectsArrayLengthError.message,
		`When using the Javascript Value Locator load function with an Array of locators and an Array of options objects, the two Arrays must contains the same number of elements.`
	)
});

test('load an array of locators with an array of options objects which also contains explicitly null (or undefined) values', t => {
	const load = requireFromIndex('sources/api/load');

	const expectedOptionsObject1 = {
		key1: 'value1'
	};
	const expectedOptionsObject2 = {
		key2: 'value2'
	};

	const loadPromise = load([
		'protocol:target1',
		'protocol:target2',
		'protocol:target3',
		'protocol:target4',
	], [expectedOptionsObject1, null, expectedOptionsObject2, undefined], {
		protocols: {
			protocol(resolve, reject, target, opt){
				resolve(opt)
			}
		}
	});

	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.then(([value1, value2, value3, value4]) => {
		const errorMessage = (
`When loading an array of locators with an array of options object,  
if null or undefined are explicitly used instead of an options, options must be an empty object`
		);

		assert.deepEqual(value1, expectedOptionsObject1, errorMessage)

		assert.deepEqual(value2, {}, errorMessage);

		assert.deepEqual(value3, expectedOptionsObject2, errorMessage)

		assert.deepEqual(value4, {}, errorMessage);
		
		t.pass();
	});
});

test('load an array of locators with an unique options object and some options setted directly in the locator', t => {
	const load = requireFromIndex('sources/api/load');

	const expectedOptionsObject1 = {
		key1: 'value1',
		key2: 'value2',
		key3: 'value3'
	};
	const expectedOptionsObject2 = {
		key1: 'value1',
		key3: 'value3'
	};
	const expectedOptionsObject3 = {
		key1: 'value1',
		key2: 'value2',
		key3: 'value4'
	};

	const loadPromise = load([
		{
			protocol: 'p',
			target: 't',
			options: {
				key2: 'value2'
			}
		},
		'p:target2',
		{
			protocol: 'p',
			target: 't',
			options: {
				key2: 'value2',
				key3: 'value4'
			}
		}
	], {
		key1: 'value1',
		key3: 'value3'
	}, {
		protocols: {
			p(resolve, reject, target, opt){
				resolve(opt)
			}
		}
	});

	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.then(([value1, value2, value3]) => {

		assert.deepEqual(value1, expectedOptionsObject1);
		assert.deepEqual(value2, expectedOptionsObject2);
		assert.deepEqual(value3, expectedOptionsObject3);
		
		t.pass();
	});
});

test('load an array of locators with an array of options objects and some options setted directly in the locator', t => {
	const load = requireFromIndex('sources/api/load');

	const expectedOptionsObject1 = {
		key1: 'value1',
		key2: '1-value2',
		key3: '1-value3'
	};
	const expectedOptionsObject2 = {
		key2: '2-value2'
	};
	const expectedOptionsObject3 = {
		key1: 'value1',
		key2: 'value2',
		key3: '3-value3'
	};

	const loadPromise = load([
		{
			protocol: 'p',
			target: 't',
			options: {
				key1: 'value1'
			}
		},
		'p:target2',
		{
			protocol: 'p',
			target: 't',
			options: {
				key1: 'value1',
				key2: 'value2'
			}
		}
	], [{
		key2: '1-value2',
		key3: '1-value3'
	}, {
		key2: '2-value2'
	}, {
		key1: '3-value1',
		key3: '3-value3'
	}], {
		protocols: {
			p(resolve, reject, target, opt){
				resolve(opt)
			}
		}
	});

	assert(loadPromise instanceof Promise);

	t.plan(1);
	return loadPromise.then(([value1, value2, value3]) => {

		assert.deepEqual(value1, expectedOptionsObject1);
		assert.deepEqual(value2, expectedOptionsObject2);
		assert.deepEqual(value3, expectedOptionsObject3);
		
		t.pass();
	});
});