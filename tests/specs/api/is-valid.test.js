'use strict';

const assert = require('assert');
const test = require('ava');

const requireFromIndex = require('../../utils/require-from-index');

test('type of isValid', t => {
	const isValid = requireFromIndex('sources/api/is-valid');
	const isValidFromIndex = requireFromIndex('is-valid');

	assert.equal(typeof isValid, 'function');
	assert.equal(isValidFromIndex, isValid);
});

test.skip('use isValid with a valid JVL string', t => {
});

test.skip('use isValid with an unvalid JVL string', t => {
});

test.skip('use isValid with a valid JVL object', t => {
});

test.skip('use isValid with an unvalid JVL object', t => {
});

test.skip('use isValid with a non string or non object value', t => {
});