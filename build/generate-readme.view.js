'use strict';

const path = require('path');

const capitalize = require('capitalize');
const dashify = require('dashify');

const pkg = require('../package.json');

const git = require('git-repo-info')();

/*--------------*/

const view = Object.assign({}, pkg, {
	formatedName: capitalize.words(pkg.name.replace(/\-/g, ' ')),
	content: require('./documentation-introduction.js'),
	currentBranch: git.branch
});

/*--------------*/

view.menu = view.content.filter(block => block.section).map(({section}) => ({
	label: section,
	anchor: dashify(section)
}));

const mkdirp = require('mkdirp');

const viewFileName = path.join(__dirname, '../tmp/build/readme.view.json');

mkdirp.sync(path.dirname(viewFileName));
require('jsonfile').writeFileSync(viewFileName, view, {
	encoding: 'utf-8'
});