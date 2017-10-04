'use strict';

const test = require('ava');

const path = require('path');

const pathFromIndex = require('../../utils/path-from-index');
const requireFromIndex = require('../../utils/require-from-index');

test('type of load', t => {
	const load = requireFromIndex('sources/api/load');
	const loadFromIndex = requireFromIndex('load');

	t.is(typeof load, 'function');
	t.is(loadFromIndex, load);
})

test('load using locator object', t => {
	const load = requireFromIndex('sources/api/load');

	t.plan(3);

	const loadPromise = load({
		protocol(resolve, reject, moduleName) {
			resolve(`fake-protocol--${moduleName}`);
		},
		target: 'fake-module'
	});

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(moduleContent => {
		t.is(moduleContent, `fake-protocol--fake-module`);
		t.pass();
	});
})

test('protocol rejection', t => {
	const load = requireFromIndex('sources/api/load');

	t.plan(3);

	const loadPromise = load({
		protocol(resolve, reject, moduleName) {
			reject(new Error(`fake-protocol--${moduleName} error`));
		},
		target: 'fake-module'
	});

	t.true(loadPromise instanceof Promise);

	return loadPromise.catch(err => {
		t.is(err.message, `fake-protocol--fake-module error`);
		t.pass();
	});
})

test('load using protocol name', t => {
	const load = requireFromIndex('sources/api/load');

	t.plan(3);

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

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(moduleContent => {
		t.is(moduleContent, `fakeProtocol--fake-module`);
		t.pass();
	});
})

test('load using protocol name and protocols list in the locator object', t => {
	const load = requireFromIndex('sources/api/load');

	t.plan(3);

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

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(moduleContent => {
		t.is(moduleContent, `fakeProtocol--fake-module`);
		t.pass();
	});
})

test('check protocols override', t => {
	const load = requireFromIndex('sources/api/load');

	t.plan(3);

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

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(moduleContent => {
		t.is(moduleContent, `fakeProtocol--fake-module`);
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

	t.plan(3);

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

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(moduleContent => {
		t.deepEqual(passedOptions, expectedOptions);
		t.pass();
	});
})

test('passing options to a protocol directly in the locator object', t => {
	const load = requireFromIndex('sources/api/load');

	t.plan(3);

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

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(moduleContent => {
		t.deepEqual(passedOptions, expectedOptions);
		t.pass();
	});
})

test('check options override', t => {
	const load = requireFromIndex('sources/api/load');

	t.plan(3);

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

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(moduleContent => {
		t.deepEqual(passedOptions, expectedOptions);
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

	t.plan(3);

	function fakeProtocol(resolve, reject, moduleName) {
		resolve(`fakeProtocol--${moduleName}`)
	}

	const loadPromise = load('fakeProtocol:fake-module', null, {
		protocols: {
			fakeProtocol
		}
	});

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(moduleContent => {
		t.is(moduleContent, `fakeProtocol--fake-module`);
		t.pass();
	});
})

test('load using jol format with options', t => {
	const load = requireFromIndex('sources/api/load');

	t.plan(4);

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

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(moduleContent => {
		t.deepEqual(passedOptions, expectedOptions);
		t.is(moduleContent, `fakeProtocol--fake-module`);
		t.pass();
	});
})

test('load using predefined protocol - require', t => {
	const load = requireFromIndex('sources/api/load');
	
	t.plan(3);

	const expectedModule = requireFromIndex('tests/mocks/fake-module.js');

	const loadPromise = load({
		protocol: 'require',
		target: pathFromIndex('tests/mocks/fake-module.js')
	});

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(moduleContent => {
		t.is(moduleContent, expectedModule);
		t.pass();
	});
})

test('load using predefined protocol - require using relative path', t => {
	const load = requireFromIndex('sources/api/load');
	
	t.plan(3);

	const expectedModule = requireFromIndex('tests/mocks/fake-module.js');

	const loadPromise = load({
		protocol: 'require',
		target: 'tests/mocks/fake-module.js'
	});

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(moduleContent => {
		t.is(moduleContent, expectedModule);
		t.pass();
	});
})

test('load using predefined protocol - require using relative path and custom cwd', t => {
	const load = requireFromIndex('sources/api/load');
	
	t.plan(3);

	const expectedModule = requireFromIndex('tests/mocks/fake-module.js');

	const loadPromise = load({
		protocol: 'require',
		target: 'fake-module.js'
	}, {cwd: pathFromIndex('tests/mocks')});

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(moduleContent => {
		t.is(moduleContent, expectedModule);
		t.pass();
	});
})

test('load using jol format - require', t => {
	const load = requireFromIndex('sources/api/load');
	
	t.plan(3);

	const expectedModule = requireFromIndex('tests/mocks/fake-module.js');

	const loadPromise = load(`require:${pathFromIndex('tests/mocks/fake-module.js')}`);

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(moduleContent => {
		t.is(moduleContent, expectedModule);
		t.pass();
	});
});

test('load using jol format - require using relative path', t => {
	const load = requireFromIndex('sources/api/load');
	
	t.plan(3);

	const expectedModule = requireFromIndex('tests/mocks/fake-module.js');

	const loadPromise = load(`require:tests/mocks/fake-module.js`);

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(moduleContent => {
		t.is(moduleContent, expectedModule);
		t.pass();
	});
});

test('load using jol format - require using relative path and custom cwd', t => {
	const load = requireFromIndex('sources/api/load');

	t.plan(3);

	const expectedModule = requireFromIndex('tests/mocks/fake-module.js');

	const loadPromise = load(`require:fake-module.js`, {cwd : pathFromIndex('tests/mocks')});

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(moduleContent => {
		t.is(moduleContent, expectedModule);
		t.pass();
	});
});

test('load an array of valid locators', t => {
	const load = requireFromIndex('sources/api/load');

	t.plan(5);

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

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(([moduleContent1, moduleContent2, moduleContent3]) => {
		t.is(moduleContent1, expectedModules[0]);
		t.is(moduleContent2, expectedModules[1]);
		t.is(moduleContent3, expectedModules[2]);
		t.pass();
	});
});

test('load an array of locators with an unique options object', t => {
	const load = requireFromIndex('sources/api/load');

	t.plan(11);

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

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(([value1, value2, value3]) => {
		const errorMessage = (
`When loading an array of locators with an unique options object,  
all the protocols should be called with this unique options object`
		);

		t.is(value1.protocol, 'protocol1');
		t.is(value1.target, 'target1');
		t.deepEqual(value1.options, expectedOptions, errorMessage)

		t.is(value2.protocol, 'protocol1');
		t.is(value2.target, 'target2');
		t.deepEqual(value2.options, expectedOptions, errorMessage)

		t.is(value3.protocol, 'protocol2');
		t.is(value3.target, 'target3');
		t.deepEqual(value3.options, expectedOptions, errorMessage)
		
		t.pass();
	});
});

test('load an array of locators with an array of options objects', t => {
	const load = requireFromIndex('sources/api/load');

	t.plan(11);

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

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(([value1, value2, value3]) => {
		const errorMessage = (
`When loading an array of locators with an array of options object,  
each protocols should be called with this corresponding options object`
		);

		t.is(value1.protocol, 'protocol1');
		t.is(value1.target, 'target1');
		t.deepEqual(value1.options, expectedOptions[0], errorMessage)

		t.is(value2.protocol, 'protocol1');
		t.is(value2.target, 'target2');
		t.deepEqual(value2.options, expectedOptions[1], errorMessage)

		t.is(value3.protocol, 'protocol2');
		t.is(value3.target, 'target3');
		t.deepEqual(value3.options, expectedOptions[2], errorMessage)
		
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

	t.plan(6);

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

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(([value1, value2, value3, value4]) => {
		const errorMessage = (
`When loading an array of locators with an array of options object,  
if null or undefined are explicitly used instead of an options, options must be an empty object`
		);

		t.deepEqual(value1, expectedOptionsObject1, errorMessage)

		t.deepEqual(value2, {}, errorMessage);

		t.deepEqual(value3, expectedOptionsObject2, errorMessage)

		t.deepEqual(value4, {}, errorMessage);
		
		t.pass();
	});
});

test('load an array of locators with an unique options object and some options setted directly in the locator', t => {
	const load = requireFromIndex('sources/api/load');

	t.plan(5);

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

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(([value1, value2, value3]) => {

		t.deepEqual(value1, expectedOptionsObject1);
		t.deepEqual(value2, expectedOptionsObject2);
		t.deepEqual(value3, expectedOptionsObject3);
		
		t.pass();
	});
});

test('load an array of locators with an array of options objects and some options setted directly in the locator', t => {
	const load = requireFromIndex('sources/api/load');

	t.plan(5);

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

	t.true(loadPromise instanceof Promise);

	return loadPromise.then(([value1, value2, value3]) => {

		t.deepEqual(value1, expectedOptionsObject1);
		t.deepEqual(value2, expectedOptionsObject2);
		t.deepEqual(value3, expectedOptionsObject3);
		
		t.pass();
	});
});