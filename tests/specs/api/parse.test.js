'use strict';

const test = require('ava');

const requireFromIndex = require('../../utils/require-from-index');

test('type of parse', t => {
	const parse = requireFromIndex('sources/api/parse');
	const parseFromIndex = requireFromIndex('parse');

	t.is(typeof parse, 'function');
	t.is(parseFromIndex, parse);
});

test('parse JVL string', t => {
	const parse = requireFromIndex('sources/api/parse');

	const locator = parse('fake-protocol:fake-target');

	t.is(typeof locator, 'object');
	t.is(typeof locator.protocol, 'string');
	t.is(locator.protocol, 'fake-protocol');
	t.is(typeof locator.target, 'string');
	t.is(locator.target, 'fake-target');
	t.is(Object.keys(locator).length, 2);

	const l = parse('p:t');

	t.is(typeof l, 'object');
	t.is(typeof l.protocol, 'string');
	t.is(l.protocol, 'p');
	t.is(typeof l.target, 'string');
	t.is(l.target, 't');
	t.is(Object.keys(l).length, 2);
});

test('parse unvalid JVL string', t => {
	const parse = requireFromIndex('sources/api/parse');

	function expectedErrorMessage(input) {
		return `"${input}" is not a valid Javascript Value Locator string. It must contains the seperator sign ":" between a protocol name and a target name`;
	}

	const stringNotContainingSeparatorError = t.throws(() => {
		parse('wrong-jvl');
	});

	t.is(stringNotContainingSeparatorError.message, expectedErrorMessage('wrong-jvl'));

	const stringTooShortError = t.throws(() => {
		parse('wo');
	});

	t.is(stringTooShortError.message, expectedErrorMessage('wo'));

	const missingProtocolError = t.throws(() => {
		parse(':target');
	});

	function missingPartErrorMessage(input, missing) {
		return `"${input}" is not a valid Javascript Value Locator string. The ${missing} is missing.`;
	}

	t.is(missingProtocolError.message, missingPartErrorMessage(':target', 'protocol'));

	const missingTargetError = t.throws(() => {
		parse('protocol:');
	});

	t.is(missingTargetError.message, missingPartErrorMessage('protocol:', 'target'));
});

test('parse unvalid JVL', t => {
	const parse = requireFromIndex('sources/api/parse');

	const unvalidValues = ['protocol:', ':target', 'target', null, 4, false, true, {}, [], / /, {
		protocol: 'p',
		target: 't'
	}, {
		protocol: 'p'
	}, {
		target: 't'
	}];

	unvalidValues.forEach(unvalidValue => {
		t.throws(()=>{
			parse(unvalidValue);
		});
	});
});