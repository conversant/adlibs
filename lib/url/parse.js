'use strict';

/* Based off of urllite 0.5.0 - https://github.com/hzdg/urllite.js */

var URL_PATTERN = /^(?:(?:([^:\/?\#]+:)\/+|(\/\/))(?:([a-z0-9-\._~%]+)(?::([a-z0-9-\._~%]+))?@)?(([A-Za-z0-9-\._~%!$&'()*+,;=]+)(?::([0-9]+))?)?)?([^?\#]*?)(\?[^\#]*)?(\#.*)?$/;

var parseSearch  = function (querystring) {
	var query = {},
		parts,
		pair,
		i;

	if (!querystring || querystring.length === 0) {
		return query;
	}

	if (querystring.charAt(0) === '?') {
		querystring = querystring.slice(1);
	}

	parts = querystring.split('&');

	for (i = 0; i < parts.length; i++) {
		pair = parts[i].split('=');

		if (!pair[1] || pair[1] === "undefined") {
			pair[1] = '';
		}
		if (pair[0] !== '') {
			query[pair[0]] = decodeURIComponent(pair[1]);
		}
	}

	return query;
};

var parseUrl = function (url) {
	var matches = url.toString().match(URL_PATTERN),
		pathname = matches[8] || '',
		protocol = matches[1],
		parsed = {
			origin: '',
			protocol: protocol,
			username: matches[3],
			password: matches[4],
			host: '',
			hostname: (matches[6] || '').toLowerCase(),
			port: matches[7],
			pathname: protocol && pathname.charAt(0) !== '/' ? '/' + pathname : pathname,
			search: matches[9],
			query: {},
			hash: matches[10]
		};

	parsed.host = parsed.hostname;

	if (parsed.port) {
		parsed.host += ':' + parsed.port;
		parsed.port = parseInt(parsed.port, 10);
	}

	parsed.origin = parsed.protocol + '//' + parsed.host;
	parsed.query = parseSearch(parsed.search);

	return parsed;
};

/**
 * @module parse
 * @desc Deconstructs a URL into its components. It also parses the search component (the query string) into decoded key/value pairs on a query object.
 *
 * @param {String} url
 * @returns {{
 *   origin: String,
 *   protocol: String,
 *   username: String,
 *   password: String,
 *   host: String,
 *   hostname: String,
 *   port: Number,
 *   pathname: String,
 *   search: String,
 *   query: Object,
 *   hash: String
 * }}
 * @example
 * ```js
 * var parseUrl = require('ad-libs.js/lib/url/parse');
 *
 * var queryObj = parseUrl('http://foo.com/query?cb=1234&userid=9999');
 *
 * ```
 */
module.exports = parseUrl;
