'use strict';

const assert = require('better-assert');

const shell = require('shelljs');

const pkg = require('../package.json');
const git = require('git-repo-info')();

assert(git.branch === 'release');

if (shell.exec(`git commit -am "Auto-commit : release ${pkg.version}"`).code !== 0) {
	shell.echo('Error: Git commit failed');
	shell.exit(1);
}
else{
	shell.exec(`git push origin release`)
}