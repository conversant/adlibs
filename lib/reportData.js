
/** @module reportData */

'use strict';

var measurePerformance = require('./measurePerformance'),
	canHas = require('./canHas'),
	has = canHas.has,
	forIn = canHas.forIn;

/*
 * Safari can't use tracking pixels on unload, but xhr is said to work. Caveat is it's a sync call so it hangs the browser a split second.
 * @param trackURL
 * @returns {string}
 */
var xhrTrack = function (trackURL) {
	var xhr = new XMLHttpRequest({timeout: 500}); // take no longer than 200ms synchronously before canceling this call.
	xhr.open('GET', trackURL, false);
	xhr.onreadystatechange = function () {
		if (xhr.readyState >= has('OPENED', xhr)) {
			xhr.abort();
		}
	};
	try { xhr.send(); } catch (e) {}
	return trackURL;
};

/*
 * This method makes a call to a url but does not actually draw a pixel to a page in any way.
 * The image will be cleaned up by the browser easily because it's not referenced again past this point.
 * @param {string} trackURL
 * returns {string}
 */
var imgTrack = function (trackURL) {
	new Image().src = trackURL;
	return trackURL;
};

/*
 * Iterate over an object literal's properties and convert those to a string to be appended to a url
 * @param params {Object} key/value pairs to convert into a query string
 * @returns {string}
 */
var objectToQueryString = function (params) {
	var paramList = [];

	forIn(params, function (name, value){
		paramList.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
	});

	return paramList.join('&');
};

/**
 * Prepare the URL supplied for query string params to be added to it without doing too much.
 * @private
 * @param {String} url
 * @returns {String}
 */
var prepareURL = function (url) {
	if (/\?/.test(url)) {
		if (url.charAt(url.length - 1) !== '&') {
			url += '&';
		}
	} else {
		url += '?';
	}
	return url;
};

var sendReport = function (url, isUnloadEvent) {

	// TODO use navigator.sendBeacon for async logging calls once cross browser
	// support and its limitations (see: CORS restricted) can be indentified

	var wn = window.navigator;
	if (isUnloadEvent && wn.userAgent.toLowerCase().indexOf('safari') > -1) {
		xhrTrack(url);
	} else {
		imgTrack(url);
	}


	return url;
};

/*
 * Adding registry objects for managing instances between modules in a safely package scoped way.
 */
var instanceRegistry = {};

var ReportData;

var reportDataFactory = function (baseURL, measurePerformanceInstance) {
	var mp = measurePerformanceInstance || measurePerformance.factory();
	return new ReportData(baseURL, mp);
};


var reportDataProvider = function (packageName) {
	if (!instanceRegistry[packageName]) {
		instanceRegistry[packageName] = new ReportData(null, measurePerformance.provider(packageName));
	}
	return instanceRegistry[packageName];
};

/**
 * ReportData object will send calls to report pixels in a standard way for all subsequent calls to its instance.
 * @private
 * @param {String|null} [baseURL]
 * @param {MeasurePerformance} [mp]
 * @constructor
 */
ReportData = function (baseURL, mp) {

	var self = this,
		queue = [];

	/**
	 * If no baseUrl is supplied, events can queue up. When the baseUrl is finally supplied, the queue is cleared and all urls called.
	 */
	var runQueue = function () {
		var queryString = queue.shift();

		while (queryString) {
			sendReport(baseURL + queryString);
			queryString = queue.shift();
		}
	};

	/**
	 * @instance
	 * @param {Object} params - Object literal containing key value pairs to encode as query string params on the end of the url.
	 * @param {Boolean} [isUnloadEvent]
	 * @param {String} [url] Optional runtime url if you want to call to a different base url
	 * @returns {String} returns the path that was called via logging
	 */
	self.log = function (params, isUnloadEvent, url) {
		var qs = objectToQueryString(params);
		if (!baseURL && !url) {
			queue.push(qs);
			return qs;
		} else {
			if (url) {
				url = prepareURL(url);
			}
			var trackURL = (url || baseURL) + qs;
			return sendReport(trackURL, isUnloadEvent);
		}
	};

	/**
	 * @instance
	 * Track an event by passing an object of key value pairs as added query string params.
	 * @param {Object} params - Object literal containing key value pairs to encode as query string params on the end of the url.
	 * @param {Boolean} [isUnloadEvent]
	 * @param {String} [url] Optional runtime url if you want to call to a different base url.
	 * @returns {string} returns the path that was called via logging
	 */
	self.logWithElapsedTime = function (params, isUnloadEvent, url) {
		params.vtime = mp.now() - mp.startTime;
		return self.log(params, isUnloadEvent, url);
	};

	/**
	 * Set the base url
	 * @instance
	 * @param url
	 */
	self._setBaseUrl = function (url) {
		if (has('console') && console.info) {
            console.info('You\'ve changed the url for this singleton instance from ', baseURL, ' to ', url);
		}
		baseURL = prepareURL(url);
		runQueue();
	};

	/** @deprecated We should consistently ignore cap case Asap, for consistency reasons. */
	self._setBaseURL = self._setBaseUrl;

	if (!!baseURL) { baseURL = prepareURL(baseURL); }
};

module.exports = {
	/**
	 * @desc Create a new instance of the reportData module.
	 * @static
	 * @param {String} [baseURL] Base url for reporting pixel info.
	 * @param {MeasurePerformance} [measurePerformanceInstance] Performance instance to provide measurement timestamps.
	 * @returns {ReportData}
	 */
	factory: reportDataFactory,

	/**
	 * @desc Tie into an existing instance of the reportData module.
	 * @static
	 * @param packageName
	 * @returns {ReportData}
	 */
	provider: reportDataProvider
};
