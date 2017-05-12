'use strict';

const path = require('path');

const readYaml = require('read-yaml');
const capitalize = require('capitalize');

const pkg = require('../package.json');

/*--------------*/

const view = Object.assign({}, pkg, {
	name: capitalize.words(pkg.name.replace(/\-/g, ' ')),
	content: readYaml.sync(path.join(__dirname, `documentation-introduction.yaml`), {encoding: 'utf-8'})
});

/*--------------*/

const mkdirp = require('mkdirp');

const viewFileName = path.join(__dirname, '../tmp/build/readme.view.json');

mkdirp.sync(path.dirname(viewFileName));
require('jsonfile').writeFileSync(viewFileName, view, {
	encoding: 'utf-8'
});