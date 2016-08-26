'use strict';
/**
 * @module xhr
 * @desc Cross browser wrapper for XMLHttpRequest. If you need Cookies and HTTP Auth data to be included in the request, you must set withCredentials to true in the options.
 * @example
 * ```js
 * var xhr = require('ad-libs/lib/xhr');
 * ```
 */

/* globals ActiveXObject */

/**
 * Create the XHR object that works for this specific browser.
 * @returns {*|XMLHttpRequest|ActiveXObject}
 * @private
 */
var createXHR = function () {
	var xhr;

	// IE 9+, Modern Browsers
	try {
		xhr = new window.XMLHttpRequest();
	} catch(e) {}

	// IE 7.x - 8.x
	if (!xhr) {
		try {
			xhr = new ActiveXObject('Msxml2.XMLHTTP.6.0');
		} catch(e) {}
	}

	// IE 5, IE 6
	if (!xhr) {
		try {
			xhr = new ActiveXObject('Microsoft.XMLHTTP');
		} catch(e) {}
	}

	return xhr;
};

/**
 * @param {{url: String, method: String, withCredentials: Boolean, responseType: String}} options
 * @param {Function} callback - Executed on response with the signature (status: Number, body: String).
 * @returns {{xhr: XMLHttpRequest, send: Function}}
 * @example
 * ```js
 * // performs a GET request
 * var resp = xhr({url: 'www.example.com'}).send();
 *
 * ```
 *
 */
var xhr = function (options, callback) {
    var method = options.method || 'GET',
		withCredentials = options.withCredentials || false,
		url = options.url,
		responseType = options.responseType || 'text',
		xmlHttpRequest = createXHR();

	return {
		xhr: xmlHttpRequest,

		send: function() {
			if (!xmlHttpRequest) {
				return callback(0, '');
			}

			xmlHttpRequest.open(method, url);
			xmlHttpRequest.withCredentials = withCredentials;
			xmlHttpRequest.responseType = responseType;

			xmlHttpRequest.onreadystatechange = function () {
				if (xmlHttpRequest.readyState === 4) {
					var status = xmlHttpRequest.status,
						body = responseType === 'blob' ? xmlHttpRequest.response : xmlHttpRequest.responseText;

					if (typeof body === 'undefined') {
						body = '';
						status = 500;
					}

					callback(status, body);
				}
			};

			xmlHttpRequest.send();

			return this;
		}
	};
};

/**
 * @desc Determines if CORS is supported.
 * @static
 * @returns {Boolean} returns whether CORS is supported
 */
var supportsCORS =  function() {
	return 'withCredentials' in createXHR();
};

module.exports = xhr;

module.exports.supportsCORS = supportsCORS;