var tracking = (function (config) {

	'use strict';

	var request;

    //ex. str = "Lineup=acab-axavasat-amanafbn-ba";
	function send(str) {

		if (request) {

	    	request.abort();
	    }

		request = new XMLHttpRequest();

		request.onreadystatechange=function() {

			if (request.readyState === 4 && request.status === 200) {

				console.log('Request successfull');
			}
		};

		request.open('POST','https://script.google.com/macros/s/AKfycbzvz2UDsyp6Iy7YMMVbbnUSKwfCsmrabnVBPlGscrz1STIfGEgE/exec', true);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send(str);
	}

	return {

        send: send
    };

}(config));
