'use strict';

/*
 * This file is used by serve-here module when displaying coverage report while dev process
 */

const fs = require('fs');
const path = require('path');
const markdown = require('markdown').markdown;
const open = require('open');

function redirectTo(redirectPath, relative = false){
	return '<html><head></head><body></body><script type="text/javascript">'+(
		`	
			var relative = ${relative ? 'true' : 'false'};
			(function (){
				window.location = relative ? location.protocol + '//' + location.host + '${redirectPath}' : '${redirectPath}';
			})()
		`
	)+'</script></html>'
}

function readme() {
	const readme = fs.readFileSync(path.join(__dirname, 'README.md'), {
		encoding: 'utf-8'
	});

	return markdown.toHTML(readme);
}

/*--------------*/

module.exports = [
	{
		method: 'get',
		path: '/documentation',
		data () {
			open(`file://${path.join(__dirname, 'documentation/index.html')}`);
			return redirectTo('/readme', /*relative*/true);
		}
	},
	{
		method: 'get',
		path: '/readme',
		data () {
			return readme();
		}
	},
	{
		method: 'get',
		path: '/',
		data () {
			return redirectTo('/coverage', /*relative*/true);
		}
	}
]