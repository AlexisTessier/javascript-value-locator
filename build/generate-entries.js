'use strict';

const entries = {
	'index': 'sources/javascript-value-locator',
	'load': 'sources/api/load',
	'set-locator-default-protocol': 'sources/api/set-locator-default-protocol',
	'parse': 'sources/api/parse',
	'stringify': 'sources/api/stringify',
	'default-protocols': 'sources/api/default-protocols'
}

/*--------------*/

const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

const template = fs.readFileSync(path.join(__dirname, 'entry.tpl.js'), {
	encoding: 'utf-8'
});

for(const entry in entries){
	fs.writeFileSync(
		path.join(__dirname, `../${entry}.js`),
		mustache.render(template, {
			entryPath: entries[entry]
		}), {
			encoding: 'utf-8'
		}
	);
}