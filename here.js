'use strict';

/*This file is used by serve-here module when displaying coverage report*/
module.exports = [
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