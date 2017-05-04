'use strict';

const assert = require('assert');
const test = require('ava');

const requireFromIndex = require('../../utils/require-from-index');

test('type of parse', t => {
	const parse = requireFromIndex('sources/api/parse');
	const parseFromIndex = requireFromIndex('parse');

	assert.equal(typeof parse, 'function');
	assert.equal(parseFromIndex, parse);
});

test.todo('parse JVL string');

test.todo('parse unvalid JVL string');