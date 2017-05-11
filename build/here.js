'use strict';

const fs = require('fs');
const path = require('path');
const markdown = require('markdown').markdown;
const open = require('open');

/*--------------*/

const history = [];

function previous(back = 0) {
	return history[history.length - (2 + back)] || history[0];
}

function __get(route, dataFunction) {
	const step = {
		method: 'get',
		path: route,
		data(){
			history.push(step);
			return dataFunction();
		}
	}

	return step;
}

/*--------------*/

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
	const readme = fs.readFileSync(path.join(__dirname, '../README.md'), {
		encoding: 'utf-8'
	});

	return markdown.toHTML(readme);
}

module.exports = [
	__get('/documentation', ()=>{
		open(`file://${path.join(__dirname, '../documentation/index.html')}`);
		return redirectTo(previous().path, /*relative*/true);
	}),
	__get('/readme', ()=>readme()),
	__get('/', ()=>redirectTo('/coverage', /*relative*/true))
]