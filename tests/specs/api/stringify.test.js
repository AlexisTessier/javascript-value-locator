'use strict';

const test = require('ava');

const path = require('path');

const pathFromIndex = require('../../utils/path-from-index');
const requireFromIndex = require('../../utils/require-from-index');

test('type of stringify', t => {
	const stringify = requireFromIndex('sources/api/stringify');
	const stringifyFromIndex = requireFromIndex('stringify');

	t.is(typeof stringify, 'function');
	t.is(stringifyFromIndex, stringify);
})

test('stringify an object', t => {
	const stringify = requireFromIndex('sources/api/stringify');
	const separator = requireFromIndex('sources/settings').JVLStringProtocolTargetSeparator;

	const locator = {
		protocol: 'fake-protocol',
		target: 'fake-target'
	};

	const JVLString = stringify(locator);

	t.is(JVLString, `fake-protocol${separator}fake-target`);
});

test('stringify an object with not trimed protocol or target', t => {
	const stringify = requireFromIndex('sources/api/stringify');
	const separator = requireFromIndex('sources/settings').JVLStringProtocolTargetSeparator;

	const locator = {
		protocol: '  fake-protocol  ',
		target: '  fake-target '
	};

	const JVLString = stringify(locator);

	t.is(JVLString, `fake-protocol${separator}fake-target`);
});

test('stringify with an unvalid protocol which contains the separator in is name', t => {
	const stringify = requireFromIndex('sources/api/stringify');
	const separator = requireFromIndex('sources/settings').JVLStringProtocolTargetSeparator;

	const locator = {
		protocol: `fake-pr${separator}otocol`,
		target: 'fake-target'
	};

	const protocolNameContainsSeparatorError = t.throws(() => {
		stringify(locator);
	});

	t.is(protocolNameContainsSeparatorError.message, `The protocol name "${locator.protocol}" is not valid. It shouldn't contains the sign "${separator}"`);
});

test('stringify unvalid locator', t => {
	const stringify = requireFromIndex('sources/api/stringify');

	const unvalidLocators = [
		false,
		2,
		'protocol:target',
		[],
		{
			protocol: 'fake-protocol'
		},
		{
			target: 'fake-target'
		},
		{
			protocol: 'fake-protocol',
			target: 54
		},
		{
			protocol: 76,
			target: 'fake-target'
		},
		{
			protocol: '',
			target: ''
		},
		{
			protocol: 'fake-protocol',
			target: ''
		},
		{
			protocol: '',
			target: 'fake-target'
		},
		null,
		undefined
	];

	unvalidLocators.forEach(unvalidLocator => {
		t.throws(() => {
			stringify(unvalidLocator)
		});
	});
});