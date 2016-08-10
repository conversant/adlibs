/**
 * @module Capabilities
 * @typicalname capabilities
 * @desc Determines browser's capabilities (e.g. CORS support, sandboxable, video support, etc.)
 * @example
 * ```javascript
 * var capabilities = require("ad-libs.js/lib/detect/capabilities");
 * ```
 */

/**
 * @type screen
 * @property {Object} deviceXDPI
 * @property {Object} logicalXDPI
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
 * @property {String} msDoNotTrack
 * @property {String} doNotTrack
 * @ignore
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

/* jshint strict: false, nonstandard: true, browser: true, moz: true, esnext: true, es5: true */

// ****** BEGIN CAPABILITY MAP CODE ******* //

'use strict';

var can = require('../canHas').can,
	has = require('../canHas').has,
	run = require('../canHas').run;

var indexNames = [
	'CANVAS',
	'H264',
	'OGG',
	'WEBM',
	'WEBGL',
	'PERF',
	'PERF_TIME',
	'PERF_NAV',
	'JSON',
	'POST_MESSAGE',
	'CORS',
	'ORIENTATION',
	'MOTION',
	'TOUCH',
	'SANDBOXABLE',
	'SEAMLESS',
	'FRAMED',
	'ONE_DEEP',
	'FRIENDLY',
	'QUIRKS',
	'ACTIVEX',
	'SPEECHSYNTH',
	'INTERNATIONAL',
	'PERMISSIONS',
	'AMBIENT',
	'SET_IMMEDIATE',
	'MATCHMEDIA',
	'IS_FINITE',
	'NOTIFICATION',
	'EVENT_SOURCE',
	'PUSH_MESSAGE_DATA',
	'POINTER_EVENTS',
	'IME_API',
	'PROXIMITY',
	'BROADCAST_CHANNEL',
	'SPEECH_RECOGNITION',
	'POINTER_LOCK',
	'PROXY'
];

/**
 * Detects browser's capabilities and returns an object.
 * @method detect
 * @static
 * @returns {Object}
 * @example
 * ```js
 * // Outputs whether the browser supports h264 video ( 1 if yes, else 0)
 * var h264 = capabilities.detect().h264;
 * ```
 */
var detect = function (win) {
	win = win || window;

	var document = win.document,
		top = win.top,
		parent = win.parent,
		iframeElement = document.createElement('iframe'),
		videoElement = document.createElement('video'),
		canvasElement = document.createElement('canvas'),
		videoSupport = can(videoElement, 'canPlayType'),
		XHR = require('../xhr');

	var results = [],
		capabilities = {};

	var save = function (result) {
		results.push(result === true ? 1 : 0);
	};

	var supportsCodec = function (codec) {
		var supported = '';

		// IE 9 on Windows without media features will throw a 'Not Implemented' error.
		// Good explanations here:
		// https://github.com/videojs/video.js/issues/290
		// https://github.com/Modernizr/Modernizr/issues/224
		try {
			supported = videoElement.canPlayType(codec);
		} catch (e) {}

		return typeof supported === 'string' && (supported.replace(/^no$/, '') !== '');
	};

	// CANVAS
	capabilities.canvas = !!(can(canvasElement, 'getContext') && canvasElement.getContext('2d'));
	save(capabilities.canvas);

	// VIDEO CODECS: H.264, OGG, WEBM
	capabilities.h264 = videoSupport && supportsCodec('video/mp4; codecs="avc1.42E01E"');
	capabilities.ogg = videoSupport && supportsCodec('video/ogg; codecs="theora"');
	capabilities.webm = videoSupport && supportsCodec('video/webm; codecs="vp8"');
	save(capabilities.h264);
	save(capabilities.ogg);
	save(capabilities.webm);

	// WEBGL
	capabilities.webgl = !!has('WebGLRenderingContext', win);
	save(capabilities.webgl);

	// PERFORMANCE API
	capabilities.performance = !!has('performance', win);
	save(capabilities.performance);

	// PERFORMANCE TIMING
	capabilities.performanceTiming = can(has('performance', win), 'timing');
	save(capabilities.performanceTiming);

	// PERFORMANCE NAVIGATION
	capabilities.performanceNavigation = can(has('performance', win), 'navigation');
	save(capabilities.performanceNavigation);

	// NATIVE JSON SUPPORT
	capabilities.json = can(has('JSON', win), 'parse');
	save(capabilities.json);

	// POST MESSAGE
	capabilities.post = !!has('postMessage', win);
	save(capabilities.post);

	// XHR CROSS ORIGIN SUPPORT
	capabilities.xhr = XHR.supportsCORS();
	save(capabilities.xhr);

	// CURRENT DEVICE ORIENTATION
	capabilities.deviceOrientation = !!has('DeviceOrientationEvent', win);
	save(capabilities.deviceOrientation);

	// DEVICE MOTION EVENTS
	capabilities.deviceMotionEvents = !!has('DeviceMotionEvent', win);
	save(capabilities.deviceMotionEvents);

	// MOBILE TOUCH EVENTS
	capabilities.touchEvents = (!!has('ontouchstart', win) || document instanceof run(win, 'DocumentTouch'));
	save(capabilities.touchEvents);

	// IFRAME SANDBOX PROTECTION
	capabilities.iframeSandbox = can(iframeElement, 'sandbox');
	save(capabilities.iframeSandbox);

	// IFRAME SEAMLESS STYLING
	capabilities.iframeSeamless = can(iframeElement, 'seamless');
	save(capabilities.iframeSeamless);

	// CURRENT WINDOW CONTEXT IS AN IFRAME
	capabilities.iframe = win !== top;
	save(capabilities.iframe);

	// PARENT WINDOW CONTEXT IS TOP LEVEL WINDOW
	capabilities.parentTop = parent === top;
	save(capabilities.parentTop);

	// SAME DOMAIN IFRAME
	capabilities.sameDomainIframe = window === top || (location === has('location', top));
	save(capabilities.sameDomainIframe);

	// COMPATIBILITY MODE
	capabilities.compatibilityMode = !!(!has('addEventListener', win) && !!can(document, 'documentMode') && document.documentMode === 7);
	save(capabilities.compatibilityMode);

	// IE <= 10
	capabilities.olderIE = !!has('ActiveXObject', win);
	save(capabilities.olderIE);

	// SPEECH SYNTHESIS API
	capabilities.speechSynthesis = !!has('speechSynthesis', win);
	save(capabilities.speechSynthesis);

	// INTERNATIONALIZATION API
	capabilities.intl = !!has('Intl', win);
	save(capabilities.intl);

	// PERMISSIONS API
	capabilities.permissions = !!can(has('navigator', win), 'permissions');
	save(capabilities.permissions);

	// AMBIENT LIGHT API
	capabilities.ambientLight = !!has('ondevicelight', win);
	save(capabilities.ambientLight);

	// SET IMMEDIATE FUNCTION
	capabilities.setImmediate = !!has('setImmediate', win);
	save(capabilities.setImmediate);

	// MATCH MEDIA
	capabilities.matchMedia = !!has('matchMedia', win);
	save(capabilities.matchMedia);

	// ES6 NUMBER SUPPORT
	capabilities.isFinite = !!has('isFinite', win);
	save(capabilities.isFinite);

	// NOTIFICATION API
	capabilities.notificationAPI = !!has('Notification', win);
	save(capabilities.notificationAPI);

	// SERVER SENT EVENT API
	capabilities.eventSource = !!has('EventSource', win);
	save(capabilities.eventSource);

	// PUSH MESSAGE DATA
	capabilities.pushMessageData = !!has('PushMessageData', win);
	save(capabilities.pushMessageData);

	// POINTER EVENTS
	capabilities.pointerEvents = !!has('PointerEvent', win);
	save(capabilities.pointerEvents);

	// INPUT METHOD EDITOR API
	capabilities.inputMethod = !!has('MSInputMethodContext', win);
	save(capabilities.inputMethod);

	// PROXIMITY API
	capabilities.deviceProximity = !!has('ondeviceproximity', win);
	save(capabilities.deviceProximity);

	// BROADCAST CHANNEL
	capabilities.broadcastChannel = !!has('BroadcastChannel', win);
	save(capabilities.broadcastChannel);

	// SPEECH RECOGNITION API
	capabilities.webkitSpeechRecognition = !!has('webkitSpeechRecognition', win);
	save(capabilities.webkitSpeechRecognition);

	// POINTER LOCK API
	capabilities.pointerLock = !!can(has('document', win), 'pointerLockElement');
	save(capabilities.pointerLock);

	// PROXY API
	capabilities.proxy = !!has('Proxy', win);
	save(capabilities.proxy)

	/**
	 * @TODO: indexOf is only supported in IE9+, this needs to be updated to account for IE8
	 * Probably wont have this here. instead, it will be methods calling to only the properties that need to be exposed and nothing else.
	 * @param {String} key
	 * @returns {*}
	 */
	module.exports.read = function (key) {
		return results[indexNames.indexOf(key)];
	};

	module.exports.details = capabilities;
	module.exports.results = results;

	return capabilities;
};

exports.indexNames = indexNames;
exports.detect = detect;

// ****** END CAPABILITY MAP CODE ******* //
