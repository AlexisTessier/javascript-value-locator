'use strict';

/*
 * This file is used by serve-here module when displaying coverage report while dev process
 */

const fs = require('fs');
const path = require('path');
const markdown = require('markdown').markdown;

module.exports = [
	{
		method: 'get',
		path: '/documentation',
		data () {
			const readme = fs.readFileSync(path.join(__dirname, 'README.md'), {
				encoding: 'utf-8'
			});

			return markdown.toHTML(readme);
		}
	},
	{
		method: 'get',
		path: '/',
		data () {
			return '<html><head></head><body></body><script type="text/javascript">'+(
				`
					(function (){
						window.location = location.protocol + '//' + location.host + '/coverage';
					})()
				`
			)+'</script></html>'
		}
	}
]