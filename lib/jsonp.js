'use strict';

var parseUrl = require('./url/parse'),
	formatUrl = require('./url/format');

/**
 * @desc Perform a cross domain request via JSONP. Provides the same interface as xhr.js.   The request is made by appending a 'callback' parameter to the request url,  and it is expected that the server will respond with the content wrapped in  a function call using the provided value of the callback parameter.   If callbackFn isn't defined, a unique name will be generated.
 * @module jsonp
 * @param {Object} options
 * @param {Function} callback  executed on response with the signature (status: Number, body: String)
 * @returns {Object} Returns object with send function
 * @example
 * http://foo.com/?callback=CB_1433519761916 => CB_1433519761916('response from server');
 * 
 */
var jsonpRequest = function (options, callback) {
	var url = parseUrl(options.url),
		doc = document,
		globalFnName = options.callbackFn || 'CB_' + (new Date()).getTime(),
		script = doc.createElement('script');

	window[globalFnName] = function(response) {
		callback(200, response);

		// You can't actually delete properties from window. They aren't properties, they're full blown objects set to
		// the global namespace, so they cannot be removed as such.
		window[globalFnName] = undefined;
		try {
			delete window[globalFnName];
		} catch(e) {}
	};

	url.query.callback = globalFnName;

	script.src = formatUrl(url);

	return {
		send: function() {
			doc.body.appendChild(script);
		}
	};
};

module.exports = jsonpRequest;
