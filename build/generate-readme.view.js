'use strict';

const capitalize = require('capitalize');

const pkg = require('../package.json');

const view = Object.assign({}, pkg, {
	title: capitalize.words(pkg.name.replace(/\-/g, ' '))
});

/*--------------*/

const path = require('path');
const mkdirp = require('mkdirp');

const viewFileName = path.join(__dirname, 'tmp/readme.view.json');

mkdirp.sync(path.dirname(viewFileName));
require('jsonfile').writeFileSync(viewFileName, view, {
	encoding: 'utf-8'
});