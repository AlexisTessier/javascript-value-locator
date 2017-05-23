'use strict';

const assert = require('better-assert');

const shell = require('shelljs');

const pkg = require('../package.json');
const git = require('git-repo-info');

shell.exec(`git checkout release`);

assert(git().branch === 'release');

if (shell.exec(`git merge master`).code !== 0) {
	shell.echo('Error: Release failed at merge master step');
	shell.exit(1);
}
else if (shell.exec(`npm run build`).code !== 0) {
	shell.echo('Error: Release build failed');
	shell.exit(1);
}
else if(shell.exec(`npm test`).code !== 0) {
	shell.echo('Error: Release Tests failed');
	shell.exit(1);
}
else if(shell.exec(`git commit -a -m "Auto-commit : release ${pkg.version}"`).code !== 0){
	shell.echo('Error: Git commit failed');
	shell.exit(1);
}
else{
	shell.exec(`git push origin release`);
}