/**
 * @module Browser
 * @desc Browser Detection - Gets Data Pertaining to User's Browser and OS
 * @typicalname browser
 * @example
 * ```
 * var browser = require("adlibs/lib/detect/browser")
 * ```
 */

/**
 * @type Image
 * @property {String} srcset
 */

/**
 * @type performance
 * @property {Object} timing
 * @property {Function} mark
 * @ignore
 */

/**
 * @type document
 * @property {Number} uniqueID
 * @property {String} hidden
 * @property {Object} all
 * @property {String} documentMode
 * @property {String} visibilityState
 * @property {Document} documentElement
 * @property {Function} webkitRequestFullscreen
 * @ignore
 */

/**
 * @type navigator
 * @property {String} platform
 * @property {Object} mozGetUserMedia
 * @property {Boolean} standalone
 * @property {Object} geolocation
 * @property {Object} mozBattery
 * @property {Object} webkitGetUserMedia
 * @property {String} userAgent
 * @property {Function} vibrate
 * @ignore
 */

/**
 * @type browser
 * @property {String} name
 * @property {Boolean} trustworthy
 * @property {Boolean} desktop
 * @property {Boolean} mobile
 * @property {Boolean} tablet
 * @property {Boolean} console
 * @property {String} version
 * @property {UA} ua
 * @property {Feature} feature
 * @property {Engine} engine
 * @property {OS} os
 * @property {Function} setVersionAgainstUaVersion
 */

/**
 * @type ua
 * @property {String} version
 */

/**
 * @type feature
 * @property {String} version
 */

/**
 * @type engine
 * @property {String} name
 * @property {String} version
 */

/**
 * @type os
 * @property {String} name
 * @property {String} version
 */

/**
 * @type style
 * @property {Object} KhtmlUserInput
 * @ignore
 */

/**
 * @type URL
 * @property {Function} createObjectURL
 * @ignore
 */

/**
 * @type history
 * @property {Object} replaceState
 * @ignore
 */

/* This is a separator to keep the JSDOC from going insane */

var can = require('../canHas').can,
	has = require('../canHas').has,
	kindleBrowser = /Kindle|Silk|KFTT|KFOT|KFJWA|KFJWI|KFSOWI|KFTHWA|KFTHWI|KFAPWA|KFAPWI/i,
	results = [],
	map = {},
	DEFAULT_VERSION = -1,
	MAX = {
		EXCEED: 'ex',
		OK: 'ok'
	},
	LATEST = {
		FIREFOX: 51,
		CHROME: 55,
		EDGE: 14,
		OPERA: 40
	},
	TYPE = {
		MICROSOFT: 1,
		FIREFOX: 2,
		CHROME: 3,
		OPERA: 4,
		SAFARI: 5,
		ANDROID: 6,
		SAFARI_MOBILE: 7,
		OPERA_MINI: 8,
		OPERA_ANDROID: 9,
		CHROME_MOBILE: 10,
		MICROSOFT_MOBILE: 11,
		FIREFOX_MOBILE: 12,
		BLACKBERRY: 13,
		KINDLE: 14,
		WEBVIEW: 15,
		UNKNOWN: 16,
		UNKNOWN_MOBILE: 17
	};

/**
 * @private
 * @returns {UA}
 * @constructor
 */
var Ua = function () {
	this.version = DEFAULT_VERSION;
};

/**
 * @private
 * @returns {Feature}
 * @constructor
 */
var Feature = function () {
	this.version = DEFAULT_VERSION;
};

/**
 * @private
 * @returns {Engine}
 * @constructor
 */
var Engine = function () {
	this.name = '';
	this.version = DEFAULT_VERSION;
};

/**
 * @private
 * @returns {OS}
 * @constructor
 */
var Os = function () {
	this.name = '';
	this.version = DEFAULT_VERSION + '';
};

/**
 * @private
 * @returns {Browser} Returns the Browser instance
 * @constructor
 */
var Browser = function () {
	var self = this; // here for minification purposes
	self.name = ''; // verified name
	self.trustworthy = true; // does the ua jive with the feature detection
	self.desktop = false; // is this a desktop browser
	self.mobile = false; // is this a mobile phone browser
	self.tablet = false; // is this a mobile tablet browser
	self.console = false; // is this a video game or other console browser
	self.max = MAX.OK; // by default the ua version matches what is available
	self.version = DEFAULT_VERSION; // full version
	self.ua = new Ua();
	self.feature = new Feature();
	self.engine = new Engine();
	self.os = new Os();
};

/**
 * Check for MathML support in browsers to help detect certain browser version numbers where this is the only difference.
 * @param {Document} d
 * @static
 * @returns {Boolean} returns true if browser has mathml support
 */
var mathMLSupport = function (d) {

	'use strict';

	var hasMathML = false;

	if (d.createElementNS) {
		var NAMESPACE = 'http://www.w3.org/1998/Math/MathML',
			div = d.createElement('div'),
			mfrac;

		div.style.position = 'absolute';
		div.style.top = div.style.left = 0;
		div.style.visibility = 'hidden';
		div.style.width = div.style.height = 'auto';
		div.style.fontFamily = 'serif';
		div.style.lineheight = 'normal';

		mfrac = div.appendChild(d.createElementNS(NAMESPACE,'math'))
			.appendChild(d.createElementNS(NAMESPACE,'mfrac'));

		mfrac.appendChild(d.createElementNS(NAMESPACE,'mi'))
			.appendChild(d.createTextNode('xx'));

		mfrac.appendChild(d.createElementNS(NAMESPACE,'mi'))
			.appendChild(d.createTextNode('yy'));

		d.body.appendChild(div);

		hasMathML = div.offsetHeight > div.offsetWidth;
	}

	return hasMathML;
};

/**
 * Performs a simple test to see if we're on mobile or not.
 * @param {Window=} win
 * @static
 * @returns {Boolean} returns true if mobile
 */
var isMobile = function (win) {

	win = win || window;

	try {
		win.document.createEvent('TouchEvent');
		// Surface tablets have touch events, so we use the Pointer Lock API to detect them
		return !can(win.document, 'exitPointerLock') || !can(win.document, 'mozExitPointerLock');
	} catch (e) {
		// Opera Mini and IE10M don't support touch events
		// execCommand is only on desktop browsers
		return !can(win.document, 'execCommand');
	}
};


/**
 * Saves a property to the results array and returns its index.
 * @param {*} result
 * @returns {Number}
 */
var save = function (result) {
	if (typeof result === 'boolean') {
		results.push(result === true ? '1' : '0');
	} else if (typeof result === 'number') {
		results.push(result + '');
	} else {
		results.push(result);
	}
	return results.length - 1;
};


/**
 * Uses the min and max versions of a browser to determine its version.
 * @param {Number} uaVersion
 * @param {Number} minVersion
 * @param {Number=} maxVersion
 * @static
 * @returns {Number} returns version number
 */
var getVersion = function (uaVersion, minVersion, maxVersion) {
	var actualVersion = minVersion;
	if (uaVersion >= minVersion) {
		if (!maxVersion || uaVersion <= maxVersion) {
			actualVersion = uaVersion;
		} else if (maxVersion && uaVersion > maxVersion) {
			actualVersion = maxVersion;
		}
	}
	return actualVersion;
};

/**
 * Searches for a match between the regex and specified string.
 * @param {RegExp} regex
 * @param {String} ua
 * @static
 * @returns {*|Boolean} returns true if match found
 */
var looksLike = function (regex, ua) {
	'use strict';
	return regex.test(ua);
};

/**
 * Parses the result of the RegExp match if it exists.
 * Gracefully falls back to the default version if not.
 * @param {String} ua
 * @param {RegExp} regex
 * @param {Number=} radix
 * @static
 * @returns {Number} returns the regex match or default version
 */
var parseIntIfMatch = function (ua, regex, radix) {
	return ua.match(regex) !== null ? parseInt(ua.match(regex)[1], radix || 10) : DEFAULT_VERSION;
};

/**
 * Parses the floating point value of the RegExp match if found.
 * Gracefully falls back to the default if not.
 * @param {String} ua
 * @param {RegExp} regex
 * @static
 * @returns  returns the regex match or the default version
 */
var parseFloatIfMatch = function (ua, regex) {
	return ua.match(regex) !== null ? parseFloat(ua.match(regex)[1]) : DEFAULT_VERSION;
};

/**
 * Determines the version of Android being used.
 * @param {Window} win
 * @param {Number} uaVersion
 * @static
 * @returns {Number} returns the Android version
 */
var getAndroidVersion = function (win, uaVersion) {

	var nav = win.navigator,
		androidVersion = DEFAULT_VERSION;

	if (can(nav, 'sendBeacon')) {
		androidVersion = getVersion(uaVersion, 5.0, Infinity);
	} else if (can(has('performance', win), 'now')) {
		androidVersion = getVersion(uaVersion, 4.4);
	} else if (has('FileList', win)) {
		androidVersion = getVersion(uaVersion, 4.0, 4.3);
	} else {
		androidVersion = getVersion(uaVersion, 2.1, 4.0);
	}

	return androidVersion;
};

/**
 * Determines the version of Chrome being used.
 * @param {Window} win
 * @param {Number} uaVersion
 * @static
 * @returns {Number} returns the Chrome version
 */
var getChromiumVersion = function (win, uaVersion) {

	var chromiumVersion = DEFAULT_VERSION;
	// no session history management - version 4 - api
	// geolocation - version 5 - api
	// web notifications(prefixed) - version 5 - api
	// server-sent DOM events - version 6 - api
	// FileReader - version 6 - API
	// inline svg - version 7 - html5
	// typed arrays - version 7 - api
	// classList DOMTokenList - version 8 - API
	// defer attribute for external scripts - version 8 - html5
	// progress meter - version 8 - html5
	// matchMedia - version 9 - API
	// webP image format, partial support - version 9 - other
	// form validation - version 10 - html5
	// getComputedStyle - version 11 - html5
	// IndexedDB (prefixed)- version 11 - API
	// Details and summary elements - version 12 - html5
	// Navigation timing API - version 13 - API
	// File API, full support - version 13 - API
	// Web sockets, full support - version 14 - API
	// Full screen API (prefixed)- version 15 - API
	// WebGL, 3D Canvas Graphics - version 18 - API/HTML5 -- unreliable indicator
	// WebVVT - version 18 - other
	// Blob constructing - version 20 - API
	// high resolution time api (prefixed) - version 20 - API
	// Color input type - version 20 - HTML5
	// getUserMedia API - version 21 - API
	// web notifications - version 22 - api
	// touch events - version 22 - API/HTML5
	// Blob URLs - version 23 - API
	// WebRTC Peer Connection (prefixed)- version 23 - API
	// webP image format, full support - version 23 - other
	// requestAnimationFrame - version 24 - API
	// high resolution time api - version 24 - API
	// User timing API - version 25 - API
	// web speach api(prefixed) - version 25 - api
	// shadow dom, prefixed - version 25 - html5
	// HTML templates - version 26 - html5
	// mutation observer - version 27 - API
	// Canvas blend - version 30 - API
	// vibration API - version 30 - API
	// Promises - version 32 - api
	// page visibility - version 33 - api
	// Opus codec - version 33 - other
	// matches() DOM method - version 34 - API
	// srcset attribute - version 34 - api
	// shadow dom - version 35 - api/html5
	// toolbar/context menu - version 36 - html5
	// scoped css - version 36 - html5
	if (has('Proxy', win)) {
		chromiumVersion = getVersion(uaVersion, 49, LATEST.CHROME);
	} else if (has('PushManager', win)) {
		chromiumVersion = getVersion(uaVersion, 44, 48);
	} else if (can(win.navigator, 'permissions')) {
		chromiumVersion = getVersion(uaVersion, 43);
	} else if (can(win.navigator, 'sendBeacon')) {
		chromiumVersion = getVersion(uaVersion, 39, 42);
	} else if (can(win.navigator, 'getBattery')) {
		chromiumVersion = getVersion(uaVersion, 38);
	} else if (can(has('crypto', win), 'subtle')) {
		chromiumVersion = getVersion(uaVersion, 37);
	} else if (can(new Image(), 'srcset')) { // Chrome 34+
		chromiumVersion = getVersion(uaVersion, 34, 36);
	} else if (can(win.document, 'visibilityState')) { // Chrome 33+
		chromiumVersion = getVersion(uaVersion, 33);
	} else if (has('Promise', win)) { // Chrome 32+
		chromiumVersion = getVersion(uaVersion, 32);
	} else if (can(win.navigator, 'vibrate')) { // Chrome 30+
		chromiumVersion = getVersion(uaVersion, 30, 31);
	} else if (has('MutationObserver', win)) { // Chrome 27+
		chromiumVersion = getVersion(uaVersion, 27, 29);
	} else if (can(win.document.createElement('template'), 'content')) { // Chrome 26+
		chromiumVersion = getVersion(uaVersion, 26);
	} else if (can(has('performance', win), 'mark')) { // Chrome 25+
		chromiumVersion = getVersion(uaVersion, 25);
	} else if (has('requestAnimationFrame', win)) { // Chrome 24+
		chromiumVersion = getVersion(uaVersion, 24);
	} else if (can(has('URL', win), 'createObjectURL')) { // Chrome 23+
		chromiumVersion = getVersion(uaVersion, 23);
	} else if (has('Notification', win)) { // Chrome 22+
		chromiumVersion = getVersion(uaVersion, 22);
	} else if (can(win.navigator, 'webkitGetUserMedia')) { // Chrome 21+
		chromiumVersion = getVersion(uaVersion, 21);
	} else if (has('Blob', win)) { // Chrome 20+
		chromiumVersion = getVersion(uaVersion, 20);
	} else if (can(win.document, 'webkitRequestFullscreen')) { // Chrome 15+
		chromiumVersion = getVersion(uaVersion, 15, 19);
	} else if (can(has('performance', win), 'timing')) { // Chrome 13+
		chromiumVersion = getVersion(uaVersion, 13, 14);
	} else if (can(win.document.createElement('details'), 'open')) { // Chrome 12+
		chromiumVersion = getVersion(uaVersion, 12);
	} else if (has('webkitIndexedDB', win)) { // Chrome 11+
		chromiumVersion = getVersion(uaVersion, 11);
	} else if (can(win.document.createElement('input'), 'checkValidity')) { // Chrome 10+
		chromiumVersion = getVersion(uaVersion, 10);
	} else if (has('matchMedia', win)) { // Chrome 9+
		chromiumVersion = getVersion(uaVersion, 9);
	} else if (can(win.document.createElement('_'), 'classList')) { // Chrome 8+
		chromiumVersion = getVersion(uaVersion, 8);
	} else if (has('Uint32Array', win)) { // Chrome 7+
		chromiumVersion = getVersion(uaVersion, 7);
	} else if (has('FileReader', win)) { // Chrome 6+
		chromiumVersion = getVersion(uaVersion, 6);
	} else if (has('webkitNotification', win)) { // Chrome 5+
		chromiumVersion = getVersion(uaVersion, 5);
	} else if (can(has('history', win), 'replaceState')) { // Chrome 4+
		chromiumVersion = getVersion(uaVersion, 4);
	} else {
		chromiumVersion = getVersion(uaVersion, 0, 3);
	}
	return chromiumVersion;
};

/**
 * @private
 * @param {Window} win
 * @param {Number} uaVersion
 * @returns {Number}
 */
var getGeckoVersion = function (win, uaVersion) {

	var geckoVersion = DEFAULT_VERSION,
		d = win.document,
		nav = win.navigator;
	// Detect all versions of browsers who are using gecko as their rendering engine, prioritizing Firefox

	// all versions:
	// optimal version coverage:
	// versions accounted for:
	// versions covered by feature testing:
	if (has('PushManager', win)) {
		geckoVersion = getVersion(uaVersion, 44, LATEST.FIREFOX);
	} else if (has('MessageChannel', win)) {
		geckoVersion = getVersion(uaVersion, 41, 43);
	} else if (has('fetch', win)) {
		geckoVersion = getVersion(uaVersion, 39, 40);
	} else if (can(has('performance', win), 'mark')) {
		geckoVersion = getVersion(uaVersion, 38);
	} else if (can(has('crypto', win), 'subtle')) {
		geckoVersion = getVersion(uaVersion, 34, 37);
	} else if (can(win.navigator, 'sendBeacon')) {
		geckoVersion = getVersion(uaVersion, 31, 33);
	} else if (has('SharedWorker', win)) { // FF 29+
		geckoVersion = getVersion(uaVersion, 29, 30);
	} else if (has('AudioContext', win)) { // FF 25+
		geckoVersion = getVersion(uaVersion, 25, 28);
	} else if (has('requestAnimationFrame', win)) { // FF 23+
		geckoVersion = getVersion(uaVersion, 23, 24);
	} else if (has('Notification', win)) { // FF 22+
		geckoVersion = getVersion(uaVersion, 22);
	} else if (can(d, 'hidden')) { // FF 18+
		geckoVersion = getVersion(uaVersion, 18, 21);
	} else if (can(nav, 'mozGetUserMedia')) { // FF 17+
		geckoVersion = getVersion(uaVersion, 17);
	} else if (has('indexedDB', win)) { // FF 16+
		geckoVersion = getVersion(uaVersion, 16);
	} else if (can(has('performance', win), 'now')) { // FF 15+
		geckoVersion = getVersion(uaVersion, 15);
	} else if (has('MutationObserver', win)) { // FF 14+
		geckoVersion = getVersion(uaVersion, 14);
	} else if (has('Blob', win)) { // FF 13+
		geckoVersion = getVersion(uaVersion, 13);
	} else if (has('WebSocket', win)) { // FF 11+
		geckoVersion = getVersion(uaVersion, 11, 12);
	} else if (can(nav, 'mozBattery')) { // FF 10+
		geckoVersion = getVersion(uaVersion, 10);
	} else if (can(has('performance', win), 'timing')) { // FF 7+
		geckoVersion = getVersion(uaVersion, 7, 9);
	} else if (has('matchMedia', win)) { // FF 6+
		geckoVersion = getVersion(uaVersion, 6);
	} else if (has('Uint32Array', win)) { // FF 4+
		geckoVersion = getVersion(uaVersion, 4, 5);
	} else if (has('FileReader', win)) { // FF 3.6
		geckoVersion = getVersion(uaVersion, 3.6);
	} else if (has('JSON', win)) { // FF 3.5+
		geckoVersion = getVersion(uaVersion, 3.5);
	} else if (has('postMessage', win)) { // FF 3+
		geckoVersion = getVersion(uaVersion, 3);
	} else {
		geckoVersion = getVersion(uaVersion, 0, 2.9);
	}

	return geckoVersion;
};

/**
 * @private
 * @param {Window} win
 * @param {Number} uaVersion
 * @returns {Number}
 */
var getTridentVersion = function (win, uaVersion) {

	var tridentVersion = DEFAULT_VERSION,
		d = win.document;
	// Detect all IE versions possible by feature detection

	// all versions:						1.0, 2.0, 3.0, 4.0, 5.0, 5.2, 5.5, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0
	// optimal version coverage:			6.0, 7.0, 8.0, 9.0, 10.0, 11.0
	// versions accounted for:				3-11
	// versions covered by feature testing: 3.0, 4.0, 5.0, 5.5, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0
	if (can(d, 'pointerLockElement')) {
		tridentVersion = getVersion(uaVersion, 13, LATEST.EDGE);
	} else if (has('Proxy', win)) {
		tridentVersion = getVersion(uaVersion, 12);
	} else if (has('MutationObserver', win)) { // IE 11+
		tridentVersion = getVersion(uaVersion, 11);
	} else if (has('atob', win)) { // IE 10+
		tridentVersion = getVersion(uaVersion, 10);
	} else if (has('addEventListener', win)) { // IE 9+
		tridentVersion = getVersion(uaVersion, 9);
	} else if (has('localStorage', win)) { // IE 8+
		tridentVersion = getVersion(uaVersion, 8);
	} else if (can(d, 'all') && has('XMLHttpRequest', win) && !has('XDomainRequest', win) && !has('opera', win)) { // IE 7
		tridentVersion = getVersion(uaVersion, 7);
	} else if (can(d, 'all') && !has('XMLHttpRequest', win)) { // IE 6
		tridentVersion = getVersion(uaVersion, 6);
	} else { // IE 3 - 5.5
		tridentVersion = DEFAULT_VERSION;
	}

	return tridentVersion;
};

 /**
 * See https://en.wikipedia.org/wiki/Trident_(layout_engine)
 * @private
 * @param {Number} ver
 * @returns {Number}
 */
var getTridentEngineVersion = function (ver) {

	var engineVersion = DEFAULT_VERSION;

	if (ver >= 11) {
		engineVersion = 7;
	} else if (ver === 10) {
		engineVersion = 6;
	} else if (ver === 9) {
		engineVersion = 5;
	} else if (ver === 8) {
		engineVersion = 4;
	} else if (ver <= 7) {
		engineVersion = 3;
	}

	return engineVersion;
};

/**
 * Returns the version of the Safari browser.
 * @param {Window} win
 * @param {Number} uaVersion
 * @static
 * @returns {Number} returns the version of Safari
 */
var getSafariVersion = function (win, uaVersion) {

	var safariVersion = DEFAULT_VERSION,
		d = win.document,
		nav = win.navigator;

	if (can(has('CSS', win), 'supports')) {
		safariVersion = getVersion(uaVersion, 9.0, Infinity);
	} else if (has('indexedDB', win)) {
		safariVersion = getVersion(uaVersion, 8.0, 8.4);
	} else if (has('execCommand', d)) {
		safariVersion = getVersion(uaVersion, 7.0, 7.1);
	} else if (has('requestAnimationFrame', win)) {
		safariVersion = getVersion(uaVersion, 6.0, 6.1);
	} else if (has('Uint32Array', win)) {
		// Safari 6533.18.5 - iOS 4.3.5
		safariVersion = getVersion(uaVersion, 5.1);
	} else if (can(nav, 'geolocation')) {
		safariVersion = getVersion(uaVersion, 5.0);
	} else if (can(nav, 'onLine')) {
		safariVersion = getVersion(uaVersion, 4.2, 4.3);
	} else if (has('JSON', win)) {
		// Safari 6531.22.7 - iOS 4.0.2
		safariVersion = getVersion(uaVersion, 4.0, 4.1);
	} else if (has('postMessage', win)) {
		// webkit 531.21.10 - iOS 3.2.2
		// webkit 528.16 - iOS 3.1.3
		safariVersion = getVersion(uaVersion, 3.2);
	} else {
		safariVersion = getVersion(uaVersion, 0, 3.1);
	}

	return safariVersion;
};

/**
 * Creates a Browser instance with its attributed Kindle values.
 * @param {Window} win
 * @param {Number} uaVersion
 * @static
 * @returns {Number}
 */
var getKindleVersion = function (win, uaVersion) {

	var kindleVersion = DEFAULT_VERSION,
		d = win.document;

	if (can(d, 'pointerLockElement')) {
		kindleVersion = getVersion(uaVersion, 3.0, Infinity);
	} else if (has('PerformanceTiming', win)) {
		kindleVersion = getVersion(uaVersion, 2.0);
	} else {
		kindleVersion = getVersion(uaVersion, 1.0);
	}

	return kindleVersion;
};

/**
 * Creates a Browser instance with its attributed OS and device type values.
 * @param {Window} win
 * @param {String} ua
 * @static
 * @returns {Browser} returns the browser instance
 */
var getOtherOS = function (win, ua) {

	var otherBrowser = new Browser();

	if (has('wiiu', win)) {
		otherBrowser.os.name = 'Wii';
		otherBrowser.os.version = 'U';
		otherBrowser.name = 'NetFront';
		otherBrowser.console = true;
	} else if (looksLike(/Wii/i, ua)) {
		otherBrowser.os.name = 'Wii';
		otherBrowser.name = 'NetFront';
		otherBrowser.console = true;
	} else if (looksLike(/PlayStation.4/i, ua)) {
		otherBrowser.os.name = 'PlayStation';
		otherBrowser.os.version = '4';
		otherBrowser.name = 'NetFront';
		otherBrowser.console = true;
	} else if (looksLike(/PlayStation/i, ua)) {
		otherBrowser.os.name = 'PlayStation';
		otherBrowser.os.version = '3';
		otherBrowser.console = true;
	} else if (looksLike(/NgetOtherOSokiaN/i, ua)) {
		otherBrowser.os.name = 'Symbian';
		otherBrowser.mobile = true;
	} else if (looksLike(/blackberry|RIM/i, ua)) {
		otherBrowser.os.name = 'Blackberry';
		otherBrowser.mobile = true;
	} else if (win.navigator && win.navigator.platform === 'X11' || looksLike(/Linux/i, ua)) {
		otherBrowser.os.name = 'Linux';
		otherBrowser.desktop = true;
	} else {
		otherBrowser.os.name = 'Unknown';
	}
	return otherBrowser;
};

/**
 * Creates a Browser instance with its attributed Apple values.
 * @param {Window} win
 * @param {String} ua
 * @static
 * @returns {Browser} returns the Browser instance
 */
var getAppleOS = function (win, ua) {

	var mac = /Mac/i,
		iOS = /iPhone|iPad|iPod/i,
		appleBrowser = new Browser(),
		iOSVersion = DEFAULT_VERSION,
		macVersion = DEFAULT_VERSION;

	// Mozilla/5.0 (iPhone; CPU iPhone OS 7_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D167 Safari/9537.53
	// webviews will not have Safari in their user-agent string
	if ((iOS.test(ua) || iOS.test(win.navigator.platform)) || !looksLike(/Safari|Firefox|Chrome/i, ua)) {
		if (!looksLike(/Version\/\d\.\d/i, ua)) {
			appleBrowser.ua.version = '2.0';
		} else {
			if (looksLike(/.OS.(\d.\d+)/i, ua)) {
				iOSVersion = (ua.match(/.OS.(\d.\d+)/i)[1].replace('_','.'));
			} else if (looksLike(/.Version\/(\d\.\d+)/i, ua)) {
				iOSVersion = (ua.match(/.Version\/(\d\.\d+)/i)[1]);
			}
		}
		appleBrowser.ua.version = appleBrowser.os.version = iOSVersion;
		appleBrowser.os.name = 'iOS';
		appleBrowser.tablet = /ipad/i.test(win.navigator.platform);
		appleBrowser.mobile = /iphone|ipod/i.test(win.navigator.platform);
	} else if (mac.test(ua) || mac.test(win.navigator.platform)) {
		macVersion = parseIntIfMatch(ua, /Mac.OS.X.10.(\d+)/i, 10); // this format was introduced at 3.0+
		if (macVersion > 0) {
			appleBrowser.os.name = 'Mac';
			appleBrowser.os.version = '10.' + macVersion;
		}
		appleBrowser.desktop = true;
	}

	return appleBrowser;
};

/**
 * Creates a Browser instance with its attributed Windows values.
 * @param {Window} win
 * @param {String} ua
 * @static
 * @returns {Browser} returns the Browser instance
 */
var getMicrosoftOS = function (win, ua) {

	var microsoftBrowser = new Browser();

	if (looksLike(/XBox One/i, ua)) {
		microsoftBrowser.os.name = 'Xbox';
		microsoftBrowser.os.version = 'One';
		microsoftBrowser.name = 'Internet Explorer';
		microsoftBrowser.version = '10.0';
		microsoftBrowser.console = true;
	} else if (looksLike(/Xbox/i, ua)) {
		microsoftBrowser.os.name = 'Xbox';
		microsoftBrowser.os.version = '360';
		microsoftBrowser.name = 'Internet Explorer';
		microsoftBrowser.version = '7.0';
		microsoftBrowser.console = true;
	} else {
		microsoftBrowser.os.name = 'Windows';
		if (looksLike(/IEMobile/i, ua)) {
			microsoftBrowser.mobile = true;
			microsoftBrowser.os.name = 'Windows Phone';
			if (looksLike(/Windows.Phone.(?:os)?\s?(\d\d?\.?\d?\d?)/i, ua)) {
				microsoftBrowser.os.version = ua.match(/Windows.Phone.(?:os)?\s?(\d\d?\.?\d?\d?)/i)[1];
			} else if (looksLike(/WP(\d\d?\.?\d?\d?)/i, ua)) {
				microsoftBrowser.os.version = ua.match(/WP(\d\d?\.?\d?\d?)/i)[1];
			}
		} else if (looksLike(/Windows.NT./i, ua)) {
			microsoftBrowser.desktop = true;
			var pcVersion = parseFloatIfMatch(ua, /Windows.NT.(\d\d?\.?\d?\d?)/i); // this format was introduced at 3.0+
			// List pulled from http://msdn.microsoft.com/en-us/library/ms537503(v=vs.85).aspx
			switch (pcVersion) {
				case 10:
					microsoftBrowser.os.version = '10.0';
					break;
				case 6.3:
					microsoftBrowser.os.version = '8.1';
					break;
				case 6.2:
					microsoftBrowser.os.version = '8';
					break;
				case 6.1:
					microsoftBrowser.os.version = '7';
					break;
				case 6:
					microsoftBrowser.os.version = 'Vista';
					break;
				case 5.2:
					microsoftBrowser.os.version = '2003';
					break;
				case 5.1:
					microsoftBrowser.os.version = 'XP';
					break;
				case 5.01:
					microsoftBrowser.os.version = '2000 SP1';
					break;
				case 5:
					microsoftBrowser.os.version = '2000';
					break;
				case 4:
					microsoftBrowser.os.version = 'NT';
					break;
				default:
					microsoftBrowser.os.version = DEFAULT_VERSION;
			}
		} else if (looksLike(/Windows.9(\d)/i, ua)) {
			microsoftBrowser.os.version = '9x'; // 95, 98, or Me, which all must have a market share of nothingness by now so we dont care which it is
			microsoftBrowser.desktop = true;
		} else if (looksLike(/Windows.CE/i, ua)) {
			microsoftBrowser.os.version = 'CE'; // only matters that its mobile
			microsoftBrowser.mobile = true;
		} else {
			microsoftBrowser.os.version = DEFAULT_VERSION + '';
			microsoftBrowser.desktop = true;
		}
	}
	// special detection for MS Surfaces specifically
	if(looksLike(/Touch/i, ua) && !looksLike(/IEMobile/i, ua)) {
		microsoftBrowser.os.name = 'Window RT';
	}

	return microsoftBrowser;
};

/**
 * Creates a Browser instance with its attributed Android values.
 * @param {Window} win
 * @param {String} ua
 * @static
 * @returns {Browser} returns the Browser instance
 */
var getAndroidOS = function (win, ua) {

	var androidBrowser = new Browser();

	androidBrowser.ua.version = parseFloatIfMatch(ua, /Android\s(\d+\.\d+)/i);
	androidBrowser.os.name = 'Android';
	androidBrowser.mobile = true;

	if (looksLike(/Chrome/i, ua)) {
		// modern Android browsers use the chrome engine
		androidBrowser.engine.name = 'chrome';
		androidBrowser.engine.version = parseIntIfMatch(ua, /Chrome\/(\d+)/i, 10);
	} else if (looksLike(/AppleWebKit/i, ua)) {
		// old Android browsers uses webkit
		androidBrowser.engine.name = 'webkit';
		androidBrowser.engine.version = parseIntIfMatch(ua, /AppleWebKit\/(\d+)/i, 10);
	} else {
		androidBrowser.engine.name = 'unknown';
	}
	// for now, we use the same logic for Android's browser and os detection
	androidBrowser.os.version = getAndroidVersion(win, androidBrowser.ua.version) + '';

	return androidBrowser;
};

/**
 * Returns the Kindle's OS.
 * @param {Window} win
 * @param {String} ua
 * @static
 * @returns {Browser} returns the Browser instance
 */
var getKindleOS = function (win, ua) {

	var kindleBrowser = new Browser();

	if (looksLike(/Silk/i, ua)) {
		kindleBrowser.engine.name = 'silk';
		kindleBrowser.engine.version = parseIntIfMatch(ua, /Silk\/(\d+)/i, 10);
		// set the detected version equal to silk by default
		kindleBrowser.ua.verison = kindleBrowser.engine.version;
	} else if (looksLike(/AppleWebKit/i, ua)) {
		kindleBrowser.engine.name = 'webkit';
		kindleBrowser.engine.version = parseIntIfMatch(ua, /AppleWebKit\/(\d+)/i, 10);
		// if the kindle doesn't have silk in the userAgent, something is wonky
		kindleBrowser.ua.version = 1;
	}

	if (looksLike(/Version/i, ua)) {
		// some kindles have a Version property in their userAgent
		kindleBrowser.ua.version = parseFloatIfMatch(ua, /Version\/(\d+\.\d+)/i);
	}

	kindleBrowser.version = getKindleVersion(win, kindleBrowser.ua.version);
	kindleBrowser.tablet = true;

	return kindleBrowser;
};

/**
 * Reads the user agent string to determine OS.
 * @param {Window} win
 * @param  {String} ua
 * @static
 * @returns {Browser} returns the Browser instance
 */
var getOsFromUa = function (win, ua) {

	var unknownOS = new Browser();

	if (looksLike(/Win|IEMobile/i, ua)) {
		unknownOS = getMicrosoftOS(win, ua);
	} else if (looksLike(/Mac|iPhone|iPad|iPod/i, ua)) {
		unknownOS = getAppleOS(win, ua);
	} else if (looksLike(/Android/i, ua)) {
		unknownOS = getAndroidOS(win, ua);
	} else if (looksLike(kindleBrowser, ua)) {
		unknownOS = getKindleOS(win, ua);
	} else {
		unknownOS = getOtherOS(win, ua);
	}
	return unknownOS;
};

/**
 * Returns an object containing browser details (e.g. name, os, version, etc.).
 * @param {Window=} win
 * @param {String=} userAgent
 * @static
 * @returns {Browser} returns the Browser instance
 * @example
 * ```js
 * var os = browser.detect().os.name;
 *
 * console.log(os); // outputs OS name (e.g. Windows, Mac, Android, etc.)
 * ```
 */
var detect = function (win, userAgent) {

	var detectedBrowser = new Browser(),
		browserType = '',
		w = win || window,
		d = w.document,
		ua = userAgent || w.navigator.userAgent,
		nav = w.navigator,
		style = w.document.documentElement.style;

	// reset the results array
	results = [];

	// see if this is a mobile browser
	detectedBrowser.mobile = isMobile(w);

	// run thru mobile detection first if applicable
	if (detectedBrowser.mobile) {
		// MS Surfaces pass the mobile test, so we account for them here
		// IE Mobile sometimes contain touch in the UA
		if (looksLike(/Win/i, ua) && looksLike(/Touch/i, ua) && !looksLike(/IEMobile/i, ua)) {
			browserType = TYPE.MICROSOFT;
		// Kindle feature support varies greatly, and they retain low market-share, so we trust the user agent for now
		} else if (looksLike(kindleBrowser, ua)) {
			browserType = TYPE.KINDLE;
		} else if (can(nav, 'permissions')) {
			// Chrome is the only mobile platform with permissions
			browserType = TYPE.CHROME_MOBILE;
		} else if (has('ondevicelight', w)) {
			// Only FF Mobile has the ambient light API
			browserType = TYPE.FIREFOX_MOBILE;
		} else if (has('setImmediate', w)) {
			// IE is the only mobile with setImmediate
			browserType = TYPE.MICROSOFT_MOBILE;
		} else if (!has('matchMedia', w)) {
			// only Opera Mini lacks matchMedia, thanks for making this easy Opera!
			browserType = TYPE.OPERA_MINI;
		} else if (has('speechSynthesis', w) && !has('Intl', w)) {
			// iOS has never supported the Intl api
			// iOS Safari has speech synth support that goes way back to older versions too
			browserType = TYPE.SAFARI_MOBILE;
		} else if (has('isFinite', w) || can(has('connection', nav), 'type')) {
			// Android is the only remaining one with isFinite
			// Very old Android supports nav.connection.type
			if (mathMLSupport(d)) {
				// Detect mathML to find webviews reporting themselves as Android
				browserType = TYPE.WEBVIEW;
			} else {
				// Android has never supported mathML as of 4.4.4
				browserType = TYPE.ANDROID;
			}
		} else if (!has('Intl', w)) {
			// blackBerry is the only one left without Internationalization
			browserType = TYPE.BLACKBERRY;
		} else if (has('webkitRequestFileSystem', w)) {
			// Opera is the only one remaining with a File System API
			browserType = TYPE.OPERA_ANDROID;
		} else {
			browserType = TYPE.UNKNOWN_MOBILE;
		}
	} else if (!has('Notification', w) && (!has('EventSource', w) && can(nav, 'onLine')) ) {
		browserType = TYPE.MICROSOFT;
	} else if (has('InstallTrigger', w)) {
		browserType = TYPE.FIREFOX;
	} else if (has('chrome', w) && !has('opera', w) && !looksLike(/\sOPR\/\d+/i, ua)) {
		browserType = TYPE.CHROME;
	} else if (has('opera', w) || looksLike(/\sOPR\/\d+/i, ua)) {
		browserType = TYPE.OPERA;
	} else if (!has('webkitRequestFileSystem', w) && !has('Intl', w)) {
		browserType = TYPE.SAFARI;
	} else {
		browserType = TYPE.UNKNOWN;
	}

	// now that we know the environment, we run feature detection specific to it
	if (browserType === TYPE.MICROSOFT) {

		detectedBrowser = getMicrosoftOS(w, ua);
		detectedBrowser.engine.name = 'trident';
		detectedBrowser.ua.version = parseIntIfMatch(ua, /Edge\/(\d+)/i, 10);

		if (detectedBrowser.ua.version === DEFAULT_VERSION) {
			detectedBrowser.ua.version = parseIntIfMatch(ua, /MSIE\/(\d+)/i, 10);
		}

		detectedBrowser.version = getTridentVersion(w, detectedBrowser.ua.version);
		detectedBrowser.engine.version = getTridentEngineVersion(detectedBrowser.version);

		if (detectedBrowser.version >= 12) {
			detectedBrowser.name = 'Edge';
		} else {
			detectedBrowser.name = 'Internet Explorer';
		}

		if (detectedBrowser.name === 'Edge' && !looksLike(/Edge/i, ua)) {
			detectedBrowser.trustworthy = false;
		} else if (detectedBrowser.name === 'Internet Explorer' && (!looksLike(/MSIE/i, ua) && !looksLike(/Trident/i, ua))) {
			detectedBrowser.trustworthy = false;
		}

	} else if (browserType === TYPE.FIREFOX) {

		detectedBrowser = getOsFromUa(w, ua);
		detectedBrowser.name = 'Firefox';
		detectedBrowser.engine.name = 'gecko';
		detectedBrowser.engine.version = parseIntIfMatch(ua, /rv:(\d+)/i, 10);
		detectedBrowser.ua.version = parseIntIfMatch(ua, /Firefox\/(\d+)/i, 10);
		detectedBrowser.version = getGeckoVersion(w, detectedBrowser.ua.version);

		if (!looksLike(/Firefox/i, ua)) { detectedBrowser.trustworthy = false; }

	} else if (browserType === TYPE.CHROME) {
		// Detect all chrome versions possible by feature detection

		// all versions:						1-38
		// optimal version coverage:			21, 35, 36, 37, 38
		// versions accounted for:				4-38
		// versions covered by feature testing: 4-13, 15, 20-27, 30, 32-34
		detectedBrowser = getOsFromUa(w, ua);
		detectedBrowser.engine.name = has('CSS', w) ? 'blink' : 'webkit'; // should be all of version 27+ on blink
		// chrome uses a standard ua format and can always supported indexOf
		detectedBrowser.engine.version = parseIntIfMatch(ua, /Chrome\/(\d+)/i, 10);
		detectedBrowser.ua.version = detectedBrowser.engine.version;
		detectedBrowser.version = getChromiumVersion(w, detectedBrowser.ua.version);

		detectedBrowser.name = 'Chrome';

		if (!looksLike(/Chrome/i, ua)) { detectedBrowser.trustworthy = false; }

	} else if (browserType === TYPE.OPERA) {
		detectedBrowser = getOsFromUa(w, ua);

		if (looksLike(/Presto\/(\d+\.\d+)/i, ua)) {
			detectedBrowser.engine.version = parseFloatIfMatch(ua, /Presto\/(\d+\.\d+)/i);
		} else if (looksLike(/AppleWebKit\/(\d+)/i, ua)) {
			detectedBrowser.engine.version = parseIntIfMatch(ua, /AppleWebKit\/(\d+)/i, 10);
		}

		if (looksLike(/Nintendo/i, ua)) {
			detectedBrowser.engine.name = 'presto';
			detectedBrowser.version = '9.0';
			detectedBrowser.console = true;
		} else {
			if (can(has('opera', w), 'version')) {
				detectedBrowser.feature.version = parseFloat(w.opera.version()); // presto reveals its version via api
				detectedBrowser.version = detectedBrowser.feature.version;
				detectedBrowser.engine.name = 'presto'; // should be all of version 27+ on blink
			} else {
				detectedBrowser.version = getChromiumVersion(w, detectedBrowser.ua.version);
				detectedBrowser.engine.name = 'blink'; // chrome's blink engine would be the version of the engine here
				detectedBrowser.engine.version = detectedBrowser.version; // chrome's blink engine would be the version of the engine here

				if (looksLike(/OPR\/\d+.\d+/i, ua)) {
					detectedBrowser.ua.version = parseFloatIfMatch(ua, /OPR\/\d+.\d+/i);
				}

				if (detectedBrowser.version >= 28) { // chrome version is 28+ then it's on chrome's release cycle.
					detectedBrowser.version = getVersion(detectedBrowser.ua.version, detectedBrowser.version - 13, LATEST.OPERA); // Guess the version based on chrome's version.
				}
			}
		}

		detectedBrowser.name = 'Opera';

		if (!looksLike(/Opera/i, ua)) { detectedBrowser.trustworthy = false; }

	} else if (browserType === TYPE.SAFARI) {
		detectedBrowser = getOsFromUa(w, ua);
		detectedBrowser.engine.version = parseIntIfMatch(ua, /AppleWebKit\/(\d+)/, 10);
		// all versions:						0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 2.0, 3.0, 3.1, 3.2, 4.0, 4.1, 5.0, 5.1, 6.0, 6.1, 7.0, 8.0
		// optimal version coverage:			6.1, 7.0, 8.0
		// versions accounted for:				*
		// versions covered by feature testing: 3.2, 4.0, 4.2, 5.0, 6.0, 7.0
		detectedBrowser.desktop = true;

		if (looksLike(/Version\/(\d\.\d)/i, ua)) {
			detectedBrowser.ua.version = parseFloatIfMatch(ua, /Version\/(\d\.\d)/i); // this format was introduced at 3.0+browser.ua.version = parseFloat(ua.match()[1]);
		}

		if (looksLike(/Mac.OS.X.10.(\d+)/i, ua)) {
			var macVersion = parseIntIfMatch(ua, /Mac.OS.X.10.(\d+)/i, 10); // this format was introduced at 3.0+
			if (macVersion > 0) {
				detectedBrowser.os.name = 'Mac';
				detectedBrowser.os.version = '10.' + macVersion;
			} else {
				detectedBrowser = getOsFromUa(w, ua);
			}
		} else {
			detectedBrowser = getOsFromUa(w, ua);
		}

		detectedBrowser.name = 'Safari';
		detectedBrowser.engine.name = 'webkit';
		detectedBrowser.version = getSafariVersion(w, detectedBrowser.ua.version);

		if (!looksLike(/Safari/i, ua)) {
			detectedBrowser.trustworthy = false;
		}

	} else if (browserType === TYPE.ANDROID) {

		detectedBrowser = getAndroidOS(w, ua);
		detectedBrowser.name = 'Android';
		detectedBrowser.version = getAndroidVersion(w, detectedBrowser.ua.version);

		if (!looksLike(/Android/i, ua) || !looksLike(/Mobile/i, ua)) { detectedBrowser.trustworthy = false; }

	} else if (browserType === TYPE.SAFARI_MOBILE) {

		detectedBrowser = getAppleOS(w, ua);
		// Feature detect Mobile Safari so we can tell if it's the real deal or an imposter
		detectedBrowser.name = 'Mobile Safari';
		detectedBrowser.engine.name  = 'webkit';
		detectedBrowser.engine.version = parseIntIfMatch(ua, /AppleWebKit\/(\d+)/, 10);
		if (looksLike(/Version\/(\d\.\d)/i, ua)) {
			detectedBrowser.ua.version = parseFloatIfMatch(ua, /Version\/(\d\.\d)/i); // this format was introduced at 3.0+browser.ua.version = parseFloat(ua.match()[1]);
		}
		// all versions:						1.0, 1.1, 2.0, 2.1, 2.2, 3.0, 3.1, 3.2, 4.0, 4.1, 4.2, 4.3, 5.0, 5.1, 6.0, 6.1, 7.0, 7.1, 8.0
		// optimal version coverage:			6.x, 7.x, 8.x
		// versions accounted for:				*
		// versions covered by feature testing:	3.2, 4.0, 4.2, 5.0, 6.0, 7.0, 8.0
		detectedBrowser.version = getSafariVersion(w, detectedBrowser.ua.version);
		detectedBrowser.os.version = detectedBrowser.version;

		if (!looksLike(/Safari/i, ua) || !looksLike(/iPhone|iPad/i, ua)) { detectedBrowser.trustworthy = false; }

	} else if (browserType === TYPE.CHROME_MOBILE) {
		detectedBrowser = getOsFromUa(w, ua);
		detectedBrowser.name = 'Chrome Android';
		detectedBrowser.ua.version = parseIntIfMatch(ua, /Chrome\/(\d+)/i, 10); // we trust the UA for now
		detectedBrowser.version = detectedBrowser.ua.version;
		if (!looksLike(/Chrome/i, ua) || !looksLike(/Mobile/i, ua)) { detectedBrowser.trustworthy = false; }

	} else if (browserType === TYPE.FIREFOX_MOBILE) {
		detectedBrowser = getOsFromUa(w, ua);
		detectedBrowser.name = 'Firefox Android';
		detectedBrowser.ua.version = parseIntIfMatch(ua, /Firefox\/(\d+)/i, 10); // we trust the UA for now
		detectedBrowser.version = detectedBrowser.ua.version;
		if (!looksLike(/Firefox/i, ua) || !looksLike(/Mobile/i, ua)) { detectedBrowser.trustworthy = false; }

	} else if (browserType === TYPE.MICROSOFT_MOBILE) {
		detectedBrowser = getMicrosoftOS(w, ua);
		detectedBrowser.name = 'Mobile IE';
		detectedBrowser.ua.version = parseIntIfMatch(ua, /IEMobile\/(\d+)/i, 10); // we trust the UA for now
		detectedBrowser.version = detectedBrowser.ua.version;
		if (!looksLike(/MSIE/i, ua) || !looksLike(/IEMobile/i, ua)) { detectedBrowser.trustworthy = false; }

	} else if (browserType === TYPE.WEBVIEW) {
		detectedBrowser = getAppleOS(w, ua);
		detectedBrowser.name = 'iOS Webview';
		if (!looksLike(/iPhone|iPad|iPod/i, ua) || !looksLike(/Mobile/i, ua)) { detectedBrowser.trustworthy = false; }
	} else if (browserType === TYPE.OPERA_MINI) {
		detectedBrowser = getOsFromUa(w, ua);
		detectedBrowser.name = 'Opera Mini';
		detectedBrowser.ua.version = parseIntIfMatch(ua, /Opera Mini\/(\d+)/i, 10); // we trust the UA for now
		detectedBrowser.version = detectedBrowser.ua.version;
		if (!looksLike(/Opera/i, ua) || !looksLike(/Mini/i, ua)) { detectedBrowser.trustworthy = false; }

	} else if (browserType === TYPE.OPERA_ANDROID) {
		detectedBrowser = getOsFromUa(w, ua);
		detectedBrowser.name = 'Opera Android';
		detectedBrowser.ua.version = parseIntIfMatch(ua, /Opera\/(\d+)/i, 10); // we trust the UA for now
		detectedBrowser.version = detectedBrowser.ua.version;
		if (!looksLike(/Opera/i, ua) || !looksLike(/Android/i, ua)) { detectedBrowser.trustworthy = false; }

	} else if (browserType === TYPE.KINDLE) {
		detectedBrowser = getKindleOS(w, ua);
		detectedBrowser.name = 'Kindle';
		// we rely on the user agent for all kindle detection, so we can't detect untrustworthiness
	} else if (browserType === TYPE.UNKNOWN || browserType === TYPE.UNKNOWN_MOBILE) {
		if (can(style, 'KhtmlUserInput')) {
			detectedBrowser.name = 'Linux Browser';
			detectedBrowser.engine.name = 'khtml';
			detectedBrowser.os.name = 'Linux';
			detectedBrowser.desktop = true;
		} else {
			detectedBrowser = getOsFromUa(w, ua);
			detectedBrowser.name = 'Unknown';
			detectedBrowser.engine.name = 'Unknown';
			detectedBrowser.os.name = 'Unknown';
		}
	}

	// if the user agent version is beyond 
	if (detectedBrowser.ua.version > detectedBrowser.version) {
		detectedBrowser.max = MAX.EXCEED;
	}

	map.TRUSTWORTHY = save(detectedBrowser.trustworthy);
	map.BROWSER_NAME = save(detectedBrowser.name);
	map.BROWSER_VERSION = save(detectedBrowser.version);
	map.ENGINE_NAME = save(detectedBrowser.engine.name);
	map.ENGINE_VERSION = save(detectedBrowser.engine.version);
	map.OS_NAME = save(detectedBrowser.os.name);
	map.OS_VERSION = save(detectedBrowser.os.version);
	map.DESKTOP = save(detectedBrowser.desktop);
	map.MOBILE = save(detectedBrowser.mobile);
	map.TABLET = save(detectedBrowser.tablet);
	map.CONSOLE = save(detectedBrowser.console);
	map.MAX = save(detectedBrowser.max);

	detectedBrowser.isIE = (detectedBrowser.name === 'Internet Explorer');
	detectedBrowser.isFF = (detectedBrowser.name === 'Firefox');
	detectedBrowser.isOpera = (detectedBrowser.name === 'Opera');
	detectedBrowser.isChrome = (detectedBrowser.name === 'Chrome');
	detectedBrowser.isSafari = (detectedBrowser.name === 'Safari');

	/**
	 * Retrieve any results in the map by name because they're returned in an array without names.
	 * @param {String} key
	 * @returns {*}
	 */
	module.exports.read = function (key) {
		return results[key];
	};

	module.exports.map = map;
	module.exports.results = results;
	module.exports.details = detectedBrowser;

	return detectedBrowser;
};

exports.detect = detect;
exports.isMobile = isMobile;
exports.mathMLSupports = mathMLSupport;
exports.getVersion = getVersion;
exports.looksLike = looksLike;
exports.parseIntIfMatch = parseIntIfMatch;
exports.parseFloatIfMatch = parseFloatIfMatch;
exports.getAndroidVersion = getAndroidVersion;
exports.getChromiumVersion = getChromiumVersion;
exports.getSafariVersion = getSafariVersion;
exports.getKindleVersion = getKindleVersion;
exports.getOtherOS = getOtherOS;
exports.getAppleOS = getAppleOS;
exports.getMicrosoftOS = getMicrosoftOS;
exports.getAndroidOS = getAndroidOS;
exports.getKindleOS = getKindleOS;
exports.getOsFromUa = getOsFromUa;
