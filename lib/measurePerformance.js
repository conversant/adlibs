/** @module measurePerformance */

'use strict';

/*

 W3C Spec doc lists these as the perf events available

 window.performance.timing = {
 All values are unsigned long or undefined

 navigationStart ------> This attribute must return the time immediately after the browser finishes prompting to unload
 the previous doc. If there is no previous doc, this returns the time the current doc is created.

 unloadEventStart -----\ These events are only relevant one same domain requests. This will return 0 unless Vision is
 unloadEventEnd -------/ running directly on the pub page, and has to do with how long the previous page took to
 unload (exit, run scripts on unload, etc).

 redirectStart --------\ If redirects happen on the same domain, this returns the time those took. If no redirects
 redirectEnd ----------/ happen, or the domain is different, it will return 0.

 ------------------------------------------------------------------------------------------------------------------------

 fetchStart -----------> If the new resource is to be fetched using HTTP GET or equivalent, fetchStart must return the
 time before the browser checks app caches. Otherwise, it returns the time when the browser
 starts fetching the doc.

 domainLookupStart ----\ Return the time immediately before the browser starts the domain name lookup. If a persistent
 domainLookupEnd ------/ connection, app caches, or local file are used, this must return the same value as fetchStart.
 Check if fetchStart === domainLookupStart before calculating. Default = fetchStart.
 0 seconds diff = cache load

 connectStart ---------\ This attribute must return the time immediately before the browser start establishing the
 connectEnd -----------/ connection to the server to retrieve the doc. Default = domainLookupEnd

 secureConnectionStart-> This attribute is optional. Returns 0 on non-https pages. No IE 9 support. This happens
 between connectStart and connectEnd.

 ------------------------------------------------------------------------------------------------------------------------

 requestStart ---------> This attribute must return the time immediately before the browser starts requesting the
 current doc from the server, or caches. No end time for this.

 responseStart --------\ These attributes must return the time between the browser receiving the first and last byte
 responseEnd ----------/ of the response from the server, cache, or local file.

 domLoading -----------> Returns before the browser sets the readiness to "loading".

 domInteractive -------> Returns before the browser sets the readiness to "interactive".

 domContentLoadedEventStart ---\ Returns before the browser fires the DOMContentLoaded event at the window.Document.
 domContentLoadedEventEnd -----/ Returns after the DOMContentLoaded event is completes. This is when DOMready event in
 JS frameworks is fired.

 domComplete ----------> Returns the first time that the browser set the readiness to "complete".

 loadEventStart -------\ Return the time before the doc's load event is fired. Returns 0 when not fired.
 loadEventEnd ---------/ I've been experiencing trouble capturing this event as I think scheduling timers my delay it.
 It could be possible that something listening for dom ready to kick off fires and then doesn't
 return the js thread until it has finished (such as Vision's init process) which could delay
 this from firing. As such, it may be better to move this event to ID 19 as it should be reported
 after scripts have finished reporting. It may also be beneficial to report performance in multiple
 events at bottlenecking points so we can gain information without an all or nothing gamble.

 msFirstPaint ---------> IE specific event which occurs when document display begins, after loadEventEnd.
 };

 ------------------------------------------------------------------------------------------------------------------------

 How to use it
 ========================================================================================================================
 - Network latency (): responseEnd-fetchStart
 - The time taken for page load once the page is received from the server: loadEventEnd-responseEnd
 - The whole process of navigation and page load: loadEventEnd-navigationStart.

 See more about this event here:
 - http://www.html5rocks.com/en/tutorials/webperformance/basics/
 - http://kaaes.github.io/timing/
 -

 window.performance.navigation = {
 const unsigned short TYPE_NAVIGATE			= 0;
 const unsigned short TYPE_RELOAD			= 1;
 const unsigned short TYPE_BACK_FORWARD		= 2;
 const unsigned short TYPE_RESERVED			= 255;
 readonly attribute unsigned short type;
 readonly attribute unsigned short redirectCount;
 }

 Record the current navigation type in window.performance.navigation.type if it has not been set:
 - If the navigation was started by clicking on a link, or entering the URL in the user agent's address bar,
 or form submission, or initializing through a script operation other than the location.reload() method,
 let the navigation type be TYPE_NAVIGATE.
 - If the navigation was started either as a result of a meta refresh, or the location.reload() method,
 or other equivalent actions, let the navigation type be TYPE_RELOAD.
 - If the navigation was started as a result of history traversal, let the navigation type be TYPE_BACK_FORWARD.
 - Otherwise, let the navigation type be TYPE_RESERVED.
 */

/*
 Navigation Performance API support, aka window.performance.timing = {...}:
 - IE 9
 - FF 7
 - Chrome 6
 - Opera 15
 - Safari 8

 High Performance Timing API support, aka window.performance.now():
 - IE 10
 - FF 15
 - Chrome 24 (20 with prefix)
 - Opera 15
 - Safari - 8

 Therefore we can draw the conclusion that perf.timing will always be available before perf.now and
 it doesn't make sense to add perf.now anywhere as a fill in for navigationStart
 */

var can = require('./canHas').can;

var has = require('./canHas').has;

var MeasurePerformance = function () {

	var self = this;

	var w = window,
		d = document,
		navTimes,
		navTypes,
		performanceVersion = 3,
		loadThreshold = 25000, // time in milliseconds..based on the time a page loads with a 250 KB/s throttle in chrome dev tools
		/** @type {Number} */
		startTime;

	/** @type {{timing:Object, navigation:Object, now:Function, memory:Object}|Boolean} */
	var navPerf = has('performance') || has('mozPerformance') || has('msPerformance') || has('webkitPerformance') || false;
	var supported = !!navPerf;
	/** @type {{ navigationStart: Number }} */
	var timing = can(navPerf, 'timing') ? navPerf.timing : {};
	var nav = can(navPerf, 'navigation') ? navPerf.navigation : {};

	/**
	 * Sanitize performance events down to -1 or their values, which must be integers.
	 * @private
	 * @param {Array} time
	 * @param {Object} perfObj
	 * @param {Boolean} [minifyTimes]
	 * @returns {Array.<Number>}
	 */
	var safeTimingEvents = function (time, perfObj, minifyTimes) {
		var r = -1,
			safe = [],
			startTime;

		/**
		 * Make sure the values we get back are safe for encoding to the performance report format. Default = -1.
		 * @param r
		 * @returns {Number}
		 */
		var treat = function (r) {
			return typeof perfObj[time[r]] !== 'undefined' ? perfObj[time[r]] : -1;
		};

		// Even though the nav events don't have times, this is still a valuable indicator of support,
		// so it's ok if these next two lines run.

		startTime = treat(0);
		
		while (++r < time.length) {
			safe[r] = treat(r);
			if (minifyTimes && safe[r] > 0) {
				safe[r] -= startTime;
			}
		}

		return safe;
	};

	/**
	 * Get the presumed speed of the page that's currently loading to see if there is potential for falloff due to poor performance.
	 * @private
	 * @param start
	 * @param end
	 * @param threshold
	 * @returns {String}
	 */
	var loadingState = function (start, end, threshold) {
		var UNKNOWN = 'u',
			FAST = 'f',
			SLOW = 's',
			loadState = UNKNOWN;
		// if end and start are 0, then we know that they have yet to occur
		if ((end - start) <= threshold && (end - start > 0)) {
			loadState = FAST;
		} else if ((end - start) > threshold && (end - start > 0)) {
			loadState = SLOW;
		}
		return loadState;
	};

	/**
	 * Get the timestamp for right now according to the best supported timing info available (w.performance.now or Date.getTime).
	 * @private
	 * @returns {Number}
	 */
	self.now = function () {
		var t;
		if (navPerf && !!navPerf.now) {
			t = startTime + navPerf.now();
		} else if (Date.now) {
			t = Date.now();
		} else {
			t = (new Date()).getTime();
		}
		return Math.round(+t);
	};

	if (supported && !!timing.navigationStart) {
		startTime = timing.navigationStart;
	} else {
		startTime = self.now(); // we would never be able to support decimal places in this circumstance
	}

	/**
	 * Build a performance report from the currently available page performance data.
	 * @private
	 * @type {Function}
	 * @returns {String}
	 */
	self.report = function () {

		var navigationSpeedReport,
			loadTypes,
			memStats = [-1,-1,-1,-1,-1,-1],
			pm,
			mem;

		navTimes = safeTimingEvents([
			'navigationStart',
			'unloadEventStart',
			'unloadEventEnd',
			'redirectStart',
			'redirectEnd',
			'fetchStart',
			'domainLookupStart',
			'domainLookupEnd',
			'connectStart',
			'secureConnectionStart',
			'connectEnd',
			'requestStart',
			'responseStart',
			'responseEnd',
			'domLoading',
			'domInteractive',
			'domContentLoadedEventStart',
			'domContentLoadedEventEnd',
			'domComplete',
			'loadEventStart',
			'loadEventEnd',
			'msFirstPaint'
		], timing, true);

		navTypes = safeTimingEvents([
			'redirectCount',
			'type'
		], nav);

		loadTypes = safeTimingEvents([
			'responseEnd',
			'domComplete'
		], timing, true);

		// https://docs.webplatform.org/wiki/apis/timing/properties/memory
		if (supported && has('chrome') && can(navPerf, 'memory')) {
			/* @type {{ usedJSHeapSize: Number, jsHeapSizeLimit: Number, totalJSHeapSize: Number }} */
			pm = navPerf.memory;
			// Report the rough size of the heap used currently
			mem = pm.usedJSHeapSize.toExponential();
			memStats[0] = +mem.split('.')[0];
			memStats[1] = +mem.split('+')[1];

			// Report the rough size of the heap limit
			mem = pm.jsHeapSizeLimit.toExponential();
			memStats[2] = +mem.split('.')[0];
			memStats[3] = +mem.split('+')[1];

			// Report the percentage used of allocated currently
			memStats[4] = +(pm.usedJSHeapSize / pm.totalJSHeapSize * 100).toFixed(0);
			// Report the percentage used of max
			memStats[5] = +(pm.usedJSHeapSize / pm.jsHeapSizeLimit * 100).toFixed(0);
		}

		// The order of these must not change, or it will break reporting. Update docs when this order changes.
		navigationSpeedReport = performanceVersion + ',' +
			navTimes.join(',') + ',' +
			navTypes.join(',') + ',' +
				// https://html.spec.whatwg.org/multipage/dom.html#current-document-readiness
				// http://msdn.microsoft.com/en-us/library/ie/ms536957(v=vs.85).aspx
				// https://developer.mozilla.org/en-US/docs/Web/API/document.readyState
				// Values are either loading, interactive, or complete. It is available in all browsers
			d.readyState.charAt(0) + ',' + // ready state is supported in all browsers
			loadingState(loadTypes[0], loadTypes[1], loadThreshold) + ',' +
			w.frames.length + ',' + // track how many iframes are blocking us from running
			d.getElementsByTagName('script').length + ',' + // track how many scripts are blocking us from running
			memStats.join(',') + ',' + // track memory usage when supported to see if the page or user are burdened
			startTime; // This should never change

		return navigationSpeedReport;
	};

	/**
	 * @type: {Boolean}
	 */
	self.supported = !!navPerf;

	/**
	 * @type {Number}
	 */
	self.startTime = startTime;

	/**
	 * @param allowDecimals
	 * @returns {Number}
	 */
	self.sinceStart = function (allowDecimals) {
		var t = (self.now() - startTime); // can call now not from this object literal, but from the declaration at the start of the script
		return +(allowDecimals ? t.toFixed(3) : Math.round(t));
	};
};

/**
 * Adding registry objects for managing instances between modules in a safely package scoped way.
 * 
 * @private
 * 
 */
var instanceRegistry = {};

var performanceFactory = function () {
	return new MeasurePerformance();
};

var performanceProvider = function (packageName) {
	if (!instanceRegistry[packageName]) {
		instanceRegistry[packageName] = new MeasurePerformance();
	}
	return instanceRegistry[packageName];
};

/**
 * @desc Create a new instance of the performance module.
 * @static
 * @returns {MeasurePerformance}
 * @example
 * ```js
 * var perf = require('adlibs/lib/measurePerformance').factory();
 *
 * console.log(perf.now() - perf.startTime); // outputs duration since script start
 * console.log(perf.report()); // outputs report based on performance events such as domLoading, navigationStart, etc.
 * ```
 */
module.exports.factory = performanceFactory;

/**
 * @desc Tie into an existing instance of the performance module.
 * @static
 * @param packageName
 * @returns {MeasurePerformance}
 */
module.exports.provider = performanceProvider;

