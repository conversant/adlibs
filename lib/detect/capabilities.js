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

/**
 * Detect browser's capabilities and returns an object
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

	var capabilities = {};

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

	// VIDEO CODECS: H.264, OGG, WEBM
	capabilities.h264 = videoSupport && supportsCodec('video/mp4; codecs="avc1.42E01E"');
	capabilities.ogg = videoSupport && supportsCodec('video/ogg; codecs="theora"');
	capabilities.webm = videoSupport && supportsCodec('video/webm; codecs="vp8"');

	// WEBGL
	capabilities.webgl = !!has('WebGLRenderingContext', win);

	// PERFORMANCE API
	capabilities.performance = !!has('performance', win);

	// PERFORMANCE TIMING
	capabilities.performanceTiming = can(has('performance', win), 'timing');

	// PERFORMANCE NAVIGATION
	capabilities.performanceNavigation = can(has('performance', win), 'navigation');

	// NATIVE JSON SUPPORT
	capabilities.json = can(has('JSON', win), 'parse');

	// POST MESSAGE
	capabilities.post = !!has('postMessage', win);

	// XHR CROSS ORIGIN SUPPORT
	capabilities.xhr = XHR.supportsCORS();

	// CURRENT DEVICE ORIENTATION
	capabilities.deviceOrientation = !!has('DeviceOrientationEvent', win);

	// DEVICE MOTION EVENTS
	capabilities.deviceMotionEvents = !!has('DeviceMotionEvent', win);

	// MOBILE TOUCH EVENTS
	capabilities.touchEvents = (!!has('ontouchstart', win) || document instanceof run(win, 'DocumentTouch'));

	// IFRAME SANDBOX PROTECTION
	capabilities.iframeSandbox = can(iframeElement, 'sandbox');

	// IFRAME SEAMLESS STYLING
	capabilities.iframeSeamless = can(iframeElement, 'seamless');

	// CURRENT WINDOW CONTEXT IS AN IFRAME
	capabilities.iframe = win !== top;

	// PARENT WINDOW CONTEXT IS TOP LEVEL WINDOW
	capabilities.parentTop = parent === top;

	// SAME DOMAIN IFRAME
	capabilities.sameDomainIframe = window === top || (location === has('location', top));

	// COMPATIBILITY MODE
	capabilities.compatibilityMode = !!(!has('addEventListener', win) && !!can(document, 'documentMode') && document.documentMode === 7);

	// IE <= 10
	capabilities.olderIE = !!has('ActiveXObject', win);

	// SPEECH SYNTHESIS API
	capabilities.speechSynthesis = !!has('speechSynthesis', win);

	// INTERNATIONALIZATION API
	capabilities.intl = !!has('Intl', win);

	// PERMISSIONS API
	capabilities.permissions = !!can(has('navigator', win), 'permissions');

	// AMBIENT LIGHT API
	capabilities.ambientLight = !!has('ondevicelight', win);

	// SET IMMEDIATE FUNCTION
	capabilities.setImmediate = !!has('setImmediate', win);

	// MATCH MEDIA
	capabilities.matchMedia = !!has('matchMedia', win);

	// ES6 NUMBER SUPPORT
	capabilities.isFinite = !!has('isFinite', win);

	// NOTIFICATION API
	capabilities.notificationAPI = !!has('Notification', win);

	// SERVER SENT EVENT API
	capabilities.eventSource = !!has('EventSource', win);

	// PUSH MESSAGE DATA
	capabilities.pushMessageData = !!has('PushMessageData', win);

	// POINTER EVENTS
	capabilities.pointerEvents = !!has('PointerEvent', win);

	// INPUT METHOD EDITOR API
	capabilities.inputMethod = !!has('MSInputMethodContext', win);

	// PROXIMITY API
	capabilities.deviceProximity = !!has('ondeviceproximity', win);

	// BROADCAST CHANNEL
	capabilities.broadcastChannel = !!has('BroadcastChannel', win);

	// SPEECH RECOGNITION API
	capabilities.webkitSpeechRecognition = !!has('webkitSpeechRecognition', win);

	// POINTER LOCK API
	capabilities.pointerLock = !!can(has('document', win), 'pointerLockElement');

	// PROXY API
	capabilities.proxy = !!has('Proxy', win);

	module.exports.details = capabilities;

	return capabilities;
};


exports.detect = detect;

// ****** END CAPABILITY MAP CODE ******* //
