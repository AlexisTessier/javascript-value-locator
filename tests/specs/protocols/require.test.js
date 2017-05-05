'use strict';

const assert = require('assert');
const test = require('ava');

const requireFromIndex = require('../../utils/require-from-index');
const pathFromIndex = require('../../utils/path-from-index');

test('type of require protocol', t => {
	const requireProtocol = requireFromIndex('sources/protocols/require');

	assert.equal(typeof requireProtocol, 'function');
});

test('require valid target', t => {
	const requireProtocol = requireFromIndex('sources/protocols/require');

	const expectedtarget = requireFromIndex('tests/mocks/fake-module');

	let resolvedTarget = null;
	let rejectedError = null;
	requireProtocol(target => resolvedTarget = target, err => rejectedError = err, pathFromIndex('tests/mocks/fake-module'));

	assert.equal(rejectedError, null);
	assert.equal(resolvedTarget, expectedtarget);
});

test('require unvalid target', t => {
	const requireProtocol = requireFromIndex('sources/protocols/require');

	const wrongModulePath = pathFromIndex('tests/mocks/fake-wrong-module');

	let resolvedTarget = null;
	let rejectedError = null;
	requireProtocol(target => resolvedTarget = target, err => rejectedError = err, wrongModulePath);

	assert.equal(resolvedTarget, null);
	assert(rejectedError);
	assert(rejectedError instanceof Error);
	assert.equal(rejectedError.message, `require protocol is unable to load the module "${wrongModulePath}" (Cannot find module '${wrongModulePath}')`);
});

test('call with wrong resolve, reject or target types', t => {
	const requireProtocol = requireFromIndex('sources/protocols/require');
	
	const validResolve = ()=>{};
	const validReject = ()=>{};
	const validTarget = pathFromIndex('tests/mocks/fake-module');

	const notFunctions = ['f', 3, null, false, true, [], {}, / /];
	const resolveParams = [validResolve].concat(notFunctions);
	const rejectParams = [validReject].concat(notFunctions);
	const targetParams = [4, ()=>{}, null, false, true, undefined, [], {}, / /, validTarget];

	resolveParams.forEach(resolve => {
		rejectParams.forEach(reject => {
			targetParams.forEach(target => {
				const allParamsAreValid = resolve === validResolve && reject === validReject && target === validTarget;
				if(!allParamsAreValid){
					t.throws(() => {
						requireProtocol(resolve, reject, target);
					});
				}
			});
		});
	});

});