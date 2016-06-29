'use strict';

var d = document,
	head = d.getElementsByTagName('head')[0];

var isFunction = function (fn) {
	return typeof fn === 'function';
};

var setScriptLoadedHandler = function(script, fn) {
	script.onload = fn;

	// Prevent 'Not implemented' errors in IE 8
	try {
		script.onreadystatechange = fn;
		script.onerror = fn;
	} catch (e) {}
};

var createScript = function (url, loaded, requestTimeout) {
	var script = d.createElement('script'),
		timeoutId;

	var done = function (evt) {
		var readyState = script.readyState,
			error = null;

		if (readyState && readyState !== 'loaded' && readyState !== 'complete') {
			return false;
		}

		if (evt && evt.type && evt.type === 'error') {
			error = 'script.onerror triggered';
		}

		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		setScriptLoadedHandler(script, undefined);
		loaded(error, url);

		return true;
	};

	script.onload = done;
	script.onreadystatechange = done;
	setScriptLoadedHandler(script, done);

	// Asynchronous loading yields thread control until the next tick every time. This is only good if loading multiple
	// scripts in parallel. Because we have the thread now, it's better to keep control while we have it and run it now
	// in a locking fashion instead. This can be changed later when we move to json from jsonp.
//	script.async = true;
	script.src = url;

	head.appendChild(script);

	if (requestTimeout > 0) {
		timeoutId = setTimeout(function () {
			// Do not cancel the download, just log the timeout expiry.
			setScriptLoadedHandler(script, undefined);
			loaded(requestTimeout + 'ms timeout triggered', url);
		}, requestTimeout);
	}
};

/**
 * @module loadScript
 * @desc Dynamically loads scripts in parallel, and executes a single callback after all scripts have loaded.
 * @param {String|Array} urls  a single url, or a list of urls of scripts to load
 * @param {Function} onLoaded  callback executed when all scripts have finished loading
 * @param {Function} onError  callback executed if one or more scripts fail to load, passed
 * 							  a single argument, the list of script urls that failed to load
 * @param {Number} [requestTimeout] when supplied, this will explicitly timeout the script request
 * 							  and report back to onError or if onError is not supplied, to onLoaded.
 * 							  IMPORTANT: This does not cancel the script load, just reports that it
 * 							  has exceeded the timeout duration.
 */
var loadScript = function (urls, onLoaded, onError, requestTimeout) {
	var queue = 0,
		errorUrls = [],
		url,
		i;

	onLoaded = isFunction(onLoaded) ? onLoaded : function() {};

	if (urls && !urls.push) {
		urls = [urls];
	}

	var onScriptLoaded = function(err, requestedUrl) {
		if (err) {
			errorUrls.push(requestedUrl);
		}

		if (--queue === 0) {
			if (isFunction(onError) && errorUrls.length > 0) {
				onError(errorUrls);
			} else {
				onLoaded();
			}
		}
	};

	for (i = 0; i < urls.length; i++) {
		url = urls[i];
		++queue;

		createScript(urls[i], onScriptLoaded, requestTimeout);
	}
};

module.exports = loadScript;
